import React, { useState, useEffect, useMemo } from 'react';
import { 
  WifiOff, 
  Wifi, 
  Sparkles, 
  DownloadCloud, 
  Flame, 
  AlertCircle, 
  Check, 
  Clock, 
  Share2, 
  ChevronRight, 
  ShieldCheck, 
  Code2, 
  BarChart3, 
  Sliders, 
  Radio,
  BookOpen,
  MapPin,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  LayoutGrid,
  Columns,
  Maximize2,
  Minimize2,
  Smartphone,
  Globe
} from 'lucide-react';
import { 
  Article, 
  NewsCategory, 
  AssamDistrict, 
  UserProfile, 
  UserPreferences, 
  NotificationSettings, 
  PrivacyConsentSettings, 
  AppNotification 
} from './types';
import { 
  storageService, 
  DEFAULT_USER_PREFS, 
  DEFAULT_NOTIFICATION_SETTINGS, 
  DEFAULT_PRIVACY_SETTINGS, 
  DEFAULT_USER_PROFILE 
} from './services/storageService';
import { pushNotificationService } from './services/pushNotificationService';
import { piAuthService } from './services/piAuthService';
import { BreakingTicker } from './components/BreakingTicker';
import { Navbar } from './components/Navbar';
import { MenuBar } from './components/MenuBar';
import { AppLogo } from './components/AppLogo';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailView } from './components/ArticleDetailView';
import { LiveStreamPlayer } from './components/LiveStreamPlayer';
import { PersonalizedFeedModal } from './components/PersonalizedFeedModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { AuthModal } from './components/AuthModal';
import { AnalyticsDashboardModal } from './components/AnalyticsDashboardModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { PrivacyDashboardModal } from './components/PrivacyDashboardModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdBanner } from './components/AdBanner';
import { AdInquiryModal } from './components/AdInquiryModal';
import { ShareModal } from './components/ShareModal';
import { GoogleSEOSetupModal } from './components/GoogleSEOSetupModal';
import { seoService } from './services/seoService';
import { INITIAL_ARTICLES } from './data/mockNews';

