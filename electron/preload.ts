import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  showNotification: (
    title: string,
    body: string,
    sound?: boolean | string
  ) => Promise<{ success: boolean; error?: string }>;
}

// Export the protected methods that allow the renderer to use processes
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  showNotification: (title: string, body: string, sound?: boolean | string) =>
    ipcRenderer.invoke('show-notification', { title, body, sound }),
} as ElectronAPI);
