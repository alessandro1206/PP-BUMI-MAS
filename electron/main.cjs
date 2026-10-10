const { app, BrowserWindow, ipcMain, session, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');

let mainWindow = null;
let scalePort = null;
let currentScaleConfig = { port: 'COM4', baudRate: 9600, protocol: 'universal' };
let cameraCredentials = { user: 'admin', pass: 'Admin123' };
let ffmpegProcess = null;
let mjpegServer = null;
const MJPEG_PORT = 9876;

// Dynamically require serialport with fallback
let SerialPort = null;
let ReadlineParser = null;
try {
  const spModule = require('serialport');
  SerialPort = spModule.SerialPort || spModule;
  const parserModule = require('@serialport/parser-readline');
  ReadlineParser = parserModule.ReadlineParser || parserModule;
  console.log('[MAIN] SerialPort module loaded successfully');
} catch (e) {
  console.log('[MAIN] Note: native serialport module not yet built/installed:', e.message);
}

// Diagnostic logger to renderer
function sendLog(msg) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('diagnostic-log', msg);
  }
  console.log(`[MAIN] ${msg}`);
}

// -------------------------------------------------------------
// Industrial Scale Parser (CAS 200i, Yaohua, Toledo, Universal)
// -------------------------------------------------------------
function parseWeightLine(line, protocol = 'universal') {
  const trimmed = line.trim();
  let weight = null;
  let isStable = trimmed.startsWith('ST') || trimmed.includes('ST,') || (!trimmed.includes('US') && !trimmed.startsWith('US'));

  if (protocol === 'yaohua') {
    // Yaohua XK3190 A12/A9 format: =015420 or =+015420
    const yMatch = trimmed.match(/[=](\+|-)?(\d+)/);
    if (yMatch) {
      weight = parseFloat(yMatch[2]);
    } else {
      const match = trimmed.match(/[-+]?\s*\d*\.?\d+/);
      if (match) weight = parseFloat(match[0].trim());
    }
  } else {
    // CAS CI-2001 / CAS 200i / Toledo / Universal
    const match = trimmed.match(/([+-]?\d+\.?\d*)/);
    if (match) {
      const v = parseFloat(match[1]);
      if (!isNaN(v)) weight = v;
    }
  }

  return { weight, raw: trimmed, stable: isStable, unit: 'KG' };
}

// -------------------------------------------------------------
// Scale Connection Manager (Native RS-232 COM Port)
// -------------------------------------------------------------
function connectNativeScale(portName = 'COM4', baudRate = 9600, protocol = 'universal') {
  currentScaleConfig = { port: portName, baudRate, protocol };

  if (!SerialPort) {
    const errorMsg = 'Modul SerialPort native belum tersedia. Silakan gunakan Web Serial di browser atau jalankan npm install.';
    sendLog(`[SCALE ERROR] ${errorMsg}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('scale-status', { connected: false, error: errorMsg });
    }
    return { success: false, error: errorMsg };
  }

  if (scalePort && scalePort.isOpen) {
    try {
      scalePort.close();
    } catch (e) {}
    scalePort = null;
  }

  sendLog(`[SCALE] Mencoba menghubungkan ke ${portName} @ ${baudRate} baud...`);

  try {
    scalePort = new SerialPort({
      path: portName,
      baudRate: parseInt(baudRate, 10) || 9600,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      autoOpen: false
    });

    const parser = scalePort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    scalePort.open((err) => {
      if (err) {
        sendLog(`[SCALE] Gagal membuka port ${portName}: ${err.message}`);
        if (SerialPort.list) {
          SerialPort.list().then(ports => {
            const portList = ports.map(p => p.path).join(', ');
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('scale-status', {
                connected: false,
                port: portName,
                error: `Gagal membuka ${portName}: ${err.message}. Port terdeteksi: ${portList || 'Tidak ada'}`
              });
            }
          }).catch(() => {});
        }
        return;
      }

      sendLog(`[SCALE] Terhubung ke ${portName} (${protocol.toUpperCase()})`);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('scale-status', { connected: true, port: portName });
      }
    });

    parser.on('data', (rawData) => {
      const parsed = parseWeightLine(rawData, currentScaleConfig.protocol);
      if (parsed.weight !== null && !isNaN(parsed.weight) && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('scale-data', parsed);
        mainWindow.webContents.send('wb:weight', { value: parsed.weight, raw: parsed.raw, stable: parsed.stable });
      }
    });

    scalePort.on('error', (err) => {
      sendLog(`[SCALE ERROR] ${err.message}`);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('scale-status', { connected: false, error: err.message });
      }
    });

    scalePort.on('close', () => {
      sendLog(`[SCALE] Port ${portName} terputus.`);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('scale-status', { connected: false });
      }
    });

    return { success: true, message: `Menghubungkan ke ${portName}...` };
  } catch (err) {
    sendLog(`[SCALE EXCEPTION] ${err.message}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('scale-status', { connected: false, error: err.message });
    }
    return { success: false, error: err.message };
  }
}

