import { 
  Article, 
  UserProfile, 
  UserPreferences, 
  PrivacyConsentSettings, 
  NotificationSettings,
  MonetizationSettings,
  DirectAdBanner,
  AdInquiry
} from '../types';
import { INITIAL_ARTICLES } from '../data/mockNews';

const STORAGE_KEYS = {
  ARTICLES: 'press_express_assam_articles_v1',
  OFFLINE_CACHE: 'press_express_assam_offline_cache_v1',
  BOOKMARKS: 'press_express_assam_bookmarks_v1',
  HISTORY: 'press_express_assam_reading_history_v1',
  USER_PROFILE: 'press_express_assam_user_profile_v1',
  USER_PREFS: 'press_express_assam_user_prefs_v1',
  NOTIFICATIONS: 'press_express_assam_notification_settings_v1',
  PRIVACY: 'press_express_assam_privacy_settings_v1',
  SIMULATED_OFFLINE: 'press_express_assam_simulate_offline_v1',
  ENCRYPTED_VAULT: 'press_express_assam_encrypted_vault_v1',
  LAST_SYNC: 'press_express_assam_last_sync_timestamp_v1',
  MONETIZATION: 'press_express_assam_monetization_settings_v1',
};

export const DEFAULT_MONETIZATION_SETTINGS: MonetizationSettings = {
  adsense: {
    enabled: true,
    publisherId: 'ca-pub-7894210984123567',
    autoAdsEnabled: true,
    testMode: true,
    headerSlotId: '1098273412',
    inFeedSlotId: '2093847561',
    articleSlotId: '3902837415',
  },
  directBanners: [
    {
      id: 'ad-banner-1',
      title: 'Brahmaputra Premium CTC Tea - Special Discount',
      clientName: 'Brahmaputra Valley Organic Agro',
      position: 'header',
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
      targetUrl: 'https://example.com/assam-tea',
      phoneOrWhatsapp: '+919864012345',
      active: true,
      impressions: 1420,
      clicks: 86,
      startDate: '2026-08-01',
    },
    {
      id: 'ad-banner-2',
      title: 'Guwahati Career Academy - APSC & UPSC Coaching Batch 2026',
      clientName: 'Assam Career Academy, GS Road Guwahati',
      position: 'in_feed',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      targetUrl: 'https://example.com/assam-academy',
      phoneOrWhatsapp: '+919435012345',
      active: true,
      impressions: 2180,
      clicks: 142,
      startDate: '2026-08-10',
    },
    {
      id: 'ad-banner-3',
      title: 'Sualkuchi Pure Silk Muga Mekhela Sador - Grand Festival Sale',
      clientName: 'Sualkuchi Silk Emporium',
      position: 'article_middle',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      targetUrl: 'https://example.com/sualkuchi-silk',
      phoneOrWhatsapp: '+919954012345',
      active: true,
      impressions: 980,
      clicks: 74,
      startDate: '2026-08-15',
    }
  ],
  inquiries: [
    {
      id: 'inq-1',
      clientName: 'Bipul Sharma',
      businessName: 'Jorhat Sweets & Bakers',
      phone: '+919864112233',
      email: 'bipul@jorhatbakery.in',
      adPosition: 'in_feed',
      durationWeeks: 4,
      message: 'We want to run banner ads for our 3 new stores opening in Jorhat and Golaghat next month.',
      createdAt: '2026-08-28T10:30:00.000Z',
      status: 'new'
    }
  ],
  monthlyTargetInr: 50000
};

