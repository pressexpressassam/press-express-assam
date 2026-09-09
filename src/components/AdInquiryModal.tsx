import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, CheckCircle2, DollarSign, Building, Sparkles } from 'lucide-react';
import { AdPosition } from '../types';
import { storageService } from '../services/storageService';

interface AdInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: AdPosition;
}

export const AdInquiryModal: React.FC<AdInquiryModalProps> = ({
  isOpen,
  onClose,
  defaultPosition = 'header'
}) => {
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [adPosition, setAdPosition] = useState<AdPosition>(defaultPosition);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim()) return;

    storageService.submitAdInquiry({
      clientName: clientName.trim(),
      businessName: businessName.trim() || clientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      adPosition,
      durationWeeks,
      message: message.trim()
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setClientName('');
    setBusinessName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Advertise With Press Express Assam</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-serif">
                প্ৰেছ এক্সপ্ৰেছ অসমত আপোনাৰ ব্যৱসায়ৰ বিজ্ঞাপন দিয়ক
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center ring-4 ring-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  বিজ্ঞাপনৰ আবেদন সফলতাৰে প্ৰেৰণ কৰা হ'ল!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  আমাৰ বিজ্ঞাপন বিভাগে অতি সোনকালে আপোনাৰ সৈতে ফোন বা WhatsApp-ৰ জৰিয়তে যোগাযোগ কৰিব।
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <a
                  href={`https://wa.me/919864012345?text=${encodeURIComponent(`নমস্কাৰ, মই Press Express Assam-ত মোৰ ব্যৱসায় "${businessName || clientName}"-ৰ বিজ্ঞাপন দিব বিচাৰোঁ। অনুগ্ৰহ কৰি ৰেট কাৰ্ড আৰু সবিশেষ জনাব।`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>পোনপটীয়াকৈ WhatsApp-ত কথা পাতক</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors"
                >
                  বন্ধ কৰক (Close)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Highlight Perks */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  দৈনিক ১.৫ লাখতকৈ অধিক সক্ৰিয় অসমীয়া পঢ়ুৱৈৰ মাজত আপোনাৰ ব্ৰেণ্ড বা দোকানৰ প্ৰচাৰ কৰক। আকৰ্ষণীয় ব্যেনাৰ আৰু ক্লীক ৰিপ'ৰ্টৰ সুবিধা!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    আপোনাৰ নাম (Your Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. ৰক্তিম বৰা"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    প্ৰতিষ্ঠান / দোকানৰ নাম (Business Name)
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. অসম ছিল্ক এম্পৰিয়াম"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    ফোন / WhatsApp নম্বৰ *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98640 XXXXX"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    ইমেইল (Email)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@business.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    বিজ্ঞাপনৰ স্থান (Ad Placement)
                  </label>
                  <select
                    value={adPosition}
                    onChange={(e) => setAdPosition(e.target.value as AdPosition)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                  >
                    <option value="header">শীৰ্ষ ব্যেনাৰ (Header Leaderboard)</option>
                    <option value="in_feed">বাতৰিৰ মাজত (In-Feed Native Ad)</option>
                    <option value="article_middle">প্ৰবন্ধৰ ভিতৰত (In-Article Ad)</option>
                    <option value="sidebar">ছাইডবাৰ (Sidebar Banner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    সময়সীমা (Duration)
                  </label>
                  <select
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                  >
                    <option value={1}>১ সপ্তাহ (1 Week)</option>
                    <option value={2}>২ সপ্তাহ (2 Weeks)</option>
                    <option value={4}>১ মাহ (1 Month - প্ৰস্তাবিত)</option>
                    <option value={12}>৩ মাহ (Quarterly Package)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  বিৱৰণ বা বাজেটৰ তথ্য (Optional Message)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপোনাৰ ব্যৱসায় আৰু বিজ্ঞাপনৰ বিশেষ অনুৰোধ লিখক..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-transform hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>আবেদন প্ৰেৰণ কৰক (Submit Inquiry)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
