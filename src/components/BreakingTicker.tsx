import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface BreakingTickerProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  isOffline: boolean;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  articles,
  onSelectArticle,
  isOffline,
}) => {
  const breakingList = articles.filter(a => a.isBreaking || a.popularityScore > 90);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (breakingList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % breakingList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [breakingList.length]);

  if (breakingList.length === 0) return null;

  const current = breakingList[currentIndex];

  return (
    <div className="bg-red-700 text-white text-xs md:text-sm py-2 px-4 shadow-sm border-b border-red-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <span className="font-bold tracking-wider uppercase text-[11px] bg-red-900/80 px-2 py-0.5 rounded border border-red-500/50 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
            Breaking Alert
          </span>
        </div>

        <div 
          onClick={() => onSelectArticle(current)}
          className="flex-1 truncate cursor-pointer hover:underline flex items-center gap-2 group transition-all"
          title={current.title}
        >
          <span className="text-amber-200 font-semibold shrink-0 hidden sm:inline">
            [{current.district}]
          </span>
          <span className="truncate font-medium group-hover:text-amber-100">
            {current.title}
          </span>
          {current.titleAssamese && (
            <span className="text-red-200/90 text-xs hidden lg:inline truncate">
              • {current.titleAssamese}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOffline && (
            <span className="text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded border border-amber-400/40">
              Offline Cache Active
            </span>
          )}
          <button
            onClick={() => onSelectArticle(current)}
            className="hidden md:flex items-center gap-1 text-[11px] bg-red-800 hover:bg-red-900 text-amber-200 px-2 py-1 rounded transition-colors"
          >
            Read Story <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
