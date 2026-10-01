const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  printTicket: (options) => ipcRenderer.invoke('print-to-printer', options),
  getPrinters: () => ipcRenderer.invoke('get-printers')
});
