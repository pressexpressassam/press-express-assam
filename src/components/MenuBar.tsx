import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  MapPin, 
  Globe2, 
  Trophy, 
  Film, 
  ChevronDown, 
  Radio, 
  Coffee, 
  ShieldAlert, 
  ShieldCheck,
  Vote, 
  Building2, 
  Music, 
  BookOpen, 
  DownloadCloud, 
  Flame, 
  Sparkles,
  SlidersHorizontal,
  X,
  Maximize,
  Minimize
} from 'lucide-react';
import { NewsCategory, AssamDistrict } from '../types';
import { ASSAM_DISTRICTS } from '../data/mockNews';

interface MenuBarProps {
  selectedCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  selectedDistrict: AssamDistrict;
  onSelectDistrict: (district: AssamDistrict) => void;
  offlineCount: number;
  onOpenLiveStream: () => void;
  onOpenAdminPanel?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  offlineCount,
  onOpenLiveStream,
  onOpenAdminPanel,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showOthersDropdown, setShowOthersDropdown] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOthersDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary menu items as specifically requested:
  // home, Assam, India, sports, Entertainment, and others
  const primaryMenuItems: { id: NewsCategory; label: string; asLabel: string; icon: React.ReactNode }[] = [
    {
      id: 'all', // mapped to Home
      label: 'Home',
      asLabel: 'প্ৰচ্ছদ',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'assam',
      label: 'Assam',
      asLabel: 'অসম',
      icon: <MapPin className="w-4 h-4 text-red-500" />,
    },
    {
      id: 'india',
      label: 'India',
      asLabel: 'ভাৰত',
      icon: <Globe2 className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'sports',
      label: 'Sports',
      asLabel: 'ক্ৰীড়া',
      icon: <Trophy className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'entertainment',
      label: 'Entertainment',
      asLabel: 'মনোৰঞ্জন',
      icon: <Film className="w-4 h-4 text-purple-500" />,
    },
  ];

  // Secondary categories under "Others"
  const otherCategories: { id: NewsCategory; label: string; asLabel: string; description: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'tea-economy',
      label: 'Tea & Economy',
      asLabel: 'চাহ আৰু অৰ্থনীতি',
      description: 'GTAC auctions, oil refineries, Tata semiconductor, industrial growth',
      icon: <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    },
    {
      id: 'wildlife-floods',
      label: 'Wildlife & Floods',
      asLabel: 'বন্যপ্ৰাণী আৰু বান',
      description: 'Brahmaputra hydro telemetry, Kaziranga rhino conservation, ASDMA alerts',
      icon: <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Hydro Radar',
    },
    {
      id: 'politics',
      label: 'Politics & Assembly',
      asLabel: 'ৰাজনীতি আৰু বিধানসভা',
      description: 'Dispur legislative proceedings, governance, regional policy',
      icon: <Vote className="w-4 h-4 text-indigo-500" />,
    },
    {
      id: 'guwahati',
      label: 'Guwahati Metro',
      asLabel: 'গুৱাহাটী মহানগৰ',
      description: 'Guwahati smart city, airport corridor, transit infrastructure',
      icon: <Building2 className="w-4 h-4 text-sky-500" />,
    },
    {
      id: 'culture',
      label: 'Culture & Bihu',
      asLabel: 'সংস্কৃতি আৰু বিহু',
      description: 'Majuli traditional masks, Muga silk, Bihu festivals, heritage arts',
      icon: <Music className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'opinion',
      label: 'Opinion & Editorial',
      asLabel: 'মতামত আৰু সম্পাদকীয়',
      description: 'In-depth perspectives from Editor-in-Chief & guest columnists',
      icon: <BookOpen className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'breaking',
      label: 'Breaking News Wire',
      asLabel: 'ব্ৰেকিং নিউজ',
      description: 'Live continuous dispatches from all 35 districts of Assam',
      icon: <Flame className="w-4 h-4 text-red-500" />,
      badge: 'Live',
    },
    {
      id: 'for-you',
      label: 'Personalized Feed',
      asLabel: 'আপোনাৰ বাবে',
      description: 'Tailored recommendations based on your selected interests',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'offline',
      label: 'Offline Saved Stories',
      asLabel: 'অফলাইন সংৰক্ষিত',
      description: 'Articles saved locally on this device for zero-connectivity reading',
      icon: <DownloadCloud className="w-4 h-4 text-emerald-500" />,
      badge: offlineCount > 0 ? `${offlineCount} saved` : undefined,
    },
  ];

  const isOtherCategorySelected = otherCategories.some(c => c.id === selectedCategory);
  const selectedOtherItem = otherCategories.find(c => c.id === selectedCategory);

  const handleSelectOther = (cat: NewsCategory) => {
    onSelectCategory(cat);
    setShowOthersDropdown(false);
  };

  return (
    <nav 
      id="main-app-menu-bar"
      aria-label="Main Navigation Menu"
      className="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-[68px] md:top-[85px] z-30 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between gap-1">
          {/* Main Menu Items (Home, Assam, India, Sports, Entertainment, Others) */}
          <div className="flex items-center overflow-x-auto py-1.5 scrollbar-none no-scrollbar -mx-1 px-1">
            {primaryMenuItems.map((item) => {
              const isActive = (item.id === 'all' && (selectedCategory === 'all' || selectedCategory === 'home')) || 
                               (item.id === selectedCategory);
              return (
                <button
                  key={item.id}
                  id={`menu-bar-tab-${item.id}`}
                  onClick={() => onSelectCategory(item.id)}
                  className={`group relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/40 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-red-600 dark:text-red-400' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  <span className="hidden lg:inline text-[11px] opacity-70 font-serif font-normal">
                    ({item.asLabel})
                  </span>

                  {/* Active bottom highlight indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 dark:bg-red-500 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* "Others" Dropdown / Mega Menu */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                id="menu-bar-tab-others"
                onClick={() => setShowOthersDropdown(prev => !prev)}
                aria-expanded={showOthersDropdown}
                aria-haspopup="true"
                className={`group flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  isOtherCategorySelected
                    ? 'text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/40'
                    : 'text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{selectedOtherItem ? selectedOtherItem.label : 'Others'}</span>
                <span className="hidden lg:inline text-[11px] opacity-70 font-serif font-normal">
                  ({selectedOtherItem ? selectedOtherItem.asLabel : 'অন্যান্য'})
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showOthersDropdown ? 'rotate-180' : ''}`} />

                {isOtherCategorySelected && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-red-600 dark:bg-red-500 rounded-full" />
                )}
              </button>

              {/* Dropdown Panel */}
              {showOthersDropdown && (
                <div 
                  id="menu-bar-others-dropdown"
                  className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 max-w-[90vw] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                        More Sections
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Explore specialized coverage across Assam
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowOthersDropdown(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="max-h-[380px] overflow-y-auto py-1 divide-y divide-slate-100/60 dark:divide-slate-800/60">
                    {otherCategories.map((cat) => {
                      const isCatActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          id={`dropdown-category-${cat.id}`}
                          onClick={() => handleSelectOther(cat.id)}
                          className={`w-full flex items-start gap-3 px-3.5 py-2.5 text-left transition-colors ${
                            isCatActive 
                              ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="mt-0.5 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                            {cat.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold leading-snug truncate">
                                {cat.label}
                                <span className="font-serif font-normal text-[11px] opacity-75 ml-1.5">
                                  {cat.asLabel}
                                </span>
                              </p>
                              {cat.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 shrink-0 font-mono">
                                  {cat.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dropdown footer quick action */}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 rounded-b-xl flex items-center justify-between text-xs">
                    {onOpenAdminPanel ? (
                      <button
                        onClick={() => {
                          setShowOthersDropdown(false);
                          onOpenAdminPanel();
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Control Room</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Press Express Assam Wire
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setShowOthersDropdown(false);
                        onOpenLiveStream();
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
                    >
                      <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                      <span>Watch Live TV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Utility Cluster: District Quick Filter & Live TV */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pl-1">
            {/* District Selector Pill */}
            <div className="relative">
              <button
                id="menu-bar-district-filter-btn"
                onClick={() => setShowDistrictModal(prev => !prev)}
                title="Filter stories by Assam District"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  selectedDistrict !== 'All Assam'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="hidden sm:inline font-mono text-[10px] text-slate-400 dark:text-slate-500">DISTRICT:</span>
                <span className="max-w-[85px] sm:max-w-[110px] truncate">{selectedDistrict}</span>
                <ChevronDown className="w-3 h-3 opacity-70 shrink-0" />
              </button>

              {/* District Dropdown */}
              {showDistrictModal && (
                <div 
                  id="menu-bar-district-dropdown"
                  className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Select District</span>
                    <button onClick={() => setShowDistrictModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  {ASSAM_DISTRICTS.map(d => (
                    <button
                      key={d}
                      id={`district-opt-${d.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => {
                        onSelectDistrict(d as AssamDistrict);
                        setShowDistrictModal(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedDistrict === d
                          ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{d}</span>
                      {selectedDistrict === d && <span className="text-red-600 dark:text-red-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Mode Quick Button in Menu Bar */}
            {onToggleFullscreen && (
              <button
                id="menu-bar-fullscreen-btn"
                onClick={onToggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen (পূৰ্ণ স্ক্ৰীণ বন্ধ কৰক)" : "Fullscreen Mode (সম্পূৰ্ণ স্ক্ৰীণত খোলক)"}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-md text-xs font-bold border transition-all ${
                  isFullscreen
                    ? 'bg-red-600 text-white border-red-700 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-white" /> : <Maximize className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
                <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Full Screen'}</span>
              </button>
            )}

            {/* Quick Live Stream button */}
            <button
              id="menu-bar-live-btn"
              onClick={onOpenLiveStream}
              title="Watch 24/7 Live Broadcast"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-transform hover:scale-105"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">LIVE</span>
            </button>
          </div>
        </div>

        {/* Sub-bar for Assam Context when Assam is active */}
        {selectedCategory === 'assam' && (
          <div className="py-1.5 px-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="font-bold text-red-600 dark:text-red-400 shrink-0">
              Assam Regional Desk:
            </span>
            <span className="text-slate-500 dark:text-slate-400 shrink-0">Quick Filter:</span>
            {['All Assam', 'Kamrup Metropolitan', 'Dibrugarh', 'Golaghat', 'Jorhat', 'Tinsukia'].map(d => (
              <button
                key={d}
                onClick={() => onSelectDistrict(d as AssamDistrict)}
                className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition-colors ${
                  selectedDistrict === d
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
