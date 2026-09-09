import React from 'react';
import { 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  DownloadCloud, 
  Check, 
  Volume2, 
  TrendingUp, 
  MapPin, 
  Sparkles,
  Video,
  MessageCircle
} from 'lucide-react';
import { Article } from '../types';
import { getPublicShareUrl, formatNewsShareText, getArticlePhotoFile } from '../utils/shareImageGenerator';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
  isCachedOffline: boolean;
  onToggleOfflineCache: (article: Article) => void;
  onShare: (article: Article) => void;
  fontSizeClass: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  isCachedOffline,
  onToggleOfflineCache,
  onShare,
  fontSizeClass,
}) => {
  const handleDirectWhatsApp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shareUrl = getPublicShareUrl(article);
      const text = formatNewsShareText(article, shareUrl);

      // On mobile devices supporting file sharing, attempt to share photo directly to WhatsApp
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
        try {
          const { file } = await getArticlePhotoFile(article);
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: article.titleAssamese || article.title,
              text,
              files: [file],
            });
            return;
          }
        } catch {
          // If cancelled or unsupported, fallback
        }
      }

      // Open the dedicated share modal with photo preview and 1-tap WhatsApp action
      onShare(article);
    } catch {
      onShare(article);
    }
  };

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        {/* Card Header & Image */}
        <div 
          onClick={() => onSelect(article)} 
          className="relative aspect-video w-full overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
        >
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
            {article.isBreaking && (
              <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                Breaking
              </span>
            )}
            {(article.videoUrl || article.videoStreamUrl) && (
              <span className="bg-red-700/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
                <Video className="w-2.5 h-2.5" /> Video
              </span>
            )}
            <span className="bg-slate-900/80 backdrop-blur-sm text-slate-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/20">
              {article.category.replace('-', ' ')}
            </span>
          </div>

          {/* Top right offline status & district */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {isCachedOffline && (
              <span 
                title="Cached for Offline Reading" 
                className="bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Offline Ready
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-sm text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
              <MapPin className="w-2.5 h-2.5 text-red-400" />
              {article.district}
            </span>
          </div>

          {/* Bottom stats overlay */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-200">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTimeMinutes} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString()} reads
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          {/* Assamese Title if present */}
          {article.titleAssamese && (
            <p className="text-xs font-serif text-red-600 dark:text-red-400 font-semibold mb-1 line-clamp-1">
              {article.titleAssamese}
            </p>
          )}

          {/* Main Title */}
          <h3 
            onClick={() => onSelect(article)}
            className={`font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 cursor-pointer transition-colors line-clamp-2 leading-snug ${fontSizeClass}`}
          >
            {article.title}
          </h3>

          {/* Summary */}
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 font-normal">
            {article.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {article.tags.slice(0, 3).map((t) => (
              <span 
                key={t}
                className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/50"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        {/* Author info */}
        <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{article.author}</span>
          <span className="block text-[10px] text-slate-400 dark:text-slate-500">{article.authorRole}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Offline Cache Button */}
          <button
            onClick={() => onToggleOfflineCache(article)}
            title={isCachedOffline ? "Remove from Offline Storage" : "Save article for offline reading in remote areas"}
            className={`p-1.5 rounded-md transition-colors ${
              isCachedOffline
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <DownloadCloud className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(article.id)}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            className={`p-1.5 rounded-md transition-colors ${
              isBookmarked
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                : 'text-slate-500 hover:text-amber-600 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>

          {/* 1-Click WhatsApp Share */}
          <button
            onClick={handleDirectWhatsApp}
            title="Share directly to WhatsApp (হোৱাটছএপত শ্বেয়াৰ কৰক)"
            className="p-1.5 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600/20" />
          </button>

          {/* Social Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(article);
            }}
            title="Share on WhatsApp, Facebook, X, or Copy Link (বাতৰি শ্বেয়াৰ কৰক)"
            className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