function disconnectNativeScale() {
  if (scalePort && scalePort.isOpen) {
    try {
      scalePort.close();
      scalePort = null;
      sendLog('[SCALE] Port ditutup.');
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  return { success: true };
}

// -------------------------------------------------------------
// Dahua & IP Camera Digest Auth Snapshot Helpers
// -------------------------------------------------------------
const parseDigestChallenge = (header) => {
  const result = {};
  const digestString = header.replace(/^Digest\s+/i, '');
  const regex = /([a-z]+)=("[^"]*"|[^,]*)/gi;
  let match;
  while ((match = regex.exec(digestString)) !== null) {
    let key = match[1].toLowerCase();
    let value = match[2].replace(/^"|"$/g, '');
    result[key] = value;
  }
  return result;
};

const generateDigestAuthHeader = (method, uri, challenge, user, pass) => {
  const ha1 = crypto.createHash('md5').update(`${user}:${challenge.realm}:${pass}`).digest('hex');
  const ha2 = crypto.createHash('md5').update(`${method}:${uri}`).digest('hex');
  const cnonce = crypto.randomBytes(8).toString('hex');
  const nc = '00000001';
  let response = '';
  let authHeader = `Digest username="${user}", realm="${challenge.realm}", nonce="${challenge.nonce}", uri="${uri}"`;

  if (challenge.qop) {
    const qopList = challenge.qop.split(',').map(q => q.trim().replace(/^"|"$/g, ''));
    if (qopList.includes('auth')) {
      response = crypto.createHash('md5').update(`${ha1}:${challenge.nonce}:${nc}:${cnonce}:auth:${ha2}`).digest('hex');
      authHeader += `, qop=auth, nc=${nc}, cnonce="${cnonce}"`;
    } else {
      response = crypto.createHash('md5').update(`${ha1}:${challenge.nonce}:${ha2}`).digest('hex');
    }
  } else {
    response = crypto.createHash('md5').update(`${ha1}:${challenge.nonce}:${ha2}`).digest('hex');
  }

  authHeader += `, response="${response}"`;
  if (challenge.opaque) authHeader += `, opaque="${challenge.opaque}"`;
  if (challenge.algorithm) authHeader += `, algorithm="${challenge.algorithm}"`;

  return authHeader;
};

function stopLiveFeed() {
  if (ffmpegProcess) {
    try { ffmpegProcess.kill('SIGTERM'); } catch (e) {}
    ffmpegProcess = null;
  }
  if (mjpegServer) {
    try { mjpegServer.close(); } catch (e) {}
    mjpegServer = null;
  }
}

// -------------------------------------------------------------
// Main Window Creation
// -------------------------------------------------------------
function createWindow() {
  const iconPath = path.join(__dirname, '../app_icon.ico');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'PT. BUMI MAS - Sistem ERP & Jembatan Timbang (Weighbridge PRO)',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      sandbox: false
    }
  });

  // Web Serial & COM Hardware Permissions in Electron
  const ses = mainWindow.webContents.session;

  ses.on('select-serial-port', (event, portList, webContents, callback) => {
    event.preventDefault();
    if (portList && portList.length > 0) {
      callback(portList[0].portId);
    } else {
      callback('');
    }
  });

  ses.setPermissionCheckHandler((webContents, permission) => {
    return true;
  });

  ses.setDevicePermissionHandler((details) => {
    return true;
  });

  // Auto-authenticate camera requests (Digest/Basic Auth)
  mainWindow.webContents.on('login', (event, details, authInfo, callback) => {
    event.preventDefault();
    console.log(`[MAIN] Auth Challenge from: ${authInfo.host} (${authInfo.scheme})`);
    callback(cameraCredentials.user, cameraCredentials.pass);
  });

  // Inject Electron flag into window
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      window.__ELECTRON__ = true;
      window.dispatchEvent(new Event('electron-ready'));
    `).catch(() => {});
  });

  // Load Application
  const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
  const distPath = path.join(__dirname, '../dist/index.html');

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else if (fs.existsSync(distPath)) {
    mainWindow.loadFile(distPath);
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.maximize();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Auto-connect scale on startup (similar to RiceFlow Enterprise)
  setTimeout(() => {
    if (SerialPort) {
      SerialPort.list().then(ports => {
        const portNames = ports.map(p => p.path);
        sendLog(`[INIT] Port serial terdeteksi: ${portNames.join(', ') || 'None'}`);
        // Default to COM4 or first port if COM4 exists
        const targetPort = portNames.includes('COM4') ? 'COM4' : (portNames[0] || 'COM4');
        connectNativeScale(targetPort, 9600, 'universal');
      }).catch(err => {
        connectNativeScale('COM4', 9600, 'universal');
      });
    }
  }, 1500);
}

// -------------------------------------------------------------
// IPC Handlers - Scale (RS232 / COM)
// -------------------------------------------------------------
ipcMain.handle('wb:getComPorts', async () => {
  if (SerialPort && SerialPort.list) {
    try {
      const ports = await SerialPort.list();
      return { success: true, ports: ports.map(p => p.path) };
    } catch (e) {
      return { success: false, error: e.message, ports: ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6'] };
    }
  }
  return { success: true, ports: ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6'] };
});

ipcMain.handle('wb:connect', async (event, params) => {
  const { port = 'COM4', baudRate = 9600, protocol = 'universal' } = params || {};
  return connectNativeScale(port, baudRate, protocol);
});

ipcMain.handle('wb:disconnect', async () => {
  return disconnectNativeScale();
});

ipcMain.on('retry-scale', () => {
  sendLog('[MAIN] Permintaan reconnect scale manual diterima');
  connectNativeScale(currentScaleConfig.port, currentScaleConfig.baudRate, currentScaleConfig.protocol);
});

// -------------------------------------------------------------
// IPC Handlers - Dahua & IP Camera Snapshot & RTSP
// -------------------------------------------------------------
ipcMain.on('set-camera-auth', (event, creds) => {
  if (creds && creds.user) {
    cameraCredentials = creds;
    sendLog(`[MAIN] Update kredensial kamera: user=${creds.user}`);
  }
});

ipcMain.handle('get-snapshot', async (event, ip = '192.168.1.108', port = 80) => {
  const httpPort = parseInt(port, 10) || 80;
  sendLog(`[CAM] Mengambil snapshot dari ${ip}:${httpPort}...`);

  return new Promise((resolve, reject) => {
    const snapshotPath = '/cgi-bin/snapshot.cgi?channel=1';
    const options = {
      host: ip,
      port: httpPort,
      path: snapshotPath,
      method: 'GET',
      timeout: 10000
    };

    const makeRequest = (authHeader = null, isRetry = false) => {
      const reqOptions = { ...options };
      if (authHeader) reqOptions.headers = { 'Authorization': authHeader };

      const req = http.request(reqOptions, (res) => {
        if (res.statusCode === 401) {
          if (isRetry) {
            sendLog('[CAM] Error: Autentikasi tetap gagal (401).');
            return reject(new Error('Gagal login kamera (401). Periksa user & password.'));
          }

          const challengeHeader = res.headers['www-authenticate'] || res.headers['WWW-Authenticate'];
          if (!challengeHeader) {
            const basic = 'Basic ' + Buffer.from(`${cameraCredentials.user}:${cameraCredentials.pass}`).toString('base64');
            makeRequest(basic, true);
            return;
          }

          if (challengeHeader.toLowerCase().startsWith('digest')) {
            const challenge = parseDigestChallenge(challengeHeader);
            const newAuthHeader = generateDigestAuthHeader('GET', snapshotPath, challenge, cameraCredentials.user, cameraCredentials.pass);
            makeRequest(newAuthHeader, true);
          } else {
            const basic = 'Basic ' + Buffer.from(`${cameraCredentials.user}:${cameraCredentials.pass}`).toString('base64');
            makeRequest(basic, true);
          }
          return;
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Kamera HTTP error: ${res.statusCode}`));
        }

        const data = [];
        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(data);
          sendLog(`[CAM] Snapshot berhasil! (${(buffer.length / 1024).toFixed(1)} KB)`);
          resolve(`data:image/jpeg;base64,${buffer.toString('base64')}`);
        });
      });

      req.on('error', (err) => {
        sendLog(`[CAM] Network error: ${err.message}`);
        reject(new Error(`Kamera gagal dihubungi: ${err.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Koneksi kamera timeout (10 detik)'));
      });

      req.end();
    };

    makeRequest();
  });
});

ipcMain.handle('start-live-feed', async (event, ip = '192.168.1.108') => {
  stopLiveFeed();

  return new Promise((resolve) => {
    const rtspUrl = `rtsp://${cameraCredentials.user}:${cameraCredentials.pass}@${ip}:554/cam/realmonitor?channel=1&subtype=1`;
    let mjpegClients = [];

    mjpegServer = http.createServer((req, res) => {
      res.writeHead(200, {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Connection': 'close',
        'Content-Type': 'multipart/x-mixed-replace; boundary=--myboundary',
        'Access-Control-Allow-Origin': '*'
      });
      mjpegClients.push(res);
      req.on('close', () => {
        mjpegClients = mjpegClients.filter(c => c !== res);
      });
    });

    mjpegServer.listen(MJPEG_PORT, '127.0.0.1', () => {
      sendLog(`[CAM] MJPEG stream server berjalan di http://127.0.0.1:${MJPEG_PORT}`);
    });

    try {
      ffmpegProcess = spawn('ffmpeg', [
        '-rtsp_transport', 'tcp',
        '-i', rtspUrl,
        '-f', 'mjpeg',
        '-q:v', '5',
        '-r', '10',
        '-s', '640x480',
        '-an',
        'pipe:1'
      ], { stdio: ['ignore', 'pipe', 'pipe'] });

      let buffer = Buffer.alloc(0);
      const JPEG_START = Buffer.from([0xFF, 0xD8]);
      const JPEG_END = Buffer.from([0xFF, 0xD9]);

      ffmpegProcess.stdout.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        let startIdx = 0;
        while (true) {
          const start = buffer.indexOf(JPEG_START, startIdx);
          if (start === -1) break;
          const end = buffer.indexOf(JPEG_END, start + 2);
          if (end === -1) break;

          const frame = buffer.slice(start, end + 2);

          mjpegClients.forEach(client => {
            try {
              client.write(`--myboundary\r\nContent-Type: image/jpeg\r\nContent-Length: ${frame.length}\r\n\r\n`);
              client.write(frame);
              client.write('\r\n');
            } catch (e) {}
          });

          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('live-frame', `data:image/jpeg;base64,${frame.toString('base64')}`);
          }

          startIdx = end + 2;
        }
        if (startIdx > 0) buffer = buffer.slice(startIdx);
        if (buffer.length > 5 * 1024 * 1024) buffer = Buffer.alloc(0);
      });

      ffmpegProcess.on('close', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('live-feed-stopped');
        }
      });

      ffmpegProcess.on('error', (err) => {
        sendLog(`[CAM] ffmpeg spawn error: ${err.message}`);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('live-feed-error', 'ffmpeg tidak ditemukan. Pastikan ffmpeg terpasang.');
        }
      });

      resolve({ success: true, url: `http://127.0.0.1:${MJPEG_PORT}` });
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
});

ipcMain.handle('stop-live-feed', async () => {
  stopLiveFeed();
  return { success: true };
});

// -------------------------------------------------------------
// IPC Handlers - Printing
// -------------------------------------------------------------
ipcMain.handle('print-to-printer', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { success: false, error: 'Window not found' };

  return new Promise((resolve) => {
    win.webContents.print(
      options || { silent: false, printBackground: true },
      (success, failureReason) => {
        resolve({ success, failureReason });
      }
    );
  });
});

ipcMain.handle('get-printers', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return [];
  try {
    return await win.webContents.getPrintersAsync();
  } catch (e) {
    return [];
  }
});

// -------------------------------------------------------------
// App Lifecycle
// -------------------------------------------------------------
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  stopLiveFeed();
  disconnectNativeScale();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
