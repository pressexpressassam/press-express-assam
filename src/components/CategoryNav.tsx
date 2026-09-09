import React from 'react';
import { 
  Newspaper, 
  Flame, 
  Sparkles, 
  Landmark, 
  Vote, 
  Coffee, 
  ShieldAlert, 
  Building2, 
  Music, 
  Trophy, 
  BookOpen, 
  DownloadCloud,
  Radio,
  MapPin
} from 'lucide-react';
import { NewsCategory, AssamDistrict } from '../types';
import { CATEGORY_LABELS, ASSAM_DISTRICTS } from '../data/mockNews';

interface CategoryNavProps {
  selectedCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  selectedDistrict: AssamDistrict;
  onSelectDistrict: (district: AssamDistrict) => void;
  offlineCount: number;
  onOpenLiveStream: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  offlineCount,
  onOpenLiveStream,
}) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'all': return <Newspaper className="w-3.5 h-3.5" />;
      case 'breaking': return <Flame className="w-3.5 h-3.5 text-red-500" />;
      case 'for-you': return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      case 'assam': return <Landmark className="w-3.5 h-3.5" />;
      case 'politics': return <Vote className="w-3.5 h-3.5" />;
      case 'tea-economy': return <Coffee className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />;
      case 'wildlife-floods': return <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'guwahati': return <Building2 className="w-3.5 h-3.5" />;
      case 'culture': return <Music className="w-3.5 h-3.5 text-purple-600" />;
      case 'sports': return <Trophy className="w-3.5 h-3.5 text-blue-500" />;
      case 'opinion': return <BookOpen className="w-3.5 h-3.5" />;
      case 'offline': return <DownloadCloud className="w-3.5 h-3.5 text-teal-600" />;
      default: return <Newspaper className="w-3.5 h-3.5" />;
    }
  };

  const categories = Object.keys(CATEGORY_LABELS) as NewsCategory[];

  return (
    <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontal Category Tab Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const label = CATEGORY_LABELS[cat];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                {getIcon(cat)}
                <span>{label.en}</span>
                {cat === 'offline' && offlineCount > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                    isSelected ? 'bg-white text-red-700' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {offlineCount}
                  </span>
                )}
                {cat === 'breaking' && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                )}
              </button>
            );
          })}

          {/* Quick Live Stream Tab */}
          <button
            onClick={onOpenLiveStream}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all shrink-0 bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20 border border-red-500/20 ml-2"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
            <span>Watch Live Streams</span>
            <span className="text-[10px] bg-red-600 text-white px-1 rounded">2 Live</span>
          </button>
        </div>

        {/* District Filter Row */}
        <div className="flex items-center gap-2 py-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 shrink-0 font-medium pl-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>District:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {ASSAM_DISTRICTS.map((d) => {
              const isSelected = selectedDistrict === d;
              return (
                <button
                  key={d}
                  onClick={() => onSelectDistrict(d as AssamDistrict)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors border ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 font-bold'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