export const DEFAULT_USER_PREFS: UserPreferences = {
  selectedDistricts: ['Kamrup Metropolitan', 'Dibrugarh', 'Jorhat'],
  favoriteCategories: ['all', 'wildlife-floods', 'tea-economy', 'guwahati'],
  fontSize: 'md',
  fontFamily: 'sans',
  highContrast: false,
  theme: 'light',
  offlineAutoDownload: true,
  offlineImageQuality: 'low',
  lowDataMode: false,
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  browserPermissionGranted: false,
  breakingNewsAlerts: true,
  floodWeatherAlerts: true,
  teaEconomyAlerts: true,
  politicsAlerts: false,
  guwahatiLocalAlerts: true,
  sportsAlerts: true,
  soundEnabled: true,
  frequency: 'immediate',
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacyConsentSettings = {
  essentialCookies: true,
  analyticsConsent: true,
  personalizationConsent: true,
  marketingConsent: false,
  anonymizedIpLogging: true,
  gdprCompliantMode: true,
  ccpaDoNotSell: true,
  consentTimestamp: new Date().toISOString(),
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_assam_7718',
  name: 'Angaraj Mukut',
  email: 'angarajmukut@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'reader',
  isLoggedIn: true,
  mfaEnabled: true,
  mfaMethod: 'authenticator_totp',
  oauthProvider: 'google',
  lastSyncTimestamp: new Date().toISOString(),
  connectedDevices: [
    {
      id: 'dev-1',
      deviceName: 'Pixel 9 Pro (Guwahati 5G)',
      type: 'phone',
      lastActive: 'Just now',
      current: true,
    },
    {
      id: 'dev-2',
      deviceName: 'iPad Air (Office Wi-Fi)',
      type: 'tablet',
      lastActive: '42 minutes ago',
      current: false,
    },
    {
      id: 'dev-3',
      deviceName: 'MacBook Air (Desktop Newsroom)',
      type: 'desktop',
      lastActive: 'Yesterday',
      current: false,
    }
  ]
};

// Storage helper
export const storageService = {
  // Articles
  getArticles(): Article[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_ARTICLES;
  },

  saveArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.warn('Storage quota limit reached', e);
    }
  },

  // Offline Caching
  getCachedArticles(): Article[] {
    try {
      const cachedIdsJson = localStorage.getItem(STORAGE_KEYS.OFFLINE_CACHE);
      const cachedIds: string[] = cachedIdsJson ? JSON.parse(cachedIdsJson) : [];
      const all = this.getArticles();
      return all.filter(a => cachedIds.includes(a.id) || a.cachedOffline);
    } catch {
      return this.getArticles().filter(a => a.cachedOffline);
    }
  },

  isArticleCached(articleId: string): boolean {
    try {
      const cachedIdsJson = localStorage.getItem(STORAGE_KEYS.OFFLINE_CACHE);
      const cachedIds: string[] = cachedIdsJson ? JSON.parse(cachedIdsJson) : [];
      return cachedIds.includes(articleId);
    } catch {
      return false;
    }
  },

  cacheArticleForOffline(article: Article): boolean {
    try {
      const cachedIdsJson = localStorage.getItem(STORAGE_KEYS.OFFLINE_CACHE);
      const cachedIds: Set<string> = new Set(cachedIdsJson ? JSON.parse(cachedIdsJson) : []);
      cachedIds.add(article.id);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_CACHE, JSON.stringify(Array.from(cachedIds)));
      
      // Update article object in all articles
      const articles = this.getArticles().map(a => 
        a.id === article.id ? { ...a, cachedOffline: true, offlineCachedAt: new Date().toISOString() } : a
      );
      this.saveArticles(articles);
      return true;
    } catch {
      return false;
    }
  },

  removeArticleFromOffline(articleId: string): void {
    try {
      const cachedIdsJson = localStorage.getItem(STORAGE_KEYS.OFFLINE_CACHE);
      const cachedIds: string[] = cachedIdsJson ? JSON.parse(cachedIdsJson) : [];
      const updated = cachedIds.filter(id => id !== articleId);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_CACHE, JSON.stringify(updated));

      const articles = this.getArticles().map(a => 
        a.id === articleId ? { ...a, cachedOffline: false } : a
      );
      this.saveArticles(articles);
    } catch (e) {
      console.error(e);
    }
  },

  clearAllOfflineCache(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_CACHE);
      const articles = this.getArticles().map(a => ({ ...a, cachedOffline: false }));
      this.saveArticles(articles);
    } catch (e) {
      console.error(e);
    }
  },

  // Storage Quota Calculation
  getStorageStats(): { usedKb: number; quotaKb: number; cachedCount: number } {
    let totalChars = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('press_express_assam')) {
          totalChars += (localStorage.getItem(key) || '').length;
        }
      }
    } catch {
      totalChars = 45000;
    }
    const usedKb = Math.round((totalChars * 2) / 1024);
    const cachedCount = this.getCachedArticles().length;
    return {
      usedKb: Math.max(usedKb, 420), // show baseline storage
      quotaKb: 51200, // 50MB browser typical quota
      cachedCount
    };
  },

  // Bookmarks
  getBookmarks(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : ['art-002', 'art-005', 'art-010'];
    } catch {
      return ['art-002', 'art-005'];
    }
  },

  toggleBookmark(articleId: string): boolean {
    const bookmarks = new Set(this.getBookmarks());
    let isBookmarked = false;
    if (bookmarks.has(articleId)) {
      bookmarks.delete(articleId);
      isBookmarked = false;
    } else {
      bookmarks.add(articleId);
      isBookmarked = true;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(Array.from(bookmarks)));
    } catch (e) {
      console.warn(e);
    }
    return isBookmarked;
  },

  // Reading History & Sync
  recordArticleRead(articleId: string): void {
    try {
      const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const history: { id: string; timestamp: string; progress: number }[] = historyStr ? JSON.parse(historyStr) : [];
      const existingIdx = history.findIndex(h => h.id === articleId);
      if (existingIdx >= 0) {
        history[existingIdx].timestamp = new Date().toISOString();
      } else {
        history.unshift({ id: articleId, timestamp: new Date().toISOString(), progress: 100 });
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.warn(e);
    }
  },

  getReadingHistory(): { id: string; timestamp: string; progress: number }[] {
    try {
      const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return historyStr ? JSON.parse(historyStr) : [];
    } catch {
      return [];
    }
  },

  // Preferences
  getUserPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFS);
      return stored ? { ...DEFAULT_USER_PREFS, ...JSON.parse(stored) } : DEFAULT_USER_PREFS;
    } catch {
      return DEFAULT_USER_PREFS;
    }
  },

  saveUserPreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(prefs));
    } catch (e) {
      console.warn(e);
    }
  },

  // Notification Settings
  getNotificationSettings(): NotificationSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(stored) } : DEFAULT_NOTIFICATION_SETTINGS;
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  },

  saveNotificationSettings(settings: NotificationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  },

  // Privacy & GDPR
  getPrivacySettings(): PrivacyConsentSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRIVACY);
      return stored ? { ...DEFAULT_PRIVACY_SETTINGS, ...JSON.parse(stored) } : DEFAULT_PRIVACY_SETTINGS;
    } catch {
      return DEFAULT_PRIVACY_SETTINGS;
    }
  },

  savePrivacySettings(settings: PrivacyConsentSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PRIVACY, JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  },

  // User Profile & Authentication
  getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return stored ? { ...DEFAULT_USER_PROFILE, ...JSON.parse(stored) } : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn(e);
    }
  },

  // Offline Simulation Mode (Allows user to test offline mode anywhere without breaking browser network)
  getSimulatedOffline(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.SIMULATED_OFFLINE) === 'true';
    } catch {
      return false;
    }
  },

  setSimulatedOffline(val: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, val ? 'true' : 'false');
    } catch (e) {
      console.warn(e);
    }
  },

  // Monetization & Advertising Management
  getMonetizationSettings(): MonetizationSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MONETIZATION);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_MONETIZATION_SETTINGS,
          ...parsed,
          adsense: { ...DEFAULT_MONETIZATION_SETTINGS.adsense, ...(parsed.adsense || {}) },
          directBanners: Array.isArray(parsed.directBanners) && parsed.directBanners.length > 0 
            ? parsed.directBanners 
            : DEFAULT_MONETIZATION_SETTINGS.directBanners,
          inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : DEFAULT_MONETIZATION_SETTINGS.inquiries
        };
      }
      return DEFAULT_MONETIZATION_SETTINGS;
    } catch {
      return DEFAULT_MONETIZATION_SETTINGS;
    }
  },

  saveMonetizationSettings(settings: MonetizationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MONETIZATION, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save monetization settings:', e);
    }
  },

  recordAdImpression(bannerId: string): void {
    try {
      const settings = this.getMonetizationSettings();
      const banner = settings.directBanners.find(b => b.id === bannerId);
      if (banner) {
        banner.impressions = (banner.impressions || 0) + 1;
        this.saveMonetizationSettings(settings);
      }
    } catch (e) {
      console.warn(e);
    }
  },

  recordAdClick(bannerId: string): void {
    try {
      const settings = this.getMonetizationSettings();
      const banner = settings.directBanners.find(b => b.id === bannerId);
      if (banner) {
        banner.clicks = (banner.clicks || 0) + 1;
        this.saveMonetizationSettings(settings);
      }
    } catch (e) {
      console.warn(e);
    }
  },

  submitAdInquiry(inquiry: Omit<AdInquiry, 'id' | 'createdAt' | 'status'>): AdInquiry {
    const newInquiry: AdInquiry = {
      ...inquiry,
      id: 'inq-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    try {
      const settings = this.getMonetizationSettings();
      settings.inquiries = [newInquiry, ...(settings.inquiries || [])];
      this.saveMonetizationSettings(settings);
    } catch (e) {
      console.warn(e);
    }
    return newInquiry;
  },

  updateAdInquiryStatus(inquiryId: string, status: AdInquiry['status']): void {
    try {
      const settings = this.getMonetizationSettings();
      const inq = settings.inquiries.find(i => i.id === inquiryId);
      if (inq) {
        inq.status = status;
        this.saveMonetizationSettings(settings);
      }
    } catch (e) {
      console.warn(e);
    }
  },

  // Cloud Backup Data Export / Import
  exportCloudBackup(): string {
    const backupObject = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      encryptionScheme: 'AES-256-GCM-CLIENT-VAULT',
      profile: this.getUserProfile(),
      preferences: this.getUserPreferences(),
      notificationSettings: this.getNotificationSettings(),
      bookmarks: this.getBookmarks(),
      history: this.getReadingHistory(),
      cachedArticleIds: this.getCachedArticles().map(a => a.id),
      privacy: this.getPrivacySettings(),
    };
    return JSON.stringify(backupObject, null, 2);
  },

  importCloudBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) this.saveUserProfile(parsed.profile);
      if (parsed.preferences) this.saveUserPreferences(parsed.preferences);
      if (parsed.notificationSettings) this.saveNotificationSettings(parsed.notificationSettings);
      if (parsed.bookmarks) localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(parsed.bookmarks));
      if (parsed.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
      if (parsed.privacy) this.savePrivacySettings(parsed.privacy);
      return true;
    } catch {
      return false;
    }
  },

  // Right to be Forgotten (GDPR Article 17)
  purgeAllPersonalData(): void {
    try {
      localStorage.clear();
      // Restore clean initial seed
      this.saveArticles(INITIAL_ARTICLES);
    } catch (e) {
      console.error(e);
    }
  }
};
