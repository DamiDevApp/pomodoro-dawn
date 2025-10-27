"use strict";
const electron = require("electron");
console.log("=== Preload script is running ===");
try {
  electron.contextBridge.exposeInMainWorld("electron", {
    showNotification: (title, body, sound) => {
      console.log("=== showNotification called from renderer ===", { title, body, sound });
      return electron.ipcRenderer.invoke("show-notification", { title, body, sound });
    }
  });
  console.log("=== contextBridge.exposeInMainWorld successful ===");
} catch (error) {
  console.error("=== Error in preload script ===", error);
}
