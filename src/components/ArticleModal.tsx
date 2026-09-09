import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
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
  Smartphone, 
  CheckCircle2, 
  Copy, 
  Send,
  MessageCircle,
  Twitter,
  Facebook,
  Video,
  Film
} from 'lucide-react';
import { Article, UserPreferences } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isCachedOffline: boolean;
  onToggleOffline: (article: Article) => void;
  onSelectRelated: (article: Article) => void;
  relatedArticles: Article[];
  userPreferences: UserPreferences;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isCachedOffline,
  onToggleOffline,
  onSelectRelated,
  relatedArticles,
  userPreferences,
}) => {
  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Local font override
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(userPreferences.fontSize);
  const [isSerif, setIsSerif] = useState<boolean>(userPreferences.fontFamily === 'serif');
  const [readingTheme, setReadingTheme] = useState<'default' | 'sepia' | 'high-contrast'>('default');

  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Reset audio when article changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setShowShareMenu(false);
    setCopiedLink(false);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article?.id]);

  if (!article) return null;

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
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://pressexpressassam.in';
  const shareText = `Read "${article.title}" on Press Express Assam`;

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' - ' + currentUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
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
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Font size mapper
  const getBodySize = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'lg': return 'text-lg leading-relaxed';
      case 'xl': return 'text-xl leading-loose';
      default: return 'text-base leading-relaxed';
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
        return 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-4xl rounded-2xl shadow-2xl border flex flex-col overflow-hidden my-auto max-h-[92vh] ${getThemeClasses()}`}
      >
        {/* Sticky Article Header Bar */}
        <div className="px-4 py-3 border-b border-inherit flex items-center justify-between gap-2 bg-inherit sticky top-0 z-20 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
              {article.category.replace('-', ' ')}
            </span>
            <span className="text-xs text-inherit opacity-80 flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {article.district}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Save Offline */}
            <button
              onClick={() => onToggleOffline(article)}
              title={isCachedOffline ? "Cached offline" : "Save for offline reading in remote areas"}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                isCachedOffline
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              {isCachedOffline ? <Check className="w-3.5 h-3.5" /> : <DownloadCloud className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCachedOffline ? 'Saved Offline' : 'Save Offline'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(article.id)}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-inherit transition-colors"
              title="Bookmark article"
            >
              {isBookmarked ? <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
            </button>

            {/* Share Menu Trigger */}
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-inherit transition-colors"
              title="Share Story"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/70 text-inherit transition-colors ml-1"
              title="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share popup drawer if toggled */}
        {showShareMenu && (
          <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
              <span>Share this report:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <button
                onClick={handleShareTwitter}
                className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white px-2.5 py-1 rounded-md font-medium"
              >
                <Twitter className="w-3.5 h-3.5" /> X / Twitter
              </button>
              <button
                onClick={handleShareFacebook}
                className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-1 rounded-md font-medium"
              >
                <Facebook className="w-3.5 h-3.5" /> Facebook
              </button>
              <button
                onClick={handleShareTelegram}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1 rounded-md font-medium"
              >
                <Send className="w-3.5 h-3.5" /> Telegram
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 bg-slate-700 hover:bg-slate-800 text-white px-2.5 py-1 rounded-md font-medium"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-1 bg-slate-800 text-white px-2.5 py-1 rounded-md font-medium"
              >
                More...
              </button>
            </div>
          </div>
        )}

        {/* Reader Controls Toolbar (Text-to-Speech + Typography customizer) */}
        <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-900/60 border-b border-inherit flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Audio player */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold shadow-sm transition-all ${
                isPlayingAudio 
                  ? 'bg-amber-600 text-white animate-pulse' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Pause Narration' : 'Listen to News'}</span>
            </button>

            {isPlayingAudio && (
              <div className="flex items-center gap-1 ml-1 bg-slate-200 dark:bg-slate-800 rounded-full px-2 py-0.5">
                <span className="text-[10px] text-slate-500">Speed:</span>
                {[1.0, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handleRateChange(rate)}
                    className={`px-1 text-[10px] font-bold rounded ${playbackRate === rate ? 'bg-slate-700 text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reading Preferences in-modal */}
          <div className="flex items-center gap-2">
            {/* Font switcher */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 rounded-md p-0.5 border border-slate-300 dark:border-slate-700/60">
              <button
                onClick={() => setIsSerif(false)}
                className={`px-2 py-0.5 rounded text-[11px] font-sans ${!isSerif ? 'bg-white dark:bg-slate-700 shadow-xs font-bold text-slate-900 dark:text-white' : 'opacity-70'}`}
              >
                Sans
              </button>
              <button
                onClick={() => setIsSerif(true)}
                className={`px-2 py-0.5 rounded text-[11px] font-serif ${isSerif ? 'bg-white dark:bg-slate-700 shadow-xs font-bold text-slate-900 dark:text-white' : 'opacity-70'}`}
              >
                Serif
              </button>
            </div>

            {/* Size selector */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 rounded-md p-0.5 border border-slate-300 dark:border-slate-700/60">
              {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${fontSize === s ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' : 'opacity-60'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Theme filter */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 rounded-md p-0.5 border border-slate-300 dark:border-slate-700/60">
              <button
                onClick={() => setReadingTheme('default')}
                title="Default Theme"
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${readingTheme === 'default' ? 'ring-1 ring-slate-500 bg-white dark:bg-slate-700' : ''}`}
              >
                A
              </button>
              <button
                onClick={() => setReadingTheme('sepia')}
                title="Sepia Warm Reading Theme"
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-[#fbf0d9] text-[#433422] ${readingTheme === 'sepia' ? 'ring-1 ring-amber-600' : ''}`}
              >
                S
              </button>
              <button
                onClick={() => setReadingTheme('high-contrast')}
                title="High Contrast Dark Theme"
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-black text-amber-300 ${readingTheme === 'high-contrast' ? 'ring-1 ring-amber-400' : ''}`}
              >
                H
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Headline & Assamese Title */}
          <div>
            {article.titleAssamese && (
              <h2 className="text-sm md:text-base font-serif text-red-600 dark:text-red-400 font-bold mb-1.5">
                {article.titleAssamese}
              </h2>
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-newspaper leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Author Byline & Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-inherit text-xs opacity-90">
            <div>
              <p className="font-bold">{article.author}</p>
              <p className="opacity-70">{article.authorRole}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                {article.readTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                {article.views.toLocaleString()} reads
              </span>
              <span className="flex items-center gap-1 text-emerald-500">
                <Smartphone className="w-3.5 h-3.5" />
                Cloud Synced
              </span>
            </div>
          </div>

          {/* Featured Image & Caption */}
          <div className="space-y-2">
            <div className="rounded-xl overflow-hidden aspect-video max-h-[440px] bg-slate-200 dark:bg-slate-800">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageCaption && (
              <p className="text-xs italic opacity-75 text-center">
                {article.imageCaption}
              </p>
            )}
          </div>

          {/* Attached Video Footage (if available) */}
          {(article.videoUrl || article.videoStreamUrl) && (
            <div className="space-y-2 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <Video className="w-4 h-4 text-red-500" />
                <span>VIDEO REPORT / ON-GROUND FOOTAGE</span>
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
                High-definition field video uploaded by editorial staff.
              </p>
            </div>
          )}

          {/* Lead Summary */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm md:text-base font-medium leading-relaxed">
            <span className="font-bold text-red-600 dark:text-red-400 mr-2">SUMMARY:</span>
            {article.summary}
          </div>

          {/* Paragraphs */}
          <div className={`space-y-4 ${getBodySize()} ${isSerif ? 'font-editorial' : 'font-sans'}`}>
            {article.content.map((para, idx) => (
              <p key={idx} className="tracking-normal">
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-inherit flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold mr-1">Tags:</span>
            {article.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs bg-slate-200/80 dark:bg-slate-800 text-inherit px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Offline accessibility reminder */}
          <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-inherit flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <DownloadCloud className="w-4 h-4 text-emerald-500" />
              <span>
                {isCachedOffline 
                  ? "This article is securely cached in your device's offline vault." 
                  : "Traveling to remote areas of Assam? Cache this story to read without internet."}
              </span>
            </div>
            <button
              onClick={() => onToggleOffline(article)}
              className="text-xs font-bold underline text-red-600 dark:text-red-400 shrink-0 ml-2"
            >
              {isCachedOffline ? 'Remove Cache' : 'Cache Now'}
            </button>
          </div>

          {/* Related Stories */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-inherit">
              <h4 className="text-sm font-bold uppercase tracking-wider mb-3 font-newspaper">
                Related Assam News & Regional Updates
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedArticles.slice(0, 2).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 rounded-lg border border-inherit bg-slate-50 dark:bg-slate-900/60 hover:border-red-600 cursor-pointer transition-all flex gap-3 items-center"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-16 h-16 rounded object-cover shrink-0"
                    />
                    <div className="truncate">
                      <span className="text-[10px] text-red-600 font-bold uppercase block">{rel.district}</span>
                      <p className="text-xs font-bold line-clamp-2">{rel.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
