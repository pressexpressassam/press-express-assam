import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  DollarSign, 
  FileCode2, 
  Check, 
  Copy, 
  ExternalLink, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  RefreshCw,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { seoService, GoogleSEOSettings } from '../services/seoService';

interface GoogleSEOSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSEOSetupModal: React.FC<GoogleSEOSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'adsense' | 'sitemap' | 'schema'>('console');
  const [settings, setSettings] = useState<GoogleSEOSettings>(() => seoService.getSettings());

  const [verificationInput, setVerificationInput] = useState(settings.googleSiteVerification);
  const [adsensePubInput, setAdsensePubInput] = useState(settings.adsensePublisherId);
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(settings.adsenseAutoAds);
  const [canonicalInput, setCanonicalInput] = useState(settings.canonicalDomain);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const current = seoService.getSettings();
      setSettings(current);
      setVerificationInput(current.googleSiteVerification);
      setAdsensePubInput(current.adsensePublisherId);
      setAutoAdsEnabled(current.adsenseAutoAds);
      setCanonicalInput(current.canonicalDomain);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://pressexpressassam.in';
  const sitemapUrl = `${currentOrigin}/sitemap.xml`;
  const newsSitemapUrl = `${currentOrigin}/news-sitemap.xml`;
  const robotsUrl = `${currentOrigin}/robots.txt`;
  const adsTxtUrl = `${currentOrigin}/ads.txt`;

  const handleSave = () => {
    // If user pasted full meta tag: <meta name="google-site-verification" content="XYZ" />
    let cleanVerification = verificationInput.trim();
    if (cleanVerification.includes('content=')) {
      const match = cleanVerification.match(/content=["'](.*?)["']/);
      if (match && match[1]) {
        cleanVerification = match[1];
      }
    }

    // Clean publisher ID: ensure ca-pub- format
    let cleanPubId = adsensePubInput.trim();
    if (cleanPubId && !cleanPubId.startsWith('ca-pub-') && cleanPubId.startsWith('pub-')) {
      cleanPubId = `ca-${cleanPubId}`;
    }

    const updated = seoService.saveSettings({
      googleSiteVerification: cleanVerification,
      adsensePublisherId: cleanPubId,
      adsenseAutoAds: autoAdsEnabled,
      canonicalDomain: canonicalInput.trim() || currentOrigin,
    });

    setSettings(updated);
    setVerificationInput(cleanVerification);
    setAdsensePubInput(cleanPubId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleCopy = async (text: string, identifier: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedItem(identifier);
      setTimeout(() => setCopiedItem(null), 2500);
    } catch {
      // Ignored
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-red-600 to-amber-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black shadow-inner">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                Google Search & AdSense Setup
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                  Verified
                </span>
              </h3>
              <p className="text-xs text-white/80">
                গুগল চার্টছ, চার্চ কনচ'ল আৰু এডছেন্স সংযোগ কেন্দ্ৰ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 pt-2 gap-1 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'console'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border-t-2 border-red-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4 text-blue-500" />
            <span>Google Search Console (চার্চ কনচ'ল)</span>
          </button>

          <button
            onClick={() => setActiveTab('adsense')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'adsense'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border-t-2 border-red-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>Google AdSense (বিজ্ঞাপন/ৰাজহ)</span>
          </button>

          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sitemap'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border-t-2 border-red-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-emerald-500" />
            <span>Sitemaps & Robots (ইন্ডেক্সিং)</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border-t-2 border-red-600 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>SEO Schema & Rich Snippets</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>গুগল ছেটিংছ সফলতাৰে সংৰক্ষণ হ'ল আৰু ৱেবচাইটৰ কোডত তাৎক্ষণিকভাৱে কাৰ্যকৰী কৰা হ'ল!</span>
            </div>
          )}

          {/* TAB 1: Google Search Console */}
          {activeTab === 'console' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Google Search Console Status
                  </span>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Meta Tag Injected
                  </span>
                </div>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  গুগলত আপোনাৰ ৱেবচাইট আৰু বাতৰিবোৰ বিচৰা মাত্ৰকে বিচাৰি পাবলৈ (Google Chrome & Search indexing) তলত আপোনাৰ Google Search Console ভেৰিফিকেচন ক'ড সংৰক্ষণ কৰক।
                </p>
              </div>

              {/* Verification Code Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Google Site Verification Meta Content (ক'ড বা টেগ):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    placeholder='GSC-your-verification-code অথবা <meta name="google-site-verification" content="..." />'
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSave}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    Save & Inject
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  বৰ্তমান HTML &lt;head&gt; ত ইনজেক্ট হৈ আছে: <code className="font-mono text-red-600 dark:text-red-400">&lt;meta name="google-site-verification" content="{settings.googleSiteVerification}" /&gt;</code>
                </p>
              </div>

              {/* Step by Step Guide in Assamese */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-red-600" />
                  Google Search Console ত ৱেবচাইট কেনেকৈ ভেৰিফাই কৰিব? (How to Verify):
                </h4>
                <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    পোনপ্ৰথমে তলৰ <strong>"Open Google Search Console"</strong> লিংকত ক্লিক কৰি আপোনাৰ Gmail ৰে লগ ইন কৰক।
                  </li>
                  <li>
                    <strong>"Add property"</strong> ত গৈ <strong>"URL prefix"</strong> নিৰ্বাচন কৰক আৰু আপোনাৰ ৱেবচাইটৰ লিংকটো দিয়ক:
                    <div className="my-1 font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span>{canonicalInput}</span>
                      <button 
                        onClick={() => handleCopy(canonicalInput, 'url')}
                        className="text-[10px] text-red-600 dark:text-red-400 font-bold hover:underline"
                      >
                        {copiedItem === 'url' ? 'কপি হ’ল' : 'Copy'}
                      </button>
                    </div>
                  </li>
                  <li>
                    ভেৰিফিকেচন পদ্ধতিবোৰৰ পৰা <strong>"HTML tag"</strong> বাছক আৰু তাত থকা <code className="text-red-600">content="..."</code> ক'ডটো কপি কৰি ওপৰৰ ইনপুট বক্সত পেষ্ট কৰি <strong>Save</strong> কৰক।
                  </li>
                  <li>
                    তাৰপাছত Google Console ত <strong>"Verify"</strong> টিপিলে লগে লগে সেউজীয়া টিকসহ ৱেবচাইট গুগলত সংযুক্ত হৈ যাব!
                  </li>
                </ol>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Google Search Console ↗</span>
                  </a>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Google Rich Results Test ↗</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Google AdSense */}
          {activeTab === 'adsense' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Google AdSense Monetization Engine
                  </span>
                  <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">
                    AdSense Script Active
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  প্ৰেছ এক্সপ্ৰেছ অসমত গুগলৰ প্ৰাসংগিক আৰু উচ্চ উপাৰ্জনকাৰী বিজ্ঞাপন প্ৰদৰ্শন কৰিবলৈ আপোনাৰ AdSense Publisher ID ইয়াত সংযুক্ত কৰক।
                </p>
              </div>

              {/* Publisher ID & Auto Ads */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Google AdSense Publisher ID:
                  </label>
                  <input
                    type="text"
                    value={adsensePubInput}
                    onChange={(e) => setAdsensePubInput(e.target.value)}
                    placeholder="ca-pub-7894210984123567"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    আপোনাৰ Google AdSense একাউণ্টৰ Client ID (ca-pub-...)
                  </p>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Google Auto-Ads Script (স্বয়ংক্রিয় বিজ্ঞাপন)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      গুগলৰ কৃটিম বুদ্ধিমত্তাই বাতৰিৰ মাজত স্বয়ংক্রিয়ভাৱে বিজ্ঞাপন স্থান নিৰ্ধাৰণ কৰিব
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoAdsEnabled}
                      onChange={(e) => setAutoAdsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Save AdSense Configuration
                </button>
              </div>

              {/* ads.txt File Verification Section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-red-600" />
                    Authorized Digital Sellers (ads.txt)
                  </h5>
                  <a
                    href={adsTxtUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View Live ads.txt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  AdSense ৰ বাবে গুগলে বাধ্যতামূলক কৰা <code className="font-mono text-red-600">ads.txt</code> ফাইল ইতিমধ্যে ৱেবচাইটৰ ৰুট ডিৰেক্টৰিত সক্ৰিয় হৈ আছে:
                </p>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>google.com, {settings.adsensePublisherId.replace('ca-', '')}, DIRECT, f08c47fec0942fa0</span>
                  <button
                    onClick={() => handleCopy(`google.com, ${settings.adsensePublisherId.replace('ca-', '')}, DIRECT, f08c47fec0942fa0`, 'adstxt')}
                    className="text-[10px] text-red-600 dark:text-red-400 font-bold hover:underline ml-2 shrink-0"
                  >
                    {copiedItem === 'adstxt' ? 'কপি হ’ল' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Sitemaps & Robots */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-emerald-600" />
                    Google Search & Google News XML Sitemaps
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Auto-Generated
                  </span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  গুগল বট (Googlebot) আৰু গুগল নিউজে প্ৰতিটো নতুন বাতৰি তাৎক্ষণিকভাৱে স্কেন কৰিবলৈ এই ছাইটমেপসমূহ Google Search Console ৰ "Sitemaps" ভাগত জমা কৰক।
                </p>
              </div>

              {/* Sitemap List */}
              <div className="space-y-3">
                {/* Standard XML Sitemap */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      Standard Google Sitemap
                    </span>
                    <a
                      href={sitemapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open XML</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={sitemapUrl}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-700 dark:text-slate-300 select-all"
                    />
                    <button
                      onClick={() => handleCopy(sitemapUrl, 'sitemap')}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      {copiedItem === 'sitemap' ? 'কপি হ’ল' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Google News XML Sitemap */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Google News Specific Sitemap (বাতৰিৰ বিশেষ ছাইটমেপ)
                    </span>
                    <a
                      href={newsSitemapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open News XML</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={newsSitemapUrl}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-700 dark:text-slate-300 select-all"
                    />
                    <button
                      onClick={() => handleCopy(newsSitemapUrl, 'newssitemap')}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      {copiedItem === 'newssitemap' ? 'কপি হ’ল' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Robots.txt */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      Robots.txt Directive File
                    </span>
                    <a
                      href={robotsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View robots.txt</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={robotsUrl}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-700 dark:text-slate-300 select-all"
                    />
                    <button
                      onClick={() => handleCopy(robotsUrl, 'robots')}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                      {copiedItem === 'robots' ? 'কপি হ’ল' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Schema & Structured Data */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Google NewsArticle & Organization Schema.org
                  </span>
                  <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full">
                    JSON-LD Live
                  </span>
                </div>
                <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                  গুগল চার্টছত বাতৰিৰ ফটো, শিৰোনাম, লেখকৰ নাম আৰু প্ৰকাশৰ তাৰিখ আকৰ্ষণীয়ভাৱে প্ৰদৰ্শন হোৱাৰ বাবে Schema.org JSON-LD স্বয়ংক্ৰিয়ভাৱে প্ৰতিটো পৃষ্ঠাত ইনজেক্ট কৰা হৈছে।
                </p>
              </div>

              {/* Schema Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">@type: NewsArticle</span>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Google News Rich Cards
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    প্ৰতিটো বাতৰি পঢ়াৰ সময়ত তাৰ শিৰোনাম, ফটো, লেখক আৰু জিলাৰ তথ্য গুগল বটৰ বাবে তাৎক্ষণিকভাৱে প্ৰস্তুত কৰা হয়।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">@type: NewsMediaOrganization</span>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Official Press Publisher Credibility
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    গুৱাহাটীৰ পৰা প্ৰকাশিত প্ৰেছ এক্সপ্ৰেছ অসমৰ অফিচিয়েল ল'গ', এথিক্স পলিচি আৰু ছ'চিয়েল প্ৰফাইল সংযোগ কৰা আছে।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">@type: SearchAction</span>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Google Sitelinks Search Box
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    গুগলত "Press Express Assam" চাৰ্ছ কৰিলে পোনপটীয়া চাৰ্ছ বক্স ওলোৱাৰ ব্যৱস্থা ইনজেক্ট কৰা হৈছে।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">meta: robots</span>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Max Snippet & Large Image Preview
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Google Discover আৰু Google Chrome চাৰ্ছ ফিডত ডাঙৰ থাম্বনেইল আৰু সম্পূৰ্ণ শিৰোনাম ওলাবলৈ নিৰ্দেশনা দিয়া আছে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>SEO, Sitemaps & AdSense Active</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
