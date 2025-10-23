export interface ElectronAPI {
  showNotification: (
    title: string,
    body: string,
    sound?: boolean | string
  ) => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
