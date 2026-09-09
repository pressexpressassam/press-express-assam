import React, { useState, useEffect } from 'react';
import { ExternalLink, MessageCircle, Sparkles, Megaphone } from 'lucide-react';
import { AdPosition, DirectAdBanner } from '../types';
import { storageService } from '../services/storageService';

interface AdBannerProps {
  position: AdPosition;
  onOpenInquiry: () => void;
  className?: string;
  categoryFilter?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  position,
  onOpenInquiry,
  className = '',
  categoryFilter
}) => {
  const [activeBanner, setActiveBanner] = useState<DirectAdBanner | null>(null);
  const [adsenseEnabled, setAdsenseEnabled] = useState(false);
  const [publisherId, setPublisherId] = useState('');

  useEffect(() => {
    const settings = storageService.getMonetizationSettings();
    setAdsenseEnabled(Boolean(settings.adsense?.enabled));
    setPublisherId(settings.adsense?.publisherId || '');

    // Look for matching direct banner
    const match = settings.directBanners.find(
      b => b.active && b.position === position && (!b.categoryFilter || b.categoryFilter === categoryFilter)
    );

    if (match) {
      setActiveBanner(match);
      storageService.recordAdImpression(match.id);
    } else {
      setActiveBanner(null);
    }
  }, [position, categoryFilter]);

  const handleBannerClick = () => {
    if (!activeBanner) return;
    storageService.recordAdClick(activeBanner.id);

    if (activeBanner.phoneOrWhatsapp) {
      const cleanPhone = activeBanner.phoneOrWhatsapp.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`নমস্কাৰ, মই Press Express Assam-ত আপোনাৰ বিজ্ঞাপন "${activeBanner.title}" দেখি যোগাযোগ কৰিছোঁ।`)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else if (activeBanner.targetUrl) {
      window.open(activeBanner.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 1. Render Direct Banner if configured and active
  if (activeBanner) {
    return (
      <div 
        className={`w-full relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all hover:shadow-md ${className}`}
      >
        {/* Subtle Ad Label Bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-slate-100 dark:bg-slate-950 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1 font-serif">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            বিজ্ঞাপন • SPONSORED
          </span>
          <button 
            onClick={onOpenInquiry}
            className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Advertise Here ↗
          </button>
        </div>

        {/* Banner Click Area */}
        <div 
          onClick={handleBannerClick}
          className="cursor-pointer relative overflow-hidden flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-3 bg-gradient-to-r from-amber-500/5 via-transparent to-red-500/5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {activeBanner.imageUrl && (
              <img
                src={activeBanner.imageUrl}
                alt={activeBanner.title}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0 shadow-xs"
              />
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400">
                {activeBanner.clientName}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mt-0.5">
                {activeBanner.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                <span>অধিক জানক বা যোগাযোগ কৰক</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {activeBanner.phoneOrWhatsapp ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-transform group-hover:scale-105">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp / Call</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-transform group-hover:scale-105">
                <span>Visit Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Google AdSense Unit (if active and no direct banner)
  if (adsenseEnabled && publisherId) {
    return (
      <div className={`w-full p-2.5 rounded-2xl border border-dashed border-amber-300 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-center relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1 px-1">
          <span className="font-mono font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            GOOGLE ADSENSE ({publisherId.substring(0, 16)}...)
          </span>
          <span className="font-serif">বিজ্ঞাপন স্থান • SPONSORED</span>
        </div>
        
        {/* Real AdSense Slot */}
        <div className="relative py-4 sm:py-6 flex flex-col items-center justify-center gap-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs min-h-[90px]">
          <ins 
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '80px' }}
            data-ad-client={publisherId}
            data-ad-slot="1098273412"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Google Responsive Display Ad Unit Active</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md px-2">
            AdSense অনুমোদন হোৱাৰ পিছত এই স্থানত গুগলৰ উচ্চ ৰাজহজনক বিজ্ঞাপন প্ৰদৰ্শিত হ'ব।
          </p>
        </div>
      </div>
    );
  }

  // 3. Fallback: Self-serve "Advertise With Us" Call-to-Action
  return (
    <div 
      onClick={onOpenInquiry}
      className={`w-full cursor-pointer group rounded-2xl border border-dashed border-amber-300 dark:border-amber-900/60 bg-gradient-to-r from-amber-500/10 via-red-500/5 to-amber-500/10 p-3 sm:p-4 text-slate-800 dark:text-slate-200 shadow-xs hover:border-red-500 transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Megaphone className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                ADVERTISE HERE
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold">
                দৈনিক ১.৫ লাখ ভিজিটৰ
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              প্ৰেছ এক্সপ্ৰেছ অসমত আপোনাৰ ব্যৱসায়ৰ বিজ্ঞাপন দিয়ক
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenInquiry();
          }}
          className="px-3.5 py-1.5 bg-red-600 group-hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-transform group-hover:scale-105 shrink-0"
        >
          যোগাযোগ কৰক (Inquire Now)
        </button>
      </div>
    </div>
  );
};
