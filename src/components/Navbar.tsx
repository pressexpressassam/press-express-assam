import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Search, 
  Sparkles, 
  Sliders, 
  CloudCheck, 
  Cloud,
  ShieldCheck, 
  Code2, 
  BarChart3, 
  Bookmark,
  ChevronDown,
  Volume2,
  ExternalLink,
  Megaphone,
  Maximize,
  Minimize,
  Smartphone
} from 'lucide-react';
import { UserProfile, UserRole, AppNotification } from '../types';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  user: UserProfile;
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  onChangeFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  offlineCount: number;
  unreadNotifsCount: number;
  onOpenLiveStream: () => void;
  onOpenNotifications: () => void;
  onOpenPreferences: () => void;
  onOpenAuth: () => void;
  onOpenAnalytics: () => void;
  onOpenCloudSync: () => void;
  onOpenPrivacy: () => void;
  onOpenApiDocs: () => void;
  onOpenAdminPanel: () => void;
  onOpenAdInquiry?: () => void;
  onOpenGoogleSEO?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateHome?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onSignInWithPi?: () => void;
  isPiAuthenticating?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  theme,
  onToggleTheme,
  fontSize,
  onChangeFontSize,
  isOffline,
  onToggleOffline,
  offlineCount,
  unreadNotifsCount,
  onOpenLiveStream,
  onOpenNotifications,
  onOpenPreferences,
  onOpenAuth,
  onOpenAnalytics,
  onOpenCloudSync,
  onOpenPrivacy,
  onOpenApiDocs,
  onOpenAdminPanel,
  onOpenAdInquiry,
  onOpenGoogleSEO,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  isFullscreen,
  onToggleFullscreen,
  onSignInWithPi,
  isPiAuthenticating = false,
}) => {
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Formatted Assam Date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const englishDate = today.toLocaleDateString('en-IN', dateOptions);

  const fontSizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
  const nextFontSize = () => {
    const nextIdx = (fontSizes.indexOf(fontSize) + 1) % fontSizes.length;
    onChangeFontSize(fontSizes[nextIdx]);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-900/80 text-purple-200 border-purple-700/60';
      case 'editor': return 'bg-blue-900/80 text-blue-200 border-blue-700/60';
      case 'journalist': return 'bg-emerald-900/80 text-emerald-200 border-emerald-700/60';
      default: return 'bg-slate-800 text-slate-200 border-slate-700';
    }
  };

  return (
    <header className="w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 transition-colors sticky top-0 z-40">
      {/* Top utility bar */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 text-xs py-1 px-3 sm:px-4 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-sm overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Date & Weather */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-600 dark:text-slate-400 min-w-0 truncate">
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{englishDate}</span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden md:inline font-serif text-slate-600 dark:text-slate-400">প্ৰতিটো মুহূৰ্তৰ নিৰ্ভৰযোগ্য প্ৰকাশ</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium shrink-0">
              <span>Guwahati 28°C</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">(Brahmaputra: Normal)</span>
            </span>
          </div>

          {/* Right: Quick system utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
            {/* Admin Panel Button in Date Bar */}
            <button
              id="navbar-admin-panel-btn"
              onClick={onOpenAdminPanel}
              title="Executive Admin Panel (Login ID & Password)"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-xs shadow-xs transition-colors shrink-0"
            >
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
              <span>Admin Panel</span>
            </button>

            {/* Offline Mode Toggle Button */}
            <button
              onClick={onToggleOffline}
              title={isOffline ? "Currently in Offline Mode (Cached news only)" : "Toggle Offline Mode to simulate remote area reading"}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all border shrink-0 ${
                isOffline 
                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 animate-pulse' 
                  : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {isOffline ? <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
              <span className="hidden sm:inline">{isOffline ? 'Offline' : 'Online'}</span>
              {offlineCount > 0 && (
                <span className="bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-100 text-[9px] px-1 py-0.2 rounded-full font-mono">
                  {offlineCount}
                </span>
              )}
            </button>

            {/* Cloud Sync Status */}
            <button
              onClick={onOpenCloudSync}
              title="Cloud Synchronization & Multi-device Support"
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden lg:inline">Cloud Sync</span>
            </button>

            {/* Privacy & GDPR */}
            <button
              onClick={onOpenPrivacy}
              title="GDPR & CCPA Privacy Settings"
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden lg:inline">Privacy & GDPR</span>
            </button>

            {/* API Documentation */}
            <button
              onClick={onOpenApiDocs}
              title="Low-Latency Third-Party REST API Docs"
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden lg:inline">API</span>
            </button>

            {/* Analytics Dashboard */}
            <button
              onClick={onOpenAnalytics}
              title="Content Popularity & Platform Analytics"
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden lg:inline">Analytics</span>
            </button>

            {/* Google Console, SEO & AdSense */}
            {onOpenGoogleSEO && (
              <button
                onClick={onOpenGoogleSEO}
                title="Google Search Console, Sitemaps & AdSense Setup"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden md:inline">Google & SEO</span>
              </button>
            )}

            {/* Advertise With Us (বিজ্ঞাপন দিয়ক) */}
            {onOpenAdInquiry && (
              <button
                onClick={onOpenAdInquiry}
                title="Advertise on Press Express Assam (বিজ্ঞাপন দিয়ক)"
                className="flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-colors"
              >
                <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Advertise (বিজ্ঞাপন)</span>
              </button>
            )}

            {/* Personalized Feed Preferences */}
            <button
              onClick={onOpenPreferences}
              title="Personalize Feed & Categories"
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-amber-600 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Preferences</span>
            </button>

            {/* Font Size Adjuster */}
            <button
              onClick={nextFontSize}
              title={`Font Size: ${fontSize.toUpperCase()} (Click to toggle)`}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span className="text-[10px] opacity-70">Font:</span>
              <span className="font-bold">A{fontSize === 'sm' ? '⁻' : fontSize === 'md' ? '' : fontSize === 'lg' ? '⁺' : '⁺⁺'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Masthead Banner: Press Express Assam, LIVE TV and Quick Actions in the same line */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5">
        <div className="flex flex-row items-center justify-between gap-1 sm:gap-4">
          {/* Brand & Masthead with Official Logo: Press Express Assam */}
          <div className="flex items-center min-w-0 shrink">
            <AppLogo size="md" onClick={onNavigateHome} />
          </div>

          {/* Same Line Group: LIVE TV and Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Live TV Button */}
            <button
              id="navbar-livetv-btn"
              onClick={onOpenLiveStream}
              title="Watch Live News Broadcast"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm transition-all transform hover:scale-[1.02] shrink-0"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">LIVE TV</span>
              <span className="xs:hidden sm:hidden inline">LIVE</span>
            </button>

            {/* Fullscreen Mode Button */}
            {onToggleFullscreen && (
              <button
                id="navbar-fullscreen-btn"
                onClick={onToggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen (পূৰ্ণ স্ক্ৰীণ বন্ধ কৰক)" : "Open Fullscreen (সম্পূৰ্ণ স্ক্ৰীণত খোলক)"}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-bold transition-all shrink-0 ${
                  isFullscreen 
                    ? 'bg-red-600 text-white border-red-700 shadow-sm' 
                    : 'border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full Screen'}</span>
              </button>
            )}

            {/* Dark Mode Switcher */}
            <button
              onClick={onToggleTheme}
              title="Toggle Dark / Light Mode"
              className="p-1 sm:p-1.5 rounded-lg border border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors shrink-0"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              title="Push Notification Settings & Breaking Alerts"
              className="relative p-1 sm:p-1.5 rounded-lg border border-slate-300 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Pi Network Sign-in Trigger / Pioneer Badge */}
            {user.oauthProvider !== 'pi' ? (
              <button
                type="button"
                id="navbar-sign-in-with-pi"
                onClick={onSignInWithPi}
                disabled={isPiAuthenticating}
                title="Sign in with Pi Network account"
                className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-purple-950 font-bold text-xs shadow-sm transition-all shrink-0 active:scale-95 disabled:opacity-75 cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-purple-950 text-amber-400 flex items-center justify-center font-serif font-black text-[10px] shrink-0">
                  π
                </span>
                <span className="truncate">
                  {isPiAuthenticating ? 'Authenticating...' : 'Sign in with Pi'}
                </span>
              </button>
            ) : (
              <div 
                title={`Pi Network Authenticated: @${user.piUsername || 'Pioneer'}`}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold text-xs shrink-0"
              >
                <span className="w-4 h-4 rounded-full bg-amber-500 text-purple-950 flex items-center justify-center font-serif font-black text-[10px] shrink-0 shadow">
                  π
                </span>
                <span className="truncate max-w-[85px] hidden sm:inline">@{user.piUsername || 'Pioneer'}</span>
              </div>
            )}

            {/* User Account / Role Badge */}
            <button
              onClick={onOpenAuth}
              title={`${user.name} (${user.role})${user.oauthProvider === 'pi' ? ' - Pi Network Authenticated' : ''} - Click to manage account`}
              className="flex items-center gap-1 sm:gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-300 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors shrink-0"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-red-600"
                />
                {user.oauthProvider === 'pi' && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-purple-950 font-serif font-black text-[9px] flex items-center justify-center shadow">
                    π
                  </span>
                )}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold leading-none truncate max-w-[80px] text-slate-900 dark:text-slate-100">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-1 rounded border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                  {user.oauthProvider === 'pi' && (
                    <span className="inline-block text-[8px] font-bold uppercase tracking-wider px-1 rounded border bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40">
                      Pi
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Assam news, Brahmaputra floods, Tea, Guwahati, Sports, Politics..."
              className="w-full bg-slate-100 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs md:text-sm placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
