import React, { useState } from 'react';
import { 
  X, 
  PenTool, 
  Flame, 
  Send, 
  Check, 
  AlertCircle, 
  Image as ImageIcon, 
  MapPin, 
  Tag, 
  Radio,
  FilePlus,
  Layers
} from 'lucide-react';
import { Article, UserProfile, NewsCategory, AssamDistrict } from '../types';
import { ASSAM_DISTRICTS, CATEGORY_LABELS } from '../data/mockNews';
import { MediaUploader } from './MediaUploader';

interface EditorDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onPublishArticle: (newArticle: Article) => void;
  onBroadcastBreakingAlert: (title: string, summary: string, category: NewsCategory, district: AssamDistrict) => void;
}

export const EditorDeskModal: React.FC<EditorDeskModalProps> = ({
  isOpen,
  onClose,
  user,
  onPublishArticle,
  onBroadcastBreakingAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'publish' | 'breaking'>('publish');

  // New Article Form
  const [title, setTitle] = useState('');
  const [titleAssamese, setTitleAssamese] = useState('');
  const [category, setCategory] = useState<NewsCategory>('wildlife-floods');
  const [district, setDistrict] = useState<AssamDistrict>('Kamrup Metropolitan');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80');
  const [imageCaption, setImageCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('Assam, Breaking, LiveWire');
  const [isBreaking, setIsBreaking] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Breaking Alert Form
  const [alertHeadline, setAlertHeadline] = useState('');
  const [alertSummary, setAlertSummary] = useState('');
  const [alertCategory, setAlertCategory] = useState<NewsCategory>('wildlife-floods');
  const [alertDistrict, setAlertDistrict] = useState<AssamDistrict>('All Assam');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const trimmedVideo = videoUrl.trim() || undefined;
    const trimmedCaption = imageCaption.trim() || undefined;

    const newArticle: Article = {
      id: 'art-' + Date.now(),
      title: title.trim(),
      titleAssamese: titleAssamese.trim() || undefined,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
      summary: summary.trim(),
      content: content.trim() ? content.split('\n\n') : [summary],
      category,
      district,
      author: user.name,
      authorRole: user.role === 'admin' ? 'Chief Editor' : user.role === 'editor' ? 'Senior Desk Editor' : 'Field Correspondent',
      publishedAt: new Date().toISOString(),
      readTimeMinutes: Math.max(2, Math.round(content.length / 400)),
      views: 120,
      shares: 14,
      isBreaking,
      isExclusive: true,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: imageUrl.trim(),
      imageCaption: trimmedCaption,
      videoUrl: trimmedVideo,
      videoStreamUrl: trimmedVideo,
      popularityScore: isBreaking ? 95 : 80,
      cachedOffline: true,
    };

    onPublishArticle(newArticle);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      onClose();
    }, 1200);
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertHeadline.trim()) return;

    onBroadcastBreakingAlert(
      alertHeadline.trim(),
      alertSummary.trim() || alertHeadline.trim(),
      alertCategory,
      alertDistrict
    );
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Press Express Newsroom & Editorial Desk</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as <strong>{user.name}</strong> ({user.role.toUpperCase()})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Story Publishing vs Instant Breaking Alert */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950 text-xs font-bold">
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'publish'
                ? 'border-b-2 border-red-700 text-red-700 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            Publish New Assam Report
          </button>
          <button
            onClick={() => setActiveTab('breaking')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'breaking'
                ? 'border-b-2 border-red-700 text-red-700 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-600" />
            Broadcast Immediate Breaking Push Alert
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'publish' ? (
            <form onSubmit={handlePublishSubmit} className="space-y-4">
              {/* Title & Assamese title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Headline (English) *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Guwahati Riverfront Promenade Phase 2 Inaugurated"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Headline (Assamese / অসমীয়া)</label>
                  <input
                    type="text"
                    value={titleAssamese}
                    onChange={(e) => setTitleAssamese(e.target.value)}
                    placeholder="e.g., গুৱাহাটীৰ ব্ৰহ্মপুত্ৰ ৰিভাৰফ্ৰণ্টৰ দ্বিতীয় পৰ্যায়ৰ শুভাৰম্ভ"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                  />
                </div>
              </div>

              {/* Category & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Vertical Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                  >
                    {Object.keys(CATEGORY_LABELS).filter(c => c !== 'all' && c !== 'offline').map((cat) => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat].en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Assam District Focus *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as AssamDistrict)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                  >
                    {ASSAM_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="font-bold block mb-1">Summary / Lead Paragraph *</label>
                <textarea
                  required
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Key facts summarizing the event in 2-3 sentences..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="font-bold block mb-1">Full Article Body (Separate paragraphs with blank lines)</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detailed report text, quotes, and background..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              {/* Photo & Video Upload from Gallery Component */}
              <MediaUploader
                imageUrl={imageUrl}
                onImageChange={setImageUrl}
                imageCaption={imageCaption}
                onCaptionChange={setImageCaption}
                videoUrl={videoUrl}
                onVideoChange={setVideoUrl}
              />

              {/* Tags */}
              <div>
                <label className="font-bold block mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Assam, Technology, Guwahati"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              {/* Breaking Flag Checkbox */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <input
                  type="checkbox"
                  id="breakingCheck"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                <label htmlFor="breakingCheck" className="font-bold text-red-700 dark:text-red-400 cursor-pointer">
                  Mark as Breaking Urgent Story & Dispatch Real-Time Web Push Alerts
                </label>
              </div>

              {publishSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4" /> Story published live to Press Express wire!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow"
                >
                  Publish to News Wire
                </button>
              </div>
            </form>
          ) : (
            /* Breaking Alert Instant Dispatch Form */
            <form onSubmit={handleBroadcastAlert} className="space-y-4">
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 space-y-1">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  Urgent Push Notification Broadcast System
                </div>
                <p className="text-[11px] text-slate-500">
                  Transmits high-priority alerts directly to subscriber mobile devices and the website breaking ticker.
                </p>
              </div>

              <div>
                <label className="font-bold block mb-1">Breaking Alert Headline *</label>
                <input
                  type="text"
                  required
                  value={alertHeadline}
                  onChange={(e) => setAlertHeadline(e.target.value)}
                  placeholder="e.g., ASDMA Flash Alert: Brahmaputra River Basin 48-Hour Gauge Update"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Brief Summary Details</label>
                <textarea
                  rows={2}
                  value={alertSummary}
                  onChange={(e) => setAlertSummary(e.target.value)}
                  placeholder="Additional advisory information sent to subscriber push inbox..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={alertCategory}
                    onChange={(e) => setAlertCategory(e.target.value as NewsCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                  >
                    <option value="wildlife-floods">Brahmaputra Floods & Weather</option>
                    <option value="politics">Politics & Assembly</option>
                    <option value="tea-economy">Tea & Economy</option>
                    <option value="guwahati">Guwahati Metro</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Target District</label>
                  <select
                    value={alertDistrict}
                    onChange={(e) => setAlertDistrict(e.target.value as AssamDistrict)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-600 outline-none"
                  >
                    {ASSAM_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4" /> Push broadcast dispatched to all active subscribers!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Send Immediate Push Broadcast</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>Editorial changes are instantly verified and cached in local & cloud synchronizers</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
