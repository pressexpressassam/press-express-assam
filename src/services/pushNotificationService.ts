import { AppNotification, NewsCategory, NotificationSettings } from '../types';

class PushNotificationService {
  private listeners: ((notification: AppNotification) => void)[] = [];
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Lazy AudioContext to avoid autoplays
  }

  private playChime() {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (this.audioCtx) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.35);
      }
    } catch {
      // Audio might not be allowed before user gesture
    }
  }

  public async requestBrowserPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  public isBrowserPermissionGranted(): boolean {
    if (!('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }

  public subscribe(callback: (notification: AppNotification) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public dispatchNotification(
    title: string,
    body: string,
    category: NewsCategory,
    settings: NotificationSettings,
    articleId?: string,
    isBreaking = false
  ): void {
    // Check if category is enabled in user settings
    if (!settings.pushEnabled) return;
    if (isBreaking && !settings.breakingNewsAlerts) return;
    if (category === 'wildlife-floods' && !settings.floodWeatherAlerts) return;
    if (category === 'tea-economy' && !settings.teaEconomyAlerts) return;
    if (category === 'politics' && !settings.politicsAlerts) return;
    if (category === 'guwahati' && !settings.guwahatiLocalAlerts) return;
    if (category === 'sports' && !settings.sportsAlerts) return;

    const notification: AppNotification = {
      id: 'notif-' + Date.now(),
      title,
      body,
      category,
      articleId,
      timestamp: new Date().toISOString(),
      read: false,
      isBreaking,
    };

    // Play subtle chime
    if (settings.soundEnabled) {
      this.playChime();
    }

    // Try native browser notification if granted
    if (this.isBrowserPermissionGranted()) {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'press-express-' + category,
        });
      } catch {
        // Fallback silently if browser restricts
      }
    }

    // Notify in-app UI listeners
    this.listeners.forEach(cb => cb(notification));
  }
}

export const pushNotificationService = new PushNotificationService();
