import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  DownloadCloud, 
  Check, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Type, 
  CheckCircle2, 
  Copy, 
  Send,
  MessageCircle,
  Twitter,
  Facebook,
  Video,
  Film,
  Home,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  Sparkles
} from 'lucide-react';
import { Article, UserPreferences } from '../types';
import { ArticleCard } from './ArticleCard';
import { AdBanner } from './AdBanner';
import { generateNewsShareImage, getPublicShareUrl, formatNewsShareText, getArticlePhotoFile } from '../utils/shareImageGenerator';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isCachedOffline: boolean;
  onToggleOffline: (article: Article) => void;
  onSelectArticle: (article: Article) => void;
  relatedArticles: Article[];
  userPreferences: UserPreferences;
  onOpenInquiry?: () => void;
  onOpenShareModal?: (article: Article) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  isBookmarked,
  onToggleBookmark,
  isCachedOffline,
  onToggleOffline,
  onSelectArticle,
  relatedArticles,
  userPreferences,
  onOpenInquiry,
  onOpenShareModal,
}) => {
  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(article.views / 7) + 12);

  // Local font size override
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(userPreferences.fontSize);
  const [readingTheme, setReadingTheme] = useState<'default' | 'sepia' | 'high-contrast'>('default');

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Scroll to top when article loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Stop any ongoing speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setShowShareMenu(false);
    setCopiedLink(false);
    setHasLiked(false);
    setLikeCount(Math.floor(article.views / 7) + 12);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  // Text-to-Speech logic
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlayingAudio(true);
      } else {
        window.speechSynthesis.cancel();
        const textToRead = `${article.title}. ${article.summary}. ${article.content.join('. ')}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = playbackRate;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlayingAudio && speechRef.current) {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.summary}. ${article.content.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = rate;
      utterance.onend = () => setIsPlayingAudio(false);
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Social Share Handlers
  const currentUrl = getPublicShareUrl(article);
  const shareText = formatNewsShareText(article, currentUrl);

  const handleShareWhatsApp = async () => {
    // If mobile browser supports direct file sharing, share photo directly with text!
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
      try {
        const { file } = await getArticlePhotoFile(article);
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: article.titleAssamese || article.title,
            text: shareText,
            files: [file],
          });
          return;
        }
      } catch {
        // Continue to fallback
      }
    }

    // Fallback: open share modal or WhatsApp direct
    if (onOpenShareModal) {
      onOpenShareModal(article);
    } else {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    }
  };

  const handleShareTwitter = () => {
    const text = article.titleAssamese || article.title;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}&hashtags=Assam,AssamNews,PressExpress`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: article.titleAssamese || article.title,
          text: shareText,
          url: currentUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikeCount(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setHasLiked(true);
    }
  };

  // Font size mapper
  const getBodySize = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'lg': return 'text-lg md:text-xl leading-relaxed';
      case 'xl': return 'text-xl md:text-2xl leading-loose';
      default: return 'text-base md:text-lg leading-relaxed';
    }
  };

  // Theme mapper
  const getThemeClasses = () => {
    switch (readingTheme) {
      case 'sepia':
        return 'bg-[#fbf0d9] text-[#433422] border-[#ebd4b0]';
      case 'high-contrast':
        return 'bg-black text-amber-200 border-amber-400';
      default:
        return 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <article 
      id="article-detail-inpage-view"
      className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 py-4 sm:py-6"
    >
      {/* Top Navigation & Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Back Button */}
        <button
          onClick={onBack}
          id="btn-back-to-home"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>← সকলো বাতৰি (Back to All News)</span>
        </button>

        {/* Breadcrumb Path */}
        <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button onClick={onBack} className="hover:text-red-600 flex items-center gap-1 font-semibold">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
            {article.category.replace('-', ' ')}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
          <span className="font-semibold text-red-600 dark:text-red-400">
            {article.district}
          </span>
        </nav>

        {/* Action Controls Cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {/* Offline Cache Button */}
          <button
            onClick={() => onToggleOffline(article)}
            title={isCachedOffline ? "Story cached offline" : "Save story offline"}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isCachedOffline
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
            }`}
          >
            {isCachedOffline ? <Check className="w-3.5 h-3.5" /> : <DownloadCloud className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCachedOffline ? 'Saved Offline' : 'Save Offline'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(article.id)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Bookmark story"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {/* WhatsApp Direct Share Button */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
            title="Share directly to WhatsApp (হোৱাটছএপত শ্বেয়াৰ কৰক)"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span className="hidden xs:inline sm:inline">WhatsApp</span>
          </button>

          {/* Social / Full Share Button */}
          <button
            onClick={() => {
              if (onOpenShareModal) {
                onOpenShareModal(article);
              } else {
                handleNativeShare();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            title="Share story via WhatsApp, Facebook, X, Telegram or Copy Link (বাতৰি শ্বেয়াৰ কৰক)"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Article In-Page Card */}
      <div className={`rounded-3xl border shadow-sm p-5 sm:p-8 md:p-10 space-y-6 ${getThemeClasses()}`}>
        {/* Category, Breaking, and District Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {article.isBreaking && (
            <span className="bg-red-600 text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded shadow flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              ব্ৰেকিং নিউজ (BREAKING)
            </span>
          )}
          {(article.videoUrl || article.videoStreamUrl) && (
            <span className="bg-red-700 text-white text-xs font-bold uppercase px-2.5 py-1 rounded shadow flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              ভিডিঅ’ প্ৰতিবেদন (VIDEO REPORT)
            </span>
          )}
          <span className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            {article.category.replace('-', ' ')}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            {article.district}
          </span>
        </div>

        {/* Headlines: Assamese & English */}
        <div className="space-y-2">
          {article.titleAssamese && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-red-600 dark:text-red-400 leading-snug">
              {article.titleAssamese}
            </h1>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-newspaper text-slate-900 dark:text-slate-50 leading-tight">
            {article.title}
          </h2>
        </div>

        {/* Reporter Byline & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm ring-2 ring-red-500/30">
              {article.author.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-inherit">{article.author}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400">
                  {article.authorRole}
                </span>
              </div>
              <p className="text-xs text-inherit opacity-75 mt-0.5">
                Press Express Bureau, {article.district}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-inherit opacity-80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              {article.views.toLocaleString()} views
            </span>
            <span>• {article.readTimeMinutes} min read</span>
          </div>
        </div>

        {/* Audio News Reader Toolbar */}
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleAudio}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlayingAudio ? 'Pause Voice Reader' : 'Listen to Story (অডিঅ’ শ্ৰৱণ)'}</span>
            </button>

            {isPlayingAudio && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="opacity-75">Speed:</span>
              {[1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                    playbackRate === rate
                      ? 'bg-red-600 text-white'
                      : 'bg-white/60 dark:bg-slate-800 text-inherit hover:bg-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Reading Mode Theme Selector */}
            <div className="flex items-center gap-1 border-l border-red-500/30 pl-3">
              <button
                onClick={() => setReadingTheme('default')}
                className={`w-5 h-5 rounded-full border border-slate-300 bg-white ${readingTheme === 'default' ? 'ring-2 ring-red-600' : ''}`}
                title="Default theme"
              />
              <button
                onClick={() => setReadingTheme('sepia')}
                className={`w-5 h-5 rounded-full border border-amber-300 bg-[#fbf0d9] ${readingTheme === 'sepia' ? 'ring-2 ring-red-600' : ''}`}
                title="Sepia warm paper"
              />
              <button
                onClick={() => setReadingTheme('high-contrast')}
                className={`w-5 h-5 rounded-full border border-yellow-400 bg-black ${readingTheme === 'high-contrast' ? 'ring-2 ring-red-600' : ''}`}
                title="High contrast black"
              />
            </div>

            {/* Font Size Adjust */}
            <div className="flex items-center gap-1 border-l border-red-500/30 pl-3 font-bold">
              <button
                onClick={() => setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : fontSize === 'lg' ? 'xl' : 'sm')}
                className="px-2 py-0.5 rounded bg-white/60 dark:bg-slate-800 text-inherit text-[11px]"
                title="Toggle Text Size"
              >
                Text: {fontSize.toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* Attached Video Footage (if available) */}
        {(article.videoUrl || article.videoStreamUrl) && (
          <div className="space-y-2 p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400">
              <Video className="w-4 h-4 text-red-500" />
              <span>ON-GROUND VIDEO FOOTAGE / FIELD REPORT (ভিডিঅ’ প্ৰতিবেদন)</span>
            </div>
            <div className="rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
              {((article.videoUrl || article.videoStreamUrl)?.includes('youtube.com') || (article.videoUrl || article.videoStreamUrl)?.includes('youtu.be')) ? (
                <iframe
                  src={(article.videoUrl || article.videoStreamUrl)?.replace('watch?v=', 'embed/')}
                  title="Video report"
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video
                  src={article.videoUrl || article.videoStreamUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              High-definition field footage verified by Press Express Assam Editorial Desk.
            </p>
          </div>
        )}

        {/* Featured Cover Image */}
        {article.imageUrl && (
          <div className="space-y-2">
            <div className="rounded-2xl overflow-hidden aspect-video max-h-[500px] border border-inherit shadow-xs bg-slate-100 dark:bg-slate-800">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageCaption && (
              <p className="text-xs text-inherit opacity-75 italic text-center">
                📷 {article.imageCaption}
              </p>
            )}
          </div>
        )}

        {/* Lead Summary Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-sm sm:text-base leading-relaxed">
          <span className="font-extrabold text-red-600 dark:text-red-400 mr-2 uppercase tracking-wide">
            প্ৰধান সাৰাংশ (Lead Summary):
          </span>
          <span className="font-medium text-inherit">{article.summary}</span>
        </div>

        {/* Full Article Content */}
        <div className={`space-y-5 font-newspaper ${getBodySize()}`}>
          {article.content.map((paragraph, idx) => (
            <React.Fragment key={idx}>
              <p className="leading-relaxed">
                {idx === 0 ? (
                  <span>
                    <strong className="text-red-600 dark:text-red-400 font-serif mr-1">
                      [{article.district.toUpperCase()}]
                    </strong>
                    {paragraph}
                  </span>
                ) : (
                  paragraph
                )}
              </p>

              {/* In-Article Sponsor Ad Banner (Slot after 1st paragraph or single paragraph) */}
              {(idx === 0 || (article.content.length > 2 && idx === 1)) && (
                <div className="py-2 my-2">
                  <AdBanner
                    position="article_middle"
                    onOpenInquiry={onOpenInquiry || (() => {})}
                    categoryFilter={article.category}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tags Collection */}
        <div className="pt-4 border-t border-inherit">
          <p className="text-xs font-bold text-inherit opacity-75 mb-2">TOPIC TAGS:</p>
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reader Reactions & Social Sharing Section */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                hasLiked
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
              <span>{likeCount} Likes</span>
            </button>
            <span className="text-xs text-inherit opacity-75">
              Support independent journalism in Assam
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-inherit opacity-75 mr-1">বাতৰি শ্বেয়াৰ কৰক:</span>
            <button
              onClick={() => {
                if (onOpenShareModal) {
                  onOpenShareModal(article);
                } else {
                  handleNativeShare();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
              title="Share News with Photo (ফটোসহ বাতৰি শ্বেয়াৰ)"
            >
              <Share2 className="w-4 h-4" />
              <span>ফটোসহ শ্বেয়াৰ</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              title="Share on WhatsApp (হোৱাটছএপত শ্বেয়াৰ কৰক)"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleShareFacebook}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
              title="Share on Facebook"
            >
              <Facebook className="w-4 h-4 fill-white" />
            </button>
            <button
              onClick={handleShareTwitter}
              className="p-2 rounded-xl bg-slate-900 hover:bg-black text-white transition-colors shadow-xs"
              title="Share on Twitter / X"
            >
              <Twitter className="w-4 h-4 fill-white" />
            </button>
            <button
              onClick={handleShareTelegram}
              className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-xs"
              title="Share on Telegram"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold text-xs transition-colors"
              title="Copy Story Link (লিংক কপি কৰক)"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "কপি হ'ল!" : "লিংক কপি"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← সকলো বাতৰিলৈ উভতি যাওক (Back to Home Stories)</span>
          </button>
        </div>
      </div>

      {/* Related Assam News Section at Bottom */}
      {relatedArticles.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-newspaper text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>সম্পৰ্কীয় বাতৰি (Related Stories from {article.district} & {article.category.replace('-', ' ')})</span>
            </h3>
            <button
              onClick={onBack}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View All News
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedArticles.slice(0, 3).map((rel) => (
              <ArticleCard
                key={rel.id}
                article={rel}
                onSelect={onSelectArticle}
                isBookmarked={false}
                onToggleBookmark={() => onToggleBookmark(rel.id)}
                isCachedOffline={false}
                onToggleOfflineCache={() => onToggleOffline(rel)}
                onShare={() => onSelectArticle(rel)}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
