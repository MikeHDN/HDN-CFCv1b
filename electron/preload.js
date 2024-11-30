const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  store: {
    get: (key) => ipcRenderer.invoke('get-stored-data', key),
    set: (key, value) => ipcRenderer.invoke('set-stored-data', key, value),
  },
});