export default function App() {
  // Core state
  const [articles, setArticles] = useState<Article[]>(() => storageService.getArticles());
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<AssamDistrict>('All Assam');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Offline state (combining real navigator and user simulation toggle)
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => storageService.getSimulatedOffline());
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // User & Settings state
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => storageService.getUserPreferences());
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => storageService.getNotificationSettings());
  const [privacySettings, setPrivacySettings] = useState<PrivacyConsentSettings>(() => storageService.getPrivacySettings());

  // Bookmarks & Cached IDs
  const [bookmarks, setBookmarks] = useState<string[]>(() => storageService.getBookmarks());
  const [cachedIds, setCachedIds] = useState<string[]>(() => storageService.getCachedArticles().map(a => a.id));

  // Notifications
  const [notificationsList, setNotificationsList] = useState<AppNotification[]>([
    {
      id: 'notif-welcome',
      title: 'Welcome to Press Express Assam',
      body: 'Real-time updates, Brahmaputra hydrology telemetry, and offline reading mode enabled.',
      category: 'all',
      timestamp: new Date().toISOString(),
      read: false,
      isBreaking: false,
    }
  ]);
  const [latestToast, setLatestToast] = useState<AppNotification | null>(null);

  // Modals state
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdInquiryOpen, setIsAdInquiryOpen] = useState(false);
  const [sharingArticle, setSharingArticle] = useState<Article | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGoogleSEOSetupOpen, setIsGoogleSEOSetupOpen] = useState(false);

  // Dynamic Google SEO & Schema.org JSON-LD updates on article change
  useEffect(() => {
    if (activeArticle) {
      seoService.updateArticleSEO(activeArticle);
    } else {
      seoService.resetToHomepageSEO();
    }
  }, [activeArticle]);

  // Fullscreen state and handler with full mobile/webkit support
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    try {
      const doc = document as any;
      const elem = document.documentElement as any;

      const isCurrentFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isCurrentFs) {
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(() => {});
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen(prev => !prev);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // News Layout View Mode: 'magazine' (1 Lead story + 4 compact side columns + 3-col grid) vs 'standard'
  const [layoutMode, setLayoutMode] = useState<'magazine' | 'grid'>('magazine');

  // Helper to trigger share modal
  const handleOpenShare = (article: Article) => {
    setSharingArticle(article);
    setIsShareModalOpen(true);
  };

  // Check URL query parameters for shared news links (e.g. ?article=art-001)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      if (articleId) {
        const found = articles.find(a => a.id === articleId);
        if (found) {
          setActiveArticle(found);
        }
      }
    } catch {
      // Ignored in non-browser context
    }
  }, [articles]);

  // Dynamically update document title, Open Graph image and metadata for active/shared article
  useEffect(() => {
    if (activeArticle) {
      const title = activeArticle.titleAssamese ? `${activeArticle.titleAssamese} - Press Express Assam` : `${activeArticle.title} - Press Express Assam`;
      document.title = title;

      // Update og:title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);

      // Update og:description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', activeArticle.summary);

      // Update or create og:image so sharing this news page always shows the article's photo
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', activeArticle.imageUrl);

      // Twitter card image
      let twImage = document.querySelector('meta[name="twitter:image"]');
      if (!twImage) {
        twImage = document.createElement('meta');
        twImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twImage);
      }
      twImage.setAttribute('content', activeArticle.imageUrl);
    } else {
      document.title = 'Press Express Assam - Real-time News Portal';
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', '/press_express_logo.jpg');
      }
    }
  }, [activeArticle]);

  // Effective offline flag
  const effectiveOffline = isSimulatedOffline || !isBrowserOnline;

  // Real-time online/offline network listeners
  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync theme with DOM root class
  useEffect(() => {
    if (userPreferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userPreferences.theme]);

  // Subscribe to push notifications
  useEffect(() => {
    const unsubscribe = pushNotificationService.subscribe((notification) => {
      setNotificationsList(prev => [notification, ...prev]);
      setLatestToast(notification);
      setTimeout(() => setLatestToast(null), 5000);
    });
    return unsubscribe;
  }, []);

  // Requirement 3: Automatically trigger Pi authentication when the app loads
  const [isPiAuthenticating, setIsPiAuthenticating] = useState(false);

  // Manual trigger function for "Sign in with Pi" button
  const handleManualPiSignIn = async () => {
    setIsPiAuthenticating(true);
    try {
      if (typeof window !== 'undefined' && (window as any).__triggerPiAuth) {
        (window as any).__triggerPiAuth('user-manual-button');
      }
      const result = await piAuthService.authenticate();
      if (result.success && result.user) {
        setUser((prev) => {
          const updated: UserProfile = {
            ...prev,
            isLoggedIn: true,
            oauthProvider: 'pi',
            name: result.user!.username || 'Pi Pioneer',
            email: `${(result.user!.username || 'pioneer').toLowerCase().replace(/\s+/g, '')}@pi.network`,
            piUsername: result.user!.username,
            piUid: result.user!.uid,
            accessToken: result.accessToken,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(result.user!.username || 'pi')}`,
            lastSyncTimestamp: new Date().toISOString(),
          };
          storageService.saveUserProfile(updated);
          return updated;
        });

        setLatestToast({
          id: `notif-pi-${Date.now()}`,
          title: '⚡ Pi Network Authenticated',
          body: `Welcome, @${result.user.username}! Your identity is verified with Pi Network.`,
          category: 'all',
          timestamp: new Date().toISOString(),
          read: false,
          isBreaking: false,
        });
      } else {
        setLatestToast({
          id: `notif-pi-err-${Date.now()}`,
          title: 'Pi Network Sign-in',
          body: result.error || 'Please open this app inside the Pi Browser to authenticate.',
          category: 'all',
          timestamp: new Date().toISOString(),
          read: false,
          isBreaking: false,
        });
      }
    } catch (err: any) {
      console.error('Manual Pi login error:', err);
    } finally {
      setIsPiAuthenticating(false);
    }
  };

  useEffect(() => {
    const cleanup = piAuthService.autoTriggerAuthOnLoad(
      (piProfile) => {
        setUser((prev) => {
          const updated: UserProfile = {
            ...prev,
            ...piProfile,
          };
          storageService.saveUserProfile(updated);
          return updated;
        });
      },
      (status) => {
        if (status.type === 'success') {
          setLatestToast({
            id: `notif-pi-${Date.now()}`,
            title: '⚡ Pi Network Connected',
            body: status.message,
            category: 'all',
            timestamp: new Date().toISOString(),
            read: false,
            isBreaking: false,
          });
        }
      }
    );
    return cleanup;
  }, []);

  // Periodic automatic breaking news alert simulation to showcase push notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      pushNotificationService.dispatchNotification(
        '🚨 ASDMA Early Warning: Brahmaputra River Basin Update',
        'NESAC telemetry gauges in Upper Assam show stable discharge. Flood relief camps on standby.',
        'wildlife-floods',
        notificationSettings,
        'art-001',
        true
      );
    }, 14000);
    return () => clearTimeout(timer);
  }, [notificationSettings]);

  // Toggle offline simulation
  const handleToggleOffline = () => {
    const nextVal = !isSimulatedOffline;
    setIsSimulatedOffline(nextVal);
    storageService.setSimulatedOffline(nextVal);
    if (nextVal) {
      setSelectedCategory('offline');
    } else if (selectedCategory === 'offline') {
      setSelectedCategory('all');
    }
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme = userPreferences.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...userPreferences, theme: nextTheme as 'light' | 'dark' };
    setUserPreferences(updated);
    storageService.saveUserPreferences(updated);
  };

  // Change font size
  const handleChangeFontSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    const updated = { ...userPreferences, fontSize: size };
    setUserPreferences(updated);
    storageService.saveUserPreferences(updated);
  };

  // Bookmark toggle
  const handleToggleBookmark = (id: string) => {
    storageService.toggleBookmark(id);
    setBookmarks(storageService.getBookmarks());
  };

  // Offline Cache toggle
  const handleToggleOfflineCache = (article: Article) => {
    const isCached = cachedIds.includes(article.id);
    if (isCached) {
      storageService.removeArticleFromOffline(article.id);
    } else {
      storageService.cacheArticleForOffline(article);
    }
    setCachedIds(storageService.getCachedArticles().map(a => a.id));
    setArticles(storageService.getArticles());
  };

  // Clear offline cache
  const handleClearOfflineCache = () => {
    storageService.clearAllOfflineCache();
    setCachedIds([]);
    setArticles(storageService.getArticles());
  };

  // Open article on page
  const handleSelectArticle = (article: Article) => {
    setActiveArticle(article);
    storageService.recordArticleRead(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Publish article from Editor Desk
  const handlePublishArticle = (newArticle: Article) => {
    const updated = [newArticle, ...articles];
    setArticles(updated);
    storageService.saveArticles(updated);
    if (newArticle.isBreaking) {
      pushNotificationService.dispatchNotification(
        `🚨 BREAKING: ${newArticle.title}`,
        newArticle.summary,
        newArticle.category,
        notificationSettings,
        newArticle.id,
        true
      );
    }
  };

  // Broadcast alert from Editor Desk
  const handleBroadcastBreakingAlert = (
    headline: string,
    body: string,
    category: NewsCategory,
    district: AssamDistrict
  ) => {
    pushNotificationService.dispatchNotification(
      `🚨 ${headline}`,
      body,
      category,
      notificationSettings,
      undefined,
      true
    );
  };

  // Filtered & Ranked Articles
  const displayedArticles = useMemo(() => {
    let list = [...articles];

    // If offline mode is active or user clicked Offline Saved category
    if (effectiveOffline || selectedCategory === 'offline') {
      list = list.filter(a => cachedIds.includes(a.id) || a.cachedOffline);
    } else if (selectedCategory === 'breaking') {
      list = list.filter(a => a.isBreaking || a.popularityScore > 90);
    } else if (selectedCategory === 'for-you') {
      // Personalized Algorithm
      list = list.filter(a => {
        const matchesDistrict = userPreferences.selectedDistricts.includes('All Assam' as AssamDistrict) 
          || userPreferences.selectedDistricts.includes(a.district);
        const matchesCategory = userPreferences.favoriteCategories.includes(a.category);
        return matchesDistrict || matchesCategory || a.isBreaking;
      }).sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (selectedCategory === 'assam') {
      // Regional Assam news
      list = list.filter(a => 
        a.category === 'assam' || 
        a.category === 'tea-economy' || 
        a.category === 'wildlife-floods' || 
        a.category === 'guwahati' || 
        a.category === 'politics' || 
        a.category === 'culture' ||
        a.district !== 'All Assam'
      );
    } else if (selectedCategory === 'india') {
      list = list.filter(a => a.category === 'india');
    } else if (selectedCategory === 'sports') {
      list = list.filter(a => a.category === 'sports');
    } else if (selectedCategory === 'entertainment') {
      list = list.filter(a => a.category === 'entertainment');
    } else if (selectedCategory === 'others') {
      list = list.filter(a => ['tea-economy', 'wildlife-floods', 'politics', 'guwahati', 'culture', 'opinion'].includes(a.category));
    } else if (selectedCategory !== 'all' && selectedCategory !== 'home') {
      list = list.filter(a => a.category === selectedCategory);
    }

    // District filter
    if (selectedDistrict !== 'All Assam') {
      list = list.filter(a => a.district === selectedDistrict || a.district === 'All Assam');
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) ||
        (a.titleAssamese && a.titleAssamese.toLowerCase().includes(q)) ||
        a.summary.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list;
  }, [articles, selectedCategory, selectedDistrict, searchQuery, effectiveOffline, cachedIds, userPreferences]);

  // Featured Lead Story
  const featuredArticle = useMemo(() => {
    return displayedArticles.find(a => a.isBreaking) || displayedArticles[0] || null;
  }, [displayedArticles]);

  const gridArticles = useMemo(() => {
    if (!featuredArticle) return [];
    return displayedArticles.filter(a => a.id !== featuredArticle.id);
  }, [displayedArticles, featuredArticle]);

  // 4 compact columns alongside or below the lead story for magazine newspaper layout
  const sideColumnArticles = useMemo(() => {
    return gridArticles.slice(0, 4);
  }, [gridArticles]);

  const restGridArticles = useMemo(() => {
    return gridArticles.slice(4);
  }, [gridArticles]);

  // Font class helper
  const getHeadlineFontSize = () => {
    switch (userPreferences.fontSize) {
      case 'sm': return 'text-sm md:text-base';
      case 'lg': return 'text-lg md:text-xl';
      case 'xl': return 'text-xl md:text-2xl';
      default: return 'text-base md:text-lg';
    }
  };

  const unreadNotifsCount = notificationsList.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-900/10 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-red-600 selection:text-white">
      {/* Real-Time Push Alert Toast Banner */}
      {latestToast && (
        <div 
          onClick={() => {
            if (latestToast.articleId) {
              const art = articles.find(a => a.id === latestToast.articleId);
              if (art) setActiveArticle(art);
            }
            setLatestToast(null);
          }}
          className="fixed top-4 right-4 z-50 max-w-md w-full bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-red-500/50 backdrop-blur-md flex items-start justify-between gap-3 animate-in slide-in-from-top-4 cursor-pointer hover:border-red-400 transition-all"
        >
          <div className="flex items-start gap-2.5">
            <span className="p-1 rounded-lg bg-red-950/80 border border-red-800/60 shrink-0 mt-0.5">
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider bg-red-950 px-1.5 py-0.2 rounded border border-red-800/50 text-red-300">
                  {latestToast.category}
                </span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <h5 className="font-bold text-xs mt-0.5 leading-snug text-slate-100">{latestToast.title}</h5>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{latestToast.body}</p>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLatestToast(null);
            }} 
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Pi Network Sign-in Header Bar (Auto-triggered on load + manual button) */}
      {user.oauthProvider !== 'pi' && (
        <div className="bg-gradient-to-r from-amber-500/15 via-purple-950/20 to-amber-500/10 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 py-1.5 px-3 sm:px-4 text-xs transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-purple-950 font-serif font-black text-xs flex items-center justify-center shrink-0 shadow">
                π
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs">
                Pi Network Integration: Authenticate with Pi Browser to access verified Pioneer reader credentials
              </span>
            </div>
            <button
              type="button"
              id="top-banner-sign-in-with-pi"
              onClick={handleManualPiSignIn}
              disabled={isPiAuthenticating}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-purple-950 font-bold rounded-lg shadow-sm text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer disabled:opacity-70"
            >
              <span className="font-black text-xs">π</span>
              <span>{isPiAuthenticating ? 'Authenticating...' : 'Sign in with Pi'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Breaking Ticker Banner */}
      <BreakingTicker
        articles={articles}
        onSelectArticle={handleSelectArticle}
        isOffline={effectiveOffline}
      />

      {/* Primary Newspaper Masthead & Navigation */}
      <Navbar
        user={user}
        theme={userPreferences.theme}
        onToggleTheme={handleToggleTheme}
        fontSize={userPreferences.fontSize}
        onChangeFontSize={handleChangeFontSize}
        isOffline={effectiveOffline}
        onToggleOffline={handleToggleOffline}
        offlineCount={cachedIds.length}
        unreadNotifsCount={unreadNotifsCount}
        onOpenLiveStream={() => setIsLiveStreamOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenAdInquiry={() => setIsAdInquiryOpen(true)}
        onOpenGoogleSEO={() => setIsGoogleSEOSetupOpen(true)}
        onSignInWithPi={handleManualPiSignIn}
        isPiAuthenticating={isPiAuthenticating}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onNavigateHome={() => {
          setActiveArticle(null);
          setSelectedCategory('all');
          setSelectedDistrict('All Assam');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Menu Bar: Home, Assam, India, Sports, Entertainment, Others */}
      <MenuBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setActiveArticle(null);
          setSelectedCategory(cat);
          if (searchQuery) setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
        offlineCount={cachedIds.length}
        onOpenLiveStream={() => setIsLiveStreamOpen(true)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Offline Mode Active Banner (when enabled) */}
      {effectiveOffline && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-800 dark:text-amber-200 py-2.5 px-4 text-xs transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-semibold">
                Offline Mode Active: Showing {displayedArticles.length} cached articles saved on your device for low-connectivity & remote areas of Assam.
              </span>
            </div>
            <button
              onClick={handleToggleOffline}
              className="text-xs font-bold underline hover:text-amber-950 dark:hover:text-white shrink-0"
            >
              Resume Online Wire
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Top Header Leaderboard Ad Banner (Sponsor / Google AdSense) */}
        <div className="mb-6">
          <AdBanner
            position="header"
            onOpenInquiry={() => setIsAdInquiryOpen(true)}
            categoryFilter={selectedCategory === 'all' || selectedCategory === 'home' ? undefined : selectedCategory}
          />
        </div>

        {activeArticle ? (
          <ArticleDetailView
            article={activeArticle}
            onBack={() => {
              setActiveArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isBookmarked={bookmarks.includes(activeArticle.id)}
            onToggleBookmark={handleToggleBookmark}
            isCachedOffline={cachedIds.includes(activeArticle.id) || !!activeArticle.cachedOffline}
            onToggleOffline={handleToggleOfflineCache}
            onSelectArticle={handleSelectArticle}
            relatedArticles={articles.filter(
              a => a.id !== activeArticle.id && (a.category === activeArticle.category || a.district === activeArticle.district)
            )}
            userPreferences={userPreferences}
            onOpenInquiry={() => setIsAdInquiryOpen(true)}
            onOpenShareModal={handleOpenShare}
          />
        ) : (
          <>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-slate-200 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase font-newspaper tracking-tight text-slate-900 dark:text-slate-100">
                {selectedCategory === 'home' || selectedCategory === 'all'
                  ? 'Home Wire • Top Stories (প্ৰচ্ছদ)'
                  : selectedCategory === 'assam'
                  ? 'Assam Regional Desk (অসম সংবাদ)'
                  : selectedCategory === 'india'
                  ? 'India & National Affairs (ভাৰত)'
                  : selectedCategory === 'sports'
                  ? 'Sports Arena (ক্ৰীড়া জগত)'
                  : selectedCategory === 'entertainment'
                  ? 'Entertainment & Jollywood (মনোৰঞ্জন)'
                  : selectedCategory === 'others'
                  ? 'Specialized Desks & Field Reports (অন্যান্য)'
                  : selectedCategory === 'for-you' 
                  ? 'Personalized Assam Feed (আপোনাৰ বাবে)' 
                  : selectedCategory === 'offline' 
                  ? 'Offline Cached Stories (অফলাইন সংৰক্ষণ)' 
                  : selectedCategory === 'breaking'
                  ? 'Breaking Alerts & Live Bulletins'
                  : `${selectedCategory.replace('-', ' ')} Wire`}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedCategory === 'home' || selectedCategory === 'all'
                ? `Showing verified dispatches across Assam and the nation • ${displayedArticles.length} stories`
                : selectedCategory === 'assam'
                ? `Local reporting from Kamrup, Dibrugarh, Jorhat, Barak Valley & all 35 districts • ${displayedArticles.length} stories`
                : selectedCategory === 'india'
                ? `National governance, ISRO aerospace, infrastructure corridors & federal affairs • ${displayedArticles.length} stories`
                : selectedCategory === 'sports'
                ? `ISL football, world boxing, athletics championships, cricket & Assam sports • ${displayedArticles.length} stories`
                : selectedCategory === 'entertainment'
                ? `National Award-winning Assamese cinema, Jollywood, music, and Bihu festivals • ${displayedArticles.length} stories`
                : selectedCategory === 'others'
                ? `In-depth coverage: Tea auctions, Brahmaputra flood telemetry, state assembly, and editorials • ${displayedArticles.length} stories`
                : selectedCategory === 'for-you' 
                ? `Curated based on your preferences: ${userPreferences.selectedDistricts.slice(0, 3).join(', ')} • Cross-device synced`
                : selectedCategory === 'offline'
                ? 'Full articles stored in your browser cache. Read uninterrupted without cellular network or Wi-Fi.'
                : `Showing verified reports from Dispur, Guwahati & Upper/Lower Assam • ${displayedArticles.length} stories`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {selectedCategory === 'for-you' && (
              <button
                onClick={() => setIsPreferencesOpen(true)}
                className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                <Sliders className="w-3.5 h-3.5" /> Adjust Algorithm
              </button>
            )}
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">District: <strong className="text-slate-800 dark:text-slate-200">{selectedDistrict}</strong></span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            {/* View Layout Switcher: Magazine Layout vs Grid */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setLayoutMode('magazine')}
                title="Lead Story + Side Columns (দাবানল আৰু ৪টা শিতান)"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  layoutMode === 'magazine'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Columns className="w-3 h-3" />
                <span className="hidden sm:inline">Magazine</span>
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                title="Grid View (গ্ৰীড শিতান)"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  layoutMode === 'grid'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </div>

        {displayedArticles.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3 shadow-sm backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              {effectiveOffline ? <WifiOff className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>
            <h3 className="text-base font-bold font-newspaper text-slate-900 dark:text-slate-100">No articles found in this view</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {effectiveOffline 
                ? "You haven't cached any articles for this category yet. When connected online, click the 'Save Offline' icon on any story to read here."
                : "No stories match your current category and district filter. Try switching to 'All Stories' or resetting your district."}
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDistrict('All Assam');
                  setSearchQuery('');
                  if (isSimulatedOffline) handleToggleOffline();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
              >
                Reset Filters & Show All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Featured Headline Showcase (Newspaper Lead Story) */}
            {featuredArticle && !searchQuery && selectedCategory !== 'offline' && (
              <div 
                onClick={() => handleSelectArticle(featuredArticle)}
                className="group relative bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 backdrop-blur-sm"
              >
                <div className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[260px] sm:min-h-[340px] overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 flex gap-2 items-center">
                    {featuredArticle.isBreaking ? (
                      <span className="bg-red-600 text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded shadow flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                        BREAKING REPORT
                      </span>
                    ) : (
                      <span className="bg-slate-950/80 backdrop-blur-sm text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded border border-slate-700/60">
                        FEATURED CHRONICLE
                      </span>
                    )}
                    <span className="bg-slate-950/70 backdrop-blur-sm text-slate-200 text-xs font-semibold px-2 py-1 rounded border border-slate-700/50 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {featuredArticle.district}
                    </span>
                  </div>

                  {cachedIds.includes(featuredArticle.id) && (
                    <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Cached Offline
                    </div>
                  )}
                </div>

                <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between">
                  <div>
                    {featuredArticle.titleAssamese && (
                      <h4 className="text-sm font-serif text-red-600 dark:text-red-400 font-bold mb-1">
                        {featuredArticle.titleAssamese}
                      </h4>
                    )}
                    <h3 className="text-xl sm:text-2xl font-extrabold font-newspaper text-slate-900 dark:text-slate-50 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 font-normal leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {featuredArticle.tags.map((t) => (
                        <span key={t} className="text-[11px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">{featuredArticle.author}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{featuredArticle.authorRole}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const baseUrl = window.location.origin + window.location.pathname;
                          const shareUrl = `${baseUrl}?article=${featuredArticle.id}`;
                          const title = featuredArticle.titleAssamese ? `${featuredArticle.titleAssamese} | ${featuredArticle.title}` : featuredArticle.title;
                          const text = `📰 *${title}*\n📍 ${featuredArticle.district}, Assam\n\n${featuredArticle.summary}\n\nপ্ৰেছ এক্সপ্ৰেছ অসমত পঢ়ক:\n${shareUrl}`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-colors"
                        title="Share on WhatsApp (হোৱাটছএপত শ্বেয়াৰ কৰক)"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenShare(featuredArticle);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                        title="Share this story (বাতৰি শ্বেয়াৰ কৰক)"
                      >
                        <Share2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Share</span>
                      </button>

                      <span className="flex items-center gap-1 ml-2">
                        <Clock className="w-3.5 h-3.5 text-red-500" />
                        {featuredArticle.readTimeMinutes}m read
                      </span>
                      <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-0.5">
                        Read Story <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Column Compact Stories Row (eta dangor news r pasot 4 taman haru haru column) */}
            {layoutMode === 'magazine' && !searchQuery && selectedCategory !== 'offline' && sideColumnArticles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                    শেহতীয়া খবৰ (Latest News)
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">Quick Glance / সংক্ষেপতে খবৰ</span>
                </div>

                {/* 4 Columns Grid on large/desktop screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sideColumnArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => handleSelectArticle(article)}
                      className="group bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500/80 p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <div>
                        {/* Compact thumbnail with tag */}
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-2.5">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {article.district}
                          </span>
                          {article.isBreaking && (
                            <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">
                              BREAKING
                            </span>
                          )}
                        </div>

                        {article.titleAssamese && (
                          <h5 className="text-[11px] font-serif text-red-600 dark:text-red-400 font-bold line-clamp-1 mb-0.5">
                            {article.titleAssamese}
                          </h5>
                        )}
                        <h4 className="text-xs font-bold font-newspaper text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-red-500" />
                          {article.readTimeMinutes}m
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const baseUrl = window.location.origin + window.location.pathname;
                              const shareUrl = `${baseUrl}?article=${article.id}`;
                              const title = article.titleAssamese ? `${article.titleAssamese} | ${article.title}` : article.title;
                              const text = `📰 *${title}*\n📍 ${article.district}, Assam\n\n${article.summary}\n\nপ্ৰেছ এক্সপ্ৰেছ অসমত পঢ়ক:\n${shareUrl}`;
                              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            className="p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 transition-colors"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-emerald-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenShare(article);
                            }}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                            title="Share story"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid of Standard Articles (Supports 4-columns on large screens) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {selectedCategory === 'offline' 
                    ? 'Offline Cached Vault' 
                    : layoutMode === 'magazine' && !searchQuery && sideColumnArticles.length > 0
                    ? 'More Assam Regional Bulletins (অধিক বাতৰি)'
                    : 'Latest Assam Regional Bulletins'}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {(searchQuery || selectedCategory === 'offline' || layoutMode === 'grid' ? displayedArticles.length : restGridArticles.length)} Stories
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {(searchQuery || selectedCategory === 'offline' || layoutMode === 'grid' 
                  ? displayedArticles 
                  : restGridArticles
                ).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onSelect={handleSelectArticle}
                    isBookmarked={bookmarks.includes(article.id)}
                    onToggleBookmark={handleToggleBookmark}
                    isCachedOffline={cachedIds.includes(article.id) || !!article.cachedOffline}
                    onToggleOfflineCache={handleToggleOfflineCache}
                    onShare={handleOpenShare}
                    fontSizeClass={getHeadlineFontSize()}
                  />
                ))}
              </div>

              {/* In-Feed Native Sponsored Banner */}
              <div className="mt-8">
                <AdBanner
                  position="in_feed"
                  onOpenInquiry={() => setIsAdInquiryOpen(true)}
                  categoryFilter={selectedCategory === 'all' || selectedCategory === 'home' ? undefined : selectedCategory}
                />
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Masthead Brand with Official Logo */}
            <div className="space-y-3">
              <AppLogo 
                size="sm" 
                onClick={() => {
                  setSelectedCategory('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
              <p className="text-[11px] leading-relaxed text-slate-400">
                Northeast India’s leading 24/7 digital news publisher. Providing low-latency real-time breaking alerts, live video streams, Brahmaputra river telemetry, and remote offline reading capabilities.
              </p>
              <div className="flex items-center gap-2 pt-1 text-slate-300">
                <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] border border-slate-800">Dispur Bureau</span>
                <span className="bg-slate-900 px-2 py-0.5 rounded text-[10px] border border-slate-800">Guwahati 781006</span>
              </div>
            </div>

            {/* Column 2: Menu Bar Navigation */}
            <div className="space-y-2">
              <h5 className="text-white font-bold uppercase tracking-wider text-xs">Menu Bar Navigation</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => { setSelectedCategory('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white">Home (প্ৰচ্ছদ)</button></li>
                <li><button onClick={() => { setSelectedCategory('assam'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white">Assam News (অসম)</button></li>
                <li><button onClick={() => { setSelectedCategory('india'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white">India & National (ভাৰত)</button></li>
                <li><button onClick={() => { setSelectedCategory('sports'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white">Sports (ক্ৰীড়া)</button></li>
                <li><button onClick={() => { setSelectedCategory('entertainment'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white">Entertainment & Jollywood (মনোৰঞ্জন)</button></li>
                <li><button onClick={() => { setSelectedCategory('others'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white">Others (Economy, Floods, Culture)</button></li>
              </ul>
            </div>

            {/* Column 3: Features & Accessibility */}
            <div className="space-y-2">
              <h5 className="text-white font-bold uppercase tracking-wider text-xs">Accessibility & Technology</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setIsLiveStreamOpen(true)} className="hover:text-white flex items-center gap-1"><Radio className="w-3 h-3 text-red-500" /> Watch Live 24/7 Streams</button></li>
                <li><button onClick={handleToggleOffline} className="hover:text-white flex items-center gap-1"><WifiOff className="w-3 h-3 text-amber-500" /> Remote Area Offline Mode</button></li>
                <li><button onClick={() => setIsNotificationsOpen(true)} className="hover:text-white flex items-center gap-1"><Flame className="w-3 h-3 text-red-400" /> Web Push Notification Alerts</button></li>
                <li><button onClick={() => setIsCloudSyncOpen(true)} className="hover:text-white flex items-center gap-1"><Check className="w-3 h-3 text-blue-400" /> Multi-Device Cloud Sync</button></li>
                <li><button onClick={() => setIsApiDocsOpen(true)} className="hover:text-white flex items-center gap-1"><Code2 className="w-3 h-3 text-indigo-400" /> Low-Latency REST API Docs</button></li>
                <li><button onClick={() => setIsGoogleSEOSetupOpen(true)} className="hover:text-white flex items-center gap-1 text-blue-400 font-semibold"><Globe className="w-3 h-3 text-blue-400" /> Google Console & AdSense Setup</button></li>
              </ul>
            </div>

            {/* Column 4: Compliance & Privacy */}
            <div className="space-y-2">
              <h5 className="text-white font-bold uppercase tracking-wider text-xs">Security & Trust</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setIsAdminPanelOpen(true)} className="hover:text-white flex items-center gap-1 text-red-400 font-bold"><ShieldCheck className="w-3 h-3 text-red-400" /> Executive Admin Portal</button></li>
                <li><button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> GDPR & CCPA Privacy Center</button></li>
                <li><button onClick={() => setIsAuthOpen(true)} className="hover:text-white">OAuth 2.0 & Multi-Factor (MFA)</button></li>
                <li><button onClick={() => setIsAnalyticsOpen(true)} className="hover:text-white flex items-center gap-1"><BarChart3 className="w-3 h-3 text-purple-400" /> Content Popularity & Performance</button></li>
                <li><span className="text-slate-500">AES-256 Vault Encryption</span></li>
                <li><span className="text-slate-500">Sub-15ms Edge Latency SLA</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2026 Press Express Assam. All rights reserved. Registered under Press Registration Act.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAdminPanelOpen(true)} className="hover:text-red-400 text-red-400/90 font-bold">Admin Portal (Login ID & Pass)</button>
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-slate-300">Privacy Policy</button>
              <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-slate-300">Cookie Preferences</button>
              <button onClick={() => setIsApiDocsOpen(true)} className="hover:text-slate-300">Developers (API)</button>
              <button onClick={() => setIsPreferencesOpen(true)} className="hover:text-slate-300">Feed Settings</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <LiveStreamPlayer
        isOpen={isLiveStreamOpen}
        onClose={() => setIsLiveStreamOpen(false)}
        isOffline={effectiveOffline}
      />

      <PersonalizedFeedModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={userPreferences}
        onSavePreferences={(updated) => {
          setUserPreferences(updated);
          storageService.saveUserPreferences(updated);
        }}
      />

      <NotificationSettingsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        settings={notificationSettings}
        onSaveSettings={(updated) => {
          setNotificationSettings(updated);
          storageService.saveNotificationSettings(updated);
        }}
        notificationsList={notificationsList}
        onClearNotifications={() => setNotificationsList([])}
        onSelectArticleFromNotif={(artId) => {
          const art = articles.find(a => a.id === artId);
          if (art) setActiveArticle(art);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          storageService.saveUserProfile(updated);
        }}
        onLogout={() => {
          const guest: UserProfile = {
            ...user,
            name: 'Assam Reader (Guest)',
            role: 'reader',
            isLoggedIn: false
          };
          setUser(guest);
          storageService.saveUserProfile(guest);
        }}
      />

      <AnalyticsDashboardModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        articles={articles}
      />

      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        user={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          storageService.saveUserProfile(updated);
        }}
        isOffline={effectiveOffline}
        onToggleOffline={handleToggleOffline}
        cachedArticles={storageService.getCachedArticles()}
        onClearOfflineCache={handleClearOfflineCache}
      />

      <PrivacyDashboardModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        user={user}
        settings={privacySettings}
        onSaveSettings={(updated) => {
          setPrivacySettings(updated);
          storageService.savePrivacySettings(updated);
        }}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        user={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          storageService.saveUserProfile(updated);
        }}
        articles={articles}
        onUpdateArticles={(updated) => {
          setArticles(updated);
          storageService.saveArticles(updated);
        }}
        onBroadcastBreakingAlert={handleBroadcastBreakingAlert}
        onClearOfflineCache={handleClearOfflineCache}
        onResetDefaultNews={() => {
          storageService.saveArticles(INITIAL_ARTICLES);
          setArticles(INITIAL_ARTICLES);
        }}
        onOpenGoogleSEO={() => setIsGoogleSEOSetupOpen(true)}
      />

      <AdInquiryModal
        isOpen={isAdInquiryOpen}
        onClose={() => setIsAdInquiryOpen(false)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={sharingArticle}
      />

      <GoogleSEOSetupModal
        isOpen={isGoogleSEOSetupOpen}
        onClose={() => setIsGoogleSEOSetupOpen(false)}
      />
    </div>
  );
}
