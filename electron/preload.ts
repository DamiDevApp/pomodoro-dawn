const { contextBridge, ipcRenderer } = require('electron');

console.log('=== Preload script is running ===');

try {
  contextBridge.exposeInMainWorld('electron', {
    showNotification: (title: string, body: string, sound?: boolean | string) => {
      console.log('=== showNotification called from renderer ===', { title, body, sound });
      return ipcRenderer.invoke('show-notification', { title, body, sound });
    }
  });

  console.log('=== contextBridge.exposeInMainWorld successful ===');
} catch (error) {
  console.error('=== Error in preload script ===', error);
}
