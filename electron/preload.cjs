const { contextBridge, ipcRenderer } = require('electron');

const electronBridge = {
  isElectron: true,
  on: (channel, callback) => {
    const listener = (event, ...args) => callback(...args);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  },
  // Scale Helpers
  getComPorts: () => ipcRenderer.invoke('wb:getComPorts'),
  connectScale: (params) => ipcRenderer.invoke('wb:connect', params),
  disconnectScale: () => ipcRenderer.invoke('wb:disconnect'),
  retryScale: () => ipcRenderer.send('retry-scale'),
  
  // Camera & CCTV Helpers
  getSnapshot: (ip, port) => ipcRenderer.invoke('get-snapshot', ip, port),
  startLiveFeed: (ip) => ipcRenderer.invoke('start-live-feed', ip),
  stopLiveFeed: () => ipcRenderer.invoke('stop-live-feed'),
  setCameraAuth: (creds) => ipcRenderer.send('set-camera-auth', creds),

  // Printing Helpers
  printTicket: (options) => ipcRenderer.invoke('print-to-printer', options),
  getPrinters: () => ipcRenderer.invoke('get-printers')
};

// Expose under both namespaces for seamless compatibility
contextBridge.exposeInMainWorld('electron', electronBridge);
contextBridge.exposeInMainWorld('electronAPI', electronBridge);

