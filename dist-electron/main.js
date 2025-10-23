import { app, BrowserWindow, ipcMain, Notification } from "electron";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
ipcMain.handle(
  "show-notification",
  async (_event, {
    title,
    body,
    sound
  }) => {
    try {
      const notification = new Notification({
        title,
        body,
        sound: sound ? typeof sound === "string" ? sound : void 0 : void 0
      });
      notification.show();
      notification.on("click", () => {
        if (mainWindow) {
          if (mainWindow.isMinimized()) {
            mainWindow.restore();
          }
          mainWindow.focus();
        }
      });
      return { success: true };
    } catch (e) {
      console.error("Error showing notification", e);
      return {
        success: false,
        error: e instanceof Error ? e.message : "Unknown error"
      };
    }
  }
);
