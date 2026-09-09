export type NewsCategory = 
  | 'all' 
  | 'home'
  | 'breaking' 
  | 'for-you'
  | 'assam' 
  | 'india'
  | 'sports' 
  | 'entertainment'
  | 'others'
  | 'politics' 
  | 'tea-economy' 
  | 'wildlife-floods' 
  | 'guwahati' 
  | 'culture' 
  | 'opinion'
  | 'offline';

export type AssamDistrict = 
  | 'All Assam'
  | 'Kamrup Metropolitan'
  | 'Dibrugarh'
  | 'Jorhat'
  | 'Cachar'
  | 'Nagaon'
  | 'Sonitpur'
  | 'Tinsukia'
  | 'Barpeta'
  | 'Golaghat'
  | 'Darrang'
  | 'Sivasagar'
  | 'Karbi Anglong';

export type UserRole = 'reader' | 'journalist' | 'editor' | 'admin';

export interface Article {
  id: string;
  title: string;
  titleAssamese?: string;
  slug: string;
  summary: string;
  content: string[];
  category: NewsCategory;
  district: AssamDistrict;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTimeMinutes: number;
  views: number;
  shares: number;
  isBreaking?: boolean;
  isExclusive?: boolean;
  isLiveEvent?: boolean;
  tags: string[];
  imageUrl: string;
  imageCaption?: string;
  videoUrl?: string;
  videoStreamUrl?: string;
  audioNarrationUrl?: string;
  bookmarked?: boolean;
  cachedOffline?: boolean;
  offlineCachedAt?: string;
  popularityScore: number; // 0-100 for trending sort
}

export interface LiveStream {
  id: string;
  title: string;
  titleAssamese?: string;
  channelName: string;
  status: 'live' | 'upcoming' | 'replay';
  viewerCount: number;
  currentSegment: string;
  location: string;
  streamQuality: '1080p' | '720p' | '480p' | 'audio-only';
  hlsUrl?: string;
  embedType: 'video' | 'audio';
  thumbnailUrl: string;
  startedAt: string;
}

export interface StreamReaction {
  id: string;
  user: string;
  text: string;
  emoji?: string;
  timestamp: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  browserPermissionGranted: boolean;
  breakingNewsAlerts: boolean;
  floodWeatherAlerts: boolean;
  teaEconomyAlerts: boolean;
  politicsAlerts: boolean;
  guwahatiLocalAlerts: boolean;
  sportsAlerts: boolean;
  soundEnabled: boolean;
  frequency: 'immediate' | 'hourly-digest' | 'daily';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  category: NewsCategory;
  articleId?: string;
  timestamp: string;
  read: boolean;
  isBreaking?: boolean;
}

export interface UserPreferences {
  selectedDistricts: AssamDistrict[];
  favoriteCategories: NewsCategory[];
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'sans' | 'serif';
  highContrast: boolean;
  theme: 'light' | 'dark' | 'system';
  offlineAutoDownload: boolean;
  offlineImageQuality: 'high' | 'low' | 'none';
  lowDataMode: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isLoggedIn: boolean;
  mfaEnabled: boolean;
  mfaMethod?: 'sms' | 'authenticator_totp';
  oauthProvider?: 'google' | 'apple' | 'assam_egov' | 'email';
  encryptedCredentialsKey?: string;
  lastSyncTimestamp: string;
  connectedDevices: {
    id: string;
    deviceName: string;
    type: 'phone' | 'tablet' | 'desktop';
    lastActive: string;
    current: boolean;
  }[];
}

export interface PrivacyConsentSettings {
  essentialCookies: boolean; // Always true
  analyticsConsent: boolean;
  personalizationConsent: boolean;
  marketingConsent: boolean;
  anonymizedIpLogging: boolean;
  gdprCompliantMode: boolean;
  ccpaDoNotSell: boolean;
  consentTimestamp: string;
}

export interface PlatformAnalytics {
  totalArticleViews: number;
  activeReadersNow: number;
  breakingAlertDeliveryRate: number;
  apiLatencyMs: number;
  edgeCacheHitRate: number;
  bandwidthSavedOfflineMb: number;
  categoryViews: { category: string; count: number; percentage: number }[];
  hourlyTraffic: { hour: string; views: number }[];
  deviceDistribution: { device: string; percentage: number }[];
  districtEngagement: { district: string; readers: number }[];
}

export interface ApiEndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  latencyMs: number;
  cached: boolean;
  queryParams?: { name: string; type: string; description: string; default?: string }[];
  requestBody?: string;
  sampleResponse: object;
}

export type AdPosition = 'header' | 'in_feed' | 'article_middle' | 'sidebar' | 'footer';

export interface DirectAdBanner {
  id: string;
  title: string;
  clientName: string;
  position: AdPosition;
  imageUrl: string;
  targetUrl: string;
  phoneOrWhatsapp?: string;
  active: boolean;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate?: string;
  categoryFilter?: string;
}

export interface AdSenseConfig {
  enabled: boolean;
  publisherId: string;
  autoAdsEnabled: boolean;
  testMode: boolean;
  headerSlotId?: string;
  inFeedSlotId?: string;
  articleSlotId?: string;
}

export interface AdInquiry {
  id: string;
  clientName: string;
  businessName: string;
  phone: string;
  email: string;
  adPosition: AdPosition;
  durationWeeks: number;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'approved' | 'rejected';
}

export interface MonetizationSettings {
  adsense: AdSenseConfig;
  directBanners: DirectAdBanner[];
  inquiries: AdInquiry[];
  monthlyTargetInr: number;
}
