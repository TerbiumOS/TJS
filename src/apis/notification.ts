/**
 * Notification API
 * Provides cross-environment notification support
 */

import type { NotificationAPI, NotificationOptions } from '../types';
import { getNativeTerbiumAPI } from '../env';

export class TerbiumNotification implements NotificationAPI {
  private get native() {
    const tb = getNativeTerbiumAPI();
    return tb?.notification;
  }

  private get isTerbium(): boolean {
    return !!this.native;
  }

  /**
   * Show a notification
   * Terbium: uses tb.notification.toast
   * Browser: uses Notification API
   */
  async show(options: NotificationOptions): Promise<void> {
    if (this.isTerbium) {
      this.native.toast({
        title: options.title,
        message: options.message,
        type: options.type || 'info',
        timeout: options.timeout || 5000,
      });
      return;
    }

    // Browser fallback: Notification API
    if ('Notification' in window) {
      // Request permission if needed
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      if (Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.message,
          icon: options.icon,
        });
      } else {
        // Fallback to console if permission denied
        console.log(`[Notification] ${options.title}: ${options.message}`);
      }
    } else {
      // Fallback to console if Notifications not supported
      console.log(`[Notification] ${options.title}: ${options.message}`);
    }
  }

  /**
   * Dismiss a notification
   * Terbium: uses tb.notification.dismiss
   * Browser: Not applicable (browser notifications auto-dismiss)
   */
  async dismiss(id?: string): Promise<void> {
    if (this.isTerbium && this.native.dismiss) {
      this.native.dismiss(id);
    }
    
    // Browser: No-op (notifications auto-dismiss)
  }
}
