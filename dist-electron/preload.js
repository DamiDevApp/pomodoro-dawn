import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electron", {
  showNotification: (title, body, sound) => ipcRenderer.invoke("show-notification", { title, body, sound })
});
