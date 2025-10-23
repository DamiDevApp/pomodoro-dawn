import { useCallback } from 'react';

interface NotificationOptions {
  body: string;
  sound?: boolean | string;
}

export function useElectronNotifications() {
  const isElectron =
    typeof window !== 'undefined' && window.electron !== undefined;

  const sendNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (!isElectron) {
        console.warn('Not running in electron environment');
        return false;
      }

      try {
        const result = await window.electron!.showNotification(
          title,
          options?.body || '',
          options?.sound
        );
        return { success: true };
      } catch (e) {
        console.error('Error sending notification: ', e);
        return { success: false };
      }
    },
    [isElectron]
  );

  return {
    sendNotification,
    isElectron,
  };
}
