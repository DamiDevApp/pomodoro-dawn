import { contextBridge, ipcRenderer } from 'electron';

console.log('=== Preload script is running ===');

export interface ElectronAPI {
  showNotification: (
    title: string,
    body: string,
    sound?: boolean | string
  ) => Promise<{ success: boolean; error?: string }>;
}

try {
  contextBridge.exposeInMainWorld('electron', {
    showNotification: (title: string, body: string, sound?: boolean | string) => {
      console.log('=== showNotification called from renderer ===', { title, body, sound });
      return ipcRenderer.invoke('show-notification', { title, body, sound });
    }
  } as ElectronAPI);

  console.log('=== contextBridge.exposeInMainWorld successful ===');
} catch (error) {
  console.error('=== Error in preload script ===', error);
}
