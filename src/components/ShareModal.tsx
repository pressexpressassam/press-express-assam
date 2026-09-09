import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Send, 
  Mail, 
  MapPin, 
  Image as ImageIcon, 
  Download, 
  Loader2,
  FileText
} from 'lucide-react';
import { Article } from '../types';
import { 
  generateNewsShareImage, 
  getArticlePhotoFile, 
  getPublicShareUrl, 
  formatNewsShareText 
} from '../utils/shareImageGenerator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  article
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isSharingImage, setIsSharingImage] = useState(false);
  const [photoDownloadedNotice, setPhotoDownloadedNotice] = useState(false);

  if (!isOpen || !article) return null;

  // Clean public URL (converts ais-dev- to ais-pre- so WhatsApp crawlers and users don't get "Cookie check")
  const shareUrl = getPublicShareUrl(article);
  
  // Format clean share text: Title, Location, News lines, and simple link
  const shareMessage = formatNewsShareText(article, shareUrl);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleCopyText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareMessage);
      } else {
        const input = document.createElement('textarea');
        input.value = shareMessage;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Primary WhatsApp Share: Tries native file share first so photo is attached
  const handleWhatsAppWithPhoto = async () => {
    setIsSharingImage(true);
    setPhotoDownloadedNotice(false);

    try {
      // 1. Get the article's own photo file
      const { file, blob } = await getArticlePhotoFile(article);

      // 2. Check if mobile browser can share file directly to WhatsApp
      let canShareWithFile = false;
      try {
        if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
          canShareWithFile = navigator.canShare({ files: [file] });
        }
      } catch {
        canShareWithFile = false;
      }

      if (canShareWithFile && navigator.share) {
        await navigator.share({
          title: article.titleAssamese || article.title,
          text: shareMessage,
          files: [file],
        });
        setIsSharingImage(false);
        return;
      }

      // 3. Fallback for desktop or non-file-sharing browsers:
      // Download the photo automatically so it's ready in user's downloads/gallery
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `PressExpress-${article.slug || article.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setPhotoDownloadedNotice(true);

      // Open WhatsApp with prefilled clean text & simple link
      setTimeout(() => {
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
        window.open(waUrl, '_blank');
      }, 600);
    } catch (err) {
      console.warn('Share error fallback:', err);
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      window.open(waUrl, '_blank');
    } finally {
      setIsSharingImage(false);
    }
  };

  const handleFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitter = () => {
    const text = article.titleAssamese || article.title;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=Assam,AssamNews,PressExpress`;
    window.open(twUrl, '_blank', 'width=600,height=400');
  };

  const handleTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareMessage)}`;
    window.open(tgUrl, '_blank');
  };

  const handleEmail = () => {
    const mailUrl = `mailto:?subject=${encodeURIComponent(article.titleAssamese || article.title)}&body=${encodeURIComponent(shareMessage)}`;
    window.location.href = mailUrl;
  };

  const handleDownloadPhoto = async () => {
    try {
      setIsSharingImage(true);
      const { blob } = await getArticlePhotoFile(article);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `PressExpress-${article.slug || article.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
      setPhotoDownloadedNotice(true);
      setTimeout(() => setPhotoDownloadedNotice(false), 5000);
    } catch {
      window.open(article.imageUrl, '_blank');
    } finally {
      setIsSharingImage(false);
    }
  };

  // Standard device share
  const handleNativeShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: article.titleAssamese || article.title,
          text: shareMessage,
          url: shareUrl,
        });
      } else {
        handleCopyText();
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-newspaper">
                বাতৰি শ্বেয়াৰ কৰক (Share News)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ফটো আৰু লিংকসহ বন্ধু-বৰ্গলৈ বাতৰি প্ৰেৰণ কৰক
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Notice when photo is downloaded for WhatsApp */}
          {photoDownloadedNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>ফটো ডাউনল'ড হ'ল!</strong> হোৱাটছএপ খোল খালে ফটোখন আৰু তলৰ লিখনিটো সংলগ্ন কৰি পঠিয়াওক।
              </span>
            </div>
          )}

          {/* Article Preview Card with Photo and Text */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
            <div className="flex gap-3">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-24 h-20 sm:w-28 sm:h-22 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div className="flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {article.district}
                    </span>
                  </div>
                  {article.titleAssamese && (
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-red-600 dark:text-red-400 line-clamp-1">
                      {article.titleAssamese}
                    </h4>
                  )}
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* A few lines of the news preview */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans line-clamp-3">
              {article.summary}
            </div>

            {/* Simple Link */}
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
              🔗 {shareUrl}
            </div>
          </div>

          {/* Primary Action: 1-Tap WhatsApp Share with Photo */}
          <div>
            <button
              onClick={handleWhatsAppWithPhoto}
              disabled={isSharingImage}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSharingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ফটো প্ৰস্তুত হৈছে... (Preparing Photo)</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>WhatsApp ত ফটোসহ শ্বেয়াৰ কৰক (Share on WhatsApp)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-1.5">
              বাতৰিৰ ফটো, শিৰোনাম, মূল সাৰাংশ আৰু সৰল লিংক একেলগে যাব
            </p>
          </div>

          {/* Secondary Quick Actions: Download Photo & Copy Text */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadPhoto}
              disabled={isSharingImage}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-red-600" />
              <span>ফটো ডাউনল'ড কৰক</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">লিখনি কপি হ'ল!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span>বাতৰিৰ লিখনি কপি কৰক</span>
                </>
              )}
            </button>
          </div>

          {/* Social Platforms 1-Click Sharing */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              অন্যান্য মাধ্যমত পঠিয়াওক (Other Platforms):
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Facebook className="w-3.5 h-3.5 fill-white" />
                <span>Facebook</span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={handleTwitter}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Twitter className="w-3.5 h-3.5 fill-white" />
                <span>X</span>
              </button>

              {/* Telegram */}
              <button
                onClick={handleTelegram}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>

              {/* Native Device Share */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-red-600" />
                  <span>More...</span>
                </button>
              )}
            </div>
          </div>

          {/* Simple Link Copy Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              সৰল লিংক (Simple Link):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 select-all font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>কপি হ'ল!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>লিংক কপি</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-center shrink-0">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Press Express Assam • অসমৰ ক্ষিপ্ৰ আৰু বিশ্বাসযোগ্য ডিজিটেল সংবাদ মাধ্যম
          </p>
        </div>
      </div>
    </div>
  );
};
