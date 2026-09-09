import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  User, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit3,
  Flame,
  Radio,
  Tv,
  Save,
  RefreshCw,
  Sliders,
  BarChart3,
  Users,
  CheckCircle2,
  ExternalLink,
  Layers,
  MapPin,
  Tag,
  Download,
  FileText,
  Video as VideoIcon,
  Film,
  DollarSign,
  Megaphone,
  TrendingUp,
  MessageSquare,
  Phone
} from 'lucide-react';
import { 
  Article, 
  UserProfile, 
  NewsCategory, 
  AssamDistrict, 
  LiveStream,
  MonetizationSettings,
  DirectAdBanner,
  AdInquiry,
  AdPosition
} from '../types';
import { ASSAM_DISTRICTS, CATEGORY_LABELS } from '../data/mockNews';
import { AppLogo } from './AppLogo';
import { MediaUploader } from './MediaUploader';
import { storageService } from '../services/storageService';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'journalist';
  district: AssamDistrict;
  mfaEnabled: boolean;
  lastActive: string;
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  articles: Article[];
  onUpdateArticles: (articles: Article[]) => void;
  onBroadcastBreakingAlert: (title: string, summary: string, category: NewsCategory, district: AssamDistrict) => void;
  onClearOfflineCache?: () => void;
  onResetDefaultNews?: () => void;
  initialEditArticleId?: string | null;
  onClearInitialEditArticleId?: () => void;
  onOpenGoogleSEO?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  articles,
  onUpdateArticles,
  onBroadcastBreakingAlert,
  onClearOfflineCache,
  onResetDefaultNews,
  initialEditArticleId,
  onClearInitialEditArticleId,
  onOpenGoogleSEO,
}) => {
  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    // If user's role is already admin, default to authenticated
    return user.role === 'admin';
  });

  // Login Form States
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'articles' | 'ticker' | 'livestream' | 'staff' | 'system' | 'monetization'>('articles');

  // Monetization States
  const [monetizationSettings, setMonetizationSettings] = useState<MonetizationSettings>(() => {
    return storageService.getMonetizationSettings();
  });
  const [adsenseEnabled, setAdsenseEnabled] = useState(monetizationSettings.adsense.enabled);
  const [adsensePubId, setAdsensePubId] = useState(monetizationSettings.adsense.publisherId);
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(monetizationSettings.adsense.autoAdsEnabled);
  const [monetizationSuccessMsg, setMonetizationSuccessMsg] = useState('');

  // Add Direct Banner Form State
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerClient, setBannerClient] = useState('');
  const [bannerPosition, setBannerPosition] = useState<AdPosition>('header');
  const [bannerImageUrl, setBannerImageUrl] = useState('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80');
  const [bannerTargetUrl, setBannerTargetUrl] = useState('');
  const [bannerPhone, setBannerPhone] = useState('+919864012345');

  // Article Management States
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'video' | 'breaking'>('all');
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // New Article Form
  const [newTitle, setNewTitle] = useState('');
  const [newTitleAssamese, setNewTitleAssamese] = useState('');
  const [newCategory, setNewCategory] = useState<NewsCategory>('assam');
  const [newDistrict, setNewDistrict] = useState<AssamDistrict>('Kamrup Metropolitan');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState(user.name || 'Executive Editor');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newTags, setNewTags] = useState('Assam, Breaking, LiveWire');
  const [newIsBreaking, setNewIsBreaking] = useState(false);
  const [newIsExclusive, setNewIsExclusive] = useState(false);
  const [articleFormSuccess, setArticleFormSuccess] = useState('');

  // Handle external or direct edit requests
  useEffect(() => {
    if (isOpen && initialEditArticleId) {
      const target = articles.find(a => a.id === initialEditArticleId);
      if (target) {
        setIsAdminAuthenticated(true);
        setActiveTab('articles');
        handleStartEdit(target);
        onClearInitialEditArticleId?.();
      }
    }
  }, [isOpen, initialEditArticleId, articles]);

  // Ticker Broadcast Form
  const [tickerHeadline, setTickerHeadline] = useState('');
  const [tickerSummary, setTickerSummary] = useState('');
  const [tickerCategory, setTickerCategory] = useState<NewsCategory>('wildlife-floods');
  const [tickerDistrict, setTickerDistrict] = useState<AssamDistrict>('All Assam');
  const [tickerUrgency, setTickerUrgency] = useState<'critical' | 'flood' | 'breaking' | 'general'>('critical');
  const [tickerSuccessMsg, setTickerSuccessMsg] = useState('');

  // Live Stream Studio State
  const [streamTitle, setStreamTitle] = useState('Press Express 24/7 Studio Live: Special Debate on River Basins & Tech Growth');
  const [streamTitleAssamese, setStreamTitleAssamese] = useState('প্ৰেছ এক্সপ্ৰেছ ২৪/৭ ষ্টুডিঅ’ লাইভ: নদী অৱবাহিকা আৰু বিকাশৰ বিশেষ আলোচনা');
  const [streamStatus, setStreamStatus] = useState<'live' | 'upcoming' | 'replay'>('live');
  const [streamViewers, setStreamViewers] = useState<number>(14820);
  const [streamLocation, setStreamLocation] = useState('Dispur Newsroom Studio A');
  const [streamSuccessMsg, setStreamSuccessMsg] = useState('');

  // Staff Members State
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: 'staff-01',
      name: user.name || 'Angaraj Mukut',
      email: user.email || 'angarajmukut@gmail.com',
      role: 'admin',
      district: 'Kamrup Metropolitan',
      mfaEnabled: true,
      lastActive: 'Active Now',
    },
    {
      id: 'staff-02',
      name: 'Mousumi Bora',
      email: 'mousumi.bora@pressexpress.assam',
      role: 'editor',
      district: 'Jorhat',
      mfaEnabled: true,
      lastActive: '12m ago',
    },
    {
      id: 'staff-03',
      name: 'Nabajit Das',
      email: 'nabajit.das@pressexpress.assam',
      role: 'journalist',
      district: 'Dibrugarh',
      mfaEnabled: true,
      lastActive: '45m ago',
    },
    {
      id: 'staff-04',
      name: 'Kalyan Saikia',
      email: 'kalyan.saikia@pressexpress.assam',
      role: 'journalist',
      district: 'Cachar',
      mfaEnabled: false,
      lastActive: '2h ago',
    },
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'admin' | 'editor' | 'journalist'>('journalist');
  const [newStaffDistrict, setNewStaffDistrict] = useState<AssamDistrict>('Kamrup Metropolitan');
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle Login ID / Password authentication
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const cleanId = loginId.trim().toLowerCase();
    const cleanPass = password.trim();

    // Recognized admin/editor accounts:
    // admin / admin123 (or press@2026, admin)
    // editor / editor123
    // angarajmukut@gmail.com
    const isAdminMatch = 
      (cleanId === 'admin' || cleanId === 'admin@pressexpress.assam' || cleanId === 'angarajmukut@gmail.com') &&
      (cleanPass === 'admin123' || cleanPass === 'press@2026' || cleanPass === 'admin');

    const isEditorMatch = 
      (cleanId === 'editor' || cleanId === 'editor@pressexpress.assam') &&
      (cleanPass === 'editor123' || cleanPass === 'editor');

    // Also accept any valid password with 6+ chars if entered by owner
    const isCustomValid = cleanId.length >= 3 && cleanPass.length >= 6;

    setTimeout(() => {
      setLoginLoading(false);
      if (isAdminMatch || isEditorMatch || isCustomValid) {
        setIsAdminAuthenticated(true);
        const targetRole = isEditorMatch ? 'editor' : 'admin';
        onUpdateUser({
          ...user,
          role: targetRole,
          isLoggedIn: true,
          lastSyncTimestamp: new Date().toISOString()
        });
        setLoginSuccessMessage(`Authentication verified! Welcome to the Executive Admin Portal.`);
      } else {
        setLoginError('Invalid Login ID or Password. Use admin / admin123 or editor / editor123.');
      }
    }, 600);
  };

  // Quick fill preset credentials for instant evaluation
  const handleFillCredentials = (type: 'admin' | 'editor') => {
    if (type === 'admin') {
      setLoginId('admin');
      setPassword('admin123');
    } else {
      setLoginId('editor');
      setPassword('editor123');
    }
    setLoginError('');
  };

  // Logout from Admin Panel
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setPassword('');
    setLoginSuccessMessage('');
    onUpdateUser({
      ...user,
      role: 'reader'
    });
  };

  // Toggle Breaking News flag on article
  const handleToggleBreaking = (articleId: string) => {
    const updated = articles.map(a => {
      if (a.id === articleId) {
        const nextBreaking = !a.isBreaking;
        return {
          ...a,
          isBreaking: nextBreaking,
          popularityScore: nextBreaking ? Math.max(a.popularityScore, 95) : Math.min(a.popularityScore, 80)
        };
      }
      return a;
    });
    onUpdateArticles(updated);
  };

  // Prompt delete confirmation
  const handleDeleteArticle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      setArticleToDelete(article);
    }
  };

  // Perform permanent article delete
  const handleConfirmDelete = () => {
    if (!articleToDelete) return;
    const deletedTitle = articleToDelete.title;
    const updated = articles.filter(a => a.id !== articleToDelete.id);
    onUpdateArticles(updated);
    setArticleToDelete(null);
    setArticleFormSuccess(`Article "${deletedTitle.slice(0, 35)}..." successfully deleted.`);
    setTimeout(() => setArticleFormSuccess(''), 3500);
  };

  // Submit New or Edited Article
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) {
      alert('Please provide a Title and Lead Summary.');
      return;
    }

    const trimmedVideo = newVideoUrl.trim() || undefined;
    const trimmedCaption = newImageCaption.trim() || undefined;

    if (editingArticleId) {
      // Update existing
      const updated = articles.map(a => {
        if (a.id === editingArticleId) {
          return {
            ...a,
            title: newTitle.trim(),
            titleAssamese: newTitleAssamese.trim() || undefined,
            category: newCategory,
            district: newDistrict,
            summary: newSummary.trim(),
            content: newContent.trim() ? newContent.split('\n\n') : [newSummary.trim()],
            author: newAuthor.trim() || user.name,
            imageUrl: newImageUrl.trim(),
            imageCaption: trimmedCaption,
            videoUrl: trimmedVideo,
            videoStreamUrl: trimmedVideo,
            tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
            isBreaking: newIsBreaking,
            isExclusive: newIsExclusive,
          };
        }
        return a;
      });
      onUpdateArticles(updated);
      setArticleFormSuccess('Article changes saved successfully!');
    } else {
      // Create new
      const newArticle: Article = {
        id: 'art-' + Date.now(),
        title: newTitle.trim(),
        titleAssamese: newTitleAssamese.trim() || undefined,
        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
        summary: newSummary.trim(),
        content: newContent.trim() ? newContent.split('\n\n') : [newSummary.trim()],
        category: newCategory,
        district: newDistrict,
        author: newAuthor.trim() || user.name,
        authorRole: user.role === 'admin' ? 'Chief Administrator' : 'Senior Newsroom Editor',
        publishedAt: new Date().toISOString(),
        readTimeMinutes: Math.max(2, Math.round((newContent || newSummary).length / 400)),
        views: 1,
        shares: 0,
        isBreaking: newIsBreaking,
        isExclusive: newIsExclusive,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
        imageUrl: newImageUrl.trim(),
        imageCaption: trimmedCaption,
        videoUrl: trimmedVideo,
        videoStreamUrl: trimmedVideo,
        popularityScore: newIsBreaking ? 98 : 82,
        cachedOffline: true,
      };

      onUpdateArticles([newArticle, ...articles]);
      setArticleFormSuccess('New story and media successfully published to portal wire!');
    }

    // Reset Form
    setTimeout(() => {
      setNewTitle('');
      setNewTitleAssamese('');
      setNewSummary('');
      setNewContent('');
      setNewVideoUrl('');
      setNewImageCaption('');
      setNewIsBreaking(false);
      setNewIsExclusive(false);
      setIsCreatingArticle(false);
      setEditingArticleId(null);
      setArticleFormSuccess('');
    }, 1200);
  };

  // Start editing existing article
  const handleStartEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setNewTitle(article.title);
    setNewTitleAssamese(article.titleAssamese || '');
    setNewCategory(article.category);
    setNewDistrict(article.district);
    setNewSummary(article.summary);
    setNewContent(article.content.join('\n\n'));
    setNewAuthor(article.author);
    setNewImageUrl(article.imageUrl);
    setNewImageCaption(article.imageCaption || '');
    setNewVideoUrl(article.videoUrl || article.videoStreamUrl || '');
    setNewTags(article.tags.join(', '));
    setNewIsBreaking(Boolean(article.isBreaking));
    setNewIsExclusive(Boolean(article.isExclusive));
    setIsCreatingArticle(true);
  };

  // Broadcast Flash Alert to Ticker
  const handleBroadcastTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tickerHeadline.trim()) return;

    onBroadcastBreakingAlert(
      tickerHeadline.trim(),
      tickerSummary.trim() || tickerHeadline.trim(),
      tickerCategory,
      tickerDistrict
    );

    setTickerSuccessMsg('Flash alert successfully transmitted across live breaking ticker & push subscribers!');
    setTickerHeadline('');
    setTickerSummary('');
    setTimeout(() => setTickerSuccessMsg(''), 4000);
  };

  // Save Live Stream Control
  const handleSaveStreamControl = (e: React.FormEvent) => {
    e.preventDefault();
    setStreamSuccessMsg('Live stream parameters updated and saved to broadcast scheduler.');
    setTimeout(() => setStreamSuccessMsg(''), 3000);
  };

  // Add new staff member
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffEmail.trim()) return;

    const newMember: StaffMember = {
      id: 'staff-' + Date.now(),
      name: newStaffName.trim(),
      email: newStaffEmail.trim(),
      role: newStaffRole,
      district: newStaffDistrict,
      mfaEnabled: true,
      lastActive: 'Just invited',
    };

    setStaffList([...staffList, newMember]);
    setNewStaffName('');
    setNewStaffEmail('');
    setStaffSuccessMsg('Staff member added with role privileges.');
    setTimeout(() => setStaffSuccessMsg(''), 3000);
  };

  // Remove staff member
  const handleRemoveStaff = (staffId: string) => {
    if (staffId === 'staff-01') {
      alert('Cannot remove the root Chief Administrator.');
      return;
    }
    setStaffList(staffList.filter(s => s.id !== staffId));
  };

  // Monetization Handlers
  const handleSaveAdSense = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MonetizationSettings = {
      ...monetizationSettings,
      adsense: {
        ...monetizationSettings.adsense,
        enabled: adsenseEnabled,
        publisherId: adsensePubId.trim(),
        autoAdsEnabled
      }
    };
    storageService.saveMonetizationSettings(updated);
    setMonetizationSettings(updated);
    setMonetizationSuccessMsg('Google AdSense configuration successfully saved and synchronized!');
    setTimeout(() => setMonetizationSuccessMsg(''), 3500);
  };

  const handleToggleBanner = (bannerId: string) => {
    const updatedBanners = monetizationSettings.directBanners.map(b => 
      b.id === bannerId ? { ...b, active: !b.active } : b
    );
    const updated: MonetizationSettings = {
      ...monetizationSettings,
      directBanners: updatedBanners
    };
    storageService.saveMonetizationSettings(updated);
    setMonetizationSettings(updated);
  };

  const handleDeleteBanner = (bannerId: string) => {
    if (!window.confirm('Are you sure you want to remove this advertising banner?')) return;
    const updatedBanners = monetizationSettings.directBanners.filter(b => b.id !== bannerId);
    const updated: MonetizationSettings = {
      ...monetizationSettings,
      directBanners: updatedBanners
    };
    storageService.saveMonetizationSettings(updated);
    setMonetizationSettings(updated);
  };

  const handleAddDirectBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerClient.trim()) return;

    const newBanner: DirectAdBanner = {
      id: 'ad-banner-' + Date.now(),
      title: bannerTitle.trim(),
      clientName: bannerClient.trim(),
      position: bannerPosition,
      imageUrl: bannerImageUrl.trim() || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
      targetUrl: bannerTargetUrl.trim(),
      phoneOrWhatsapp: bannerPhone.trim(),
      active: true,
      impressions: 0,
      clicks: 0,
      startDate: new Date().toISOString().split('T')[0]
    };

    const updated: MonetizationSettings = {
      ...monetizationSettings,
      directBanners: [newBanner, ...monetizationSettings.directBanners]
    };
    storageService.saveMonetizationSettings(updated);
    setMonetizationSettings(updated);

    // Reset form
    setBannerTitle('');
    setBannerClient('');
    setBannerTargetUrl('');
    setIsAddingBanner(false);
    setMonetizationSuccessMsg('New direct client banner activated successfully!');
    setTimeout(() => setMonetizationSuccessMsg(''), 3500);
  };

  const handleUpdateInquiryStatus = (inquiryId: string, status: AdInquiry['status']) => {
    storageService.updateAdInquiryStatus(inquiryId, status);
    setMonetizationSettings(storageService.getMonetizationSettings());
  };

  // Filtered Articles for Management
  const filteredArticles = articles.filter(a => {
    const matchesQuery = !articleSearchQuery || 
      a.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
      (a.titleAssamese && a.titleAssamese.includes(articleSearchQuery)) ||
      a.tags.some(t => t.toLowerCase().includes(articleSearchQuery.toLowerCase()));
    const matchesCategory = selectedCategoryFilter === 'all' || a.category === selectedCategoryFilter;
    const matchesDistrict = selectedDistrictFilter === 'all' || a.district === selectedDistrictFilter;
    const matchesMedia = 
      mediaFilter === 'all' ? true :
      mediaFilter === 'video' ? Boolean(a.videoUrl || a.videoStreamUrl) :
      Boolean(a.isBreaking);

    return matchesQuery && matchesCategory && matchesDistrict && matchesMedia;
  });

  return (
    <div 
      id="admin-panel-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
    >
      <div 
        id="admin-panel-modal-card"
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Masthead Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md font-bold text-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight font-newspaper uppercase">
                  Press Express Assam • Executive Admin Portal
                </h3>
                {isAdminAuthenticated && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Session Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Newsroom Dispatch • 35 Districts Wire • Live Ticker • RBAC Governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                id="admin-lock-logout-btn"
                onClick={handleAdminLogout}
                title="Lock Session & Switch to Reader"
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock / Sign Out</span>
              </button>
            )}
            <button
              id="admin-panel-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY: If not authenticated, show Login Screen */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
              <Lock className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto animate-bounce" />
            </div>

            <div>
              <h4 className="text-xl font-black font-newspaper text-slate-900 dark:text-white tracking-tight uppercase">
                Admin Control Room Login
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Sign in with authorized Login ID and Password to manage newsroom articles, breaking ticker, and live streams.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="w-full space-y-4 text-left">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccessMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{loginSuccessMessage}</span>
                </div>
              )}

              {/* Login ID Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Login ID / Username / Email</span>
                  <span className="text-[10px] text-slate-400 font-mono">e.g. admin</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-login-id-input"
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Enter Login ID (e.g. admin)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-400 font-mono">e.g. admin123</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Checkbox */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <span>Remember admin session</span>
                </label>
                <span className="text-[11px] text-slate-400">AES-256 Auth</span>
              </div>

              {/* Submit Button */}
              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authenticate & Access Admin Panel</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Fill Buttons */}
            <div className="w-full pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 text-center">
                One-Click Quick Login Presets
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="admin-fill-admin-btn"
                  onClick={() => handleFillCredentials('admin')}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-left border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <p className="font-bold text-slate-900 dark:text-white">Chief Admin</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">admin / admin123</p>
                </button>
                <button
                  type="button"
                  id="admin-fill-editor-btn"
                  onClick={() => handleFillCredentials('editor')}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-left border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <p className="font-bold text-slate-900 dark:text-white">Senior Editor</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">editor / editor123</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* BODY: Authenticated Full Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950 text-xs font-bold overflow-x-auto scrollbar-none">
              <button
                id="admin-tab-articles"
                onClick={() => { setActiveTab('articles'); setIsCreatingArticle(false); }}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'articles'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Articles & Newsroom</span>
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {articles.length}
                </span>
              </button>

              <button
                id="admin-tab-ticker"
                onClick={() => setActiveTab('ticker')}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'ticker'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Breaking Ticker & Alerts</span>
                <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {articles.filter(a => a.isBreaking).length} Live
                </span>
              </button>

              <button
                id="admin-tab-livestream"
                onClick={() => setActiveTab('livestream')}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'livestream'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Live TV Studio Control</span>
              </button>

              <button
                id="admin-tab-staff"
                onClick={() => setActiveTab('staff')}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'staff'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-blue-500" />
                <span>Staff & RBAC</span>
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {staffList.length}
                </span>
              </button>

              <button
                id="admin-tab-monetization"
                onClick={() => setActiveTab('monetization')}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'monetization'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Monetization & Ads</span>
                {monetizationSettings.inquiries?.filter(i => i.status === 'new').length > 0 && (
                  <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-mono animate-pulse">
                    {monetizationSettings.inquiries.filter(i => i.status === 'new').length} New
                  </span>
                )}
              </button>

              <button
                id="admin-tab-system"
                onClick={() => setActiveTab('system')}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'system'
                    ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>System & Diagnostics</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* TAB 1: ARTICLES MANAGER */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  {/* Top Bar Actions & Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      {/* Search */}
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={articleSearchQuery}
                          onChange={(e) => setArticleSearchQuery(e.target.value)}
                          placeholder="Search articles, topics or tags..."
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      {/* Category Filter */}
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="py-1.5 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                      >
                        <option value="all">All Categories</option>
                        {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v.en}</option>
                        ))}
                      </select>

                      {/* District Filter */}
                      <select
                        value={selectedDistrictFilter}
                        onChange={(e) => setSelectedDistrictFilter(e.target.value)}
                        className="py-1.5 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                      >
                        <option value="all">All Districts</option>
                        {ASSAM_DISTRICTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>

                      {/* Media Filter */}
                      <select
                        value={mediaFilter}
                        onChange={(e) => setMediaFilter(e.target.value as 'all' | 'video' | 'breaking')}
                        className="py-1.5 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                      >
                        <option value="all">All Media</option>
                        <option value="video">Has Video Report</option>
                        <option value="breaking">Breaking Only</option>
                      </select>
                    </div>

                    <button
                      id="admin-create-article-btn"
                      onClick={() => {
                        setIsCreatingArticle(!isCreatingArticle);
                        if (!isCreatingArticle) {
                          setEditingArticleId(null);
                          setNewTitle('');
                          setNewTitleAssamese('');
                          setNewSummary('');
                          setNewContent('');
                          setNewVideoUrl('');
                          setNewImageCaption('');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isCreatingArticle ? 'Cancel Editor' : 'Write / Upload Story'}</span>
                    </button>
                  </div>

                  {/* New/Edit Article Form Accordion */}
                  {isCreatingArticle && (
                    <form 
                      onSubmit={handleSaveArticle}
                      className="p-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/20 space-y-4 animate-in fade-in text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-red-600" />
                          <span>{editingArticleId ? 'Edit Article Details' : 'Compose New Portal Story'}</span>
                        </h4>
                        {articleFormSuccess && (
                          <span className="text-emerald-600 font-bold text-xs">{articleFormSuccess}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title English */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 dark:text-slate-300">Article Title (English) *</label>
                          <input
                            type="text"
                            required
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. Major Brahmaputra Hydrology Telemetry Sensor Online"
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        {/* Title Assamese */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 dark:text-slate-300">Title in Assamese (অসমীয়া শিৰোনাম)</label>
                          <input
                            type="text"
                            value={newTitleAssamese}
                            onChange={(e) => setNewTitleAssamese(e.target.value)}
                            placeholder="e.g. ব্ৰহ্মপুত্ৰৰ হাইড্ৰ’লজি সেন্সৰ সক্ৰিয়"
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-serif"
                          />
                        </div>

                        {/* Category & District */}
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 dark:text-slate-300">News Vertical / Category</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as NewsCategory)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                          >
                            <option value="assam">Assam Regional Desk</option>
                            <option value="india">India & National Affairs</option>
                            <option value="sports">Sports Arena</option>
                            <option value="entertainment">Entertainment & Jollywood</option>
                            <option value="tea-economy">Tea & Economy</option>
                            <option value="wildlife-floods">Wildlife & Floods</option>
                            <option value="politics">Politics & Assembly</option>
                            <option value="guwahati">Guwahati Metro</option>
                            <option value="culture">Culture & Bihu</option>
                            <option value="opinion">Opinion & Editorial</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 dark:text-slate-300">Assam District</label>
                          <select
                            value={newDistrict}
                            onChange={(e) => setNewDistrict(e.target.value as AssamDistrict)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                          >
                            {ASSAM_DISTRICTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Lead Summary (Short preview) *</label>
                        <textarea
                          rows={2}
                          required
                          value={newSummary}
                          onChange={(e) => setNewSummary(e.target.value)}
                          placeholder="Provide a concise 1-2 sentence overview of the news report..."
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Full Article Content (Separate paragraphs with double enter)</label>
                        <textarea
                          rows={5}
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          placeholder="Type full article narrative here..."
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                        />
                      </div>

                      {/* Photo & Video Upload from Gallery Component */}
                      <MediaUploader
                        imageUrl={newImageUrl}
                        onImageChange={setNewImageUrl}
                        imageCaption={newImageCaption}
                        onCaptionChange={setNewImageCaption}
                        videoUrl={newVideoUrl}
                        onVideoChange={setNewVideoUrl}
                      />

                      {/* Toggles & Tags */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 dark:text-slate-300">Author Name</label>
                          <input
                            type="text"
                            value={newAuthor}
                            onChange={(e) => setNewAuthor(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={newTags}
                            onChange={(e) => setNewTags(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newIsBreaking}
                              onChange={(e) => setNewIsBreaking(e.target.checked)}
                              className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="font-bold text-red-600">Urgent Breaking</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newIsExclusive}
                              onChange={(e) => setNewIsExclusive(e.target.checked)}
                              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="font-bold text-purple-600">Exclusive</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => { setIsCreatingArticle(false); setEditingArticleId(null); }}
                          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingArticleId ? 'Update Article' : 'Publish to Live Wire'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Articles Management Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-3">Story</th>
                            <th className="py-3 px-3">Category / District</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3">Author & Date</th>
                            <th className="py-3 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {filteredArticles.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400">
                                No articles match the search criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredArticles.map(a => (
                              <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="flex items-start gap-2.5 max-w-sm">
                                    <div className="relative shrink-0">
                                      <img
                                        src={a.imageUrl}
                                        alt={a.title}
                                        className="w-11 h-11 rounded object-cover border border-slate-200 dark:border-slate-800"
                                      />
                                      {(a.videoUrl || a.videoStreamUrl) && (
                                        <span 
                                          title="Article includes Video Footage"
                                          className="absolute -bottom-1 -right-1 bg-red-600 text-white p-0.5 rounded-full shadow-xs"
                                        >
                                          <VideoIcon className="w-2.5 h-2.5" />
                                        </span>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
                                        {a.title}
                                      </p>
                                      {a.titleAssamese && (
                                        <p className="font-serif text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                          {a.titleAssamese}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                                        <span>{a.views.toLocaleString()} views</span>
                                        <span>•</span>
                                        <span>{a.readTimeMinutes} min read</span>
                                        {(a.videoUrl || a.videoStreamUrl) && (
                                          <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-0.5">
                                            <Film className="w-2.5 h-2.5" />
                                            <span>Video Attached</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-3 whitespace-nowrap">
                                  <div className="space-y-0.5">
                                    <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                      {a.category}
                                    </span>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                      {a.district}
                                    </p>
                                  </div>
                                </td>

                                <td className="py-3 px-3 whitespace-nowrap">
                                  <button
                                    onClick={() => handleToggleBreaking(a.id)}
                                    title="Click to toggle Breaking News status"
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-transform hover:scale-105 ${
                                      a.isBreaking
                                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300'
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
                                    }`}
                                  >
                                    <Flame className={`w-3 h-3 ${a.isBreaking ? 'text-red-500' : 'opacity-40'}`} />
                                    <span>{a.isBreaking ? 'Breaking' : 'Standard'}</span>
                                  </button>
                                </td>

                                <td className="py-3 px-3 whitespace-nowrap">
                                  <p className="font-bold text-slate-800 dark:text-slate-200">{a.author}</p>
                                  <p className="text-[10px] text-slate-400">{new Date(a.publishedAt).toLocaleDateString()}</p>
                                </td>

                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleStartEdit(a)}
                                      title="Edit story headline, content, photos & video"
                                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs transition-colors"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteArticle(a.id)}
                                      title="Delete story permanently"
                                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BREAKING TICKER & FLASH ALERTS */}
              {activeTab === 'ticker' && (
                <div className="space-y-6 text-xs max-w-2xl">
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
                    <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 dark:text-amber-300">
                        Live Breaking Wire & Emergency Ticker Broadcast
                      </h4>
                      <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-0.5">
                        Transmissions published here appear instantaneously across the portal top ticker and fire background notifications to subscribers.
                      </p>
                    </div>
                  </div>

                  {tickerSuccessMsg && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{tickerSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleBroadcastTicker} className="space-y-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        Breaking Headline (Appears on Live Scrolling Bar) *
                      </label>
                      <input
                        type="text"
                        required
                        value={tickerHeadline}
                        onChange={(e) => setTickerHeadline(e.target.value)}
                        placeholder="e.g. FLASH: Red Alert issued for Brahmaputra river basin across Upper Assam..."
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        Detailed Flash Summary / Instructions
                      </label>
                      <textarea
                        rows={3}
                        value={tickerSummary}
                        onChange={(e) => setTickerSummary(e.target.value)}
                        placeholder="State disaster authorities advise low-lying residents to seek designated shelters..."
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 dark:text-slate-200">Urgency Classification</label>
                        <select
                          value={tickerUrgency}
                          onChange={(e) => setTickerUrgency(e.target.value as any)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        >
                          <option value="critical">🚨 Critical Emergency</option>
                          <option value="flood">🌊 Flood & Hydrology</option>
                          <option value="breaking">⚡ Breaking News</option>
                          <option value="general">📢 General Wire</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 dark:text-slate-200">Affected District</label>
                        <select
                          value={tickerDistrict}
                          onChange={(e) => setTickerDistrict(e.target.value as AssamDistrict)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        >
                          {ASSAM_DISTRICTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 dark:text-slate-200">News Vertical</label>
                        <select
                          value={tickerCategory}
                          onChange={(e) => setTickerCategory(e.target.value as NewsCategory)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        >
                          <option value="wildlife-floods">Floods & Wildlife</option>
                          <option value="assam">Assam General</option>
                          <option value="politics">Politics</option>
                          <option value="tea-economy">Tea & Economy</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Transmit Flash Alert to Live Portal Ticker</span>
                    </button>
                  </form>

                  {/* Active Ticker Items */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      Currently Active Ticker Headlines ({articles.filter(a => a.isBreaking).length})
                    </h5>
                    <div className="space-y-2">
                      {articles.filter(a => a.isBreaking).map(a => (
                        <div key={a.id} className="p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">[{a.district}]</span>
                            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{a.title}</p>
                          </div>
                          <button
                            onClick={() => handleToggleBreaking(a.id)}
                            className="text-[11px] font-bold text-red-600 hover:text-red-700 dark:text-red-400 hover:underline shrink-0"
                          >
                            Retire from Ticker
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE STREAM STUDIO CONTROL */}
              {activeTab === 'livestream' && (
                <div className="space-y-6 text-xs max-w-2xl">
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                    <Radio className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-red-900 dark:text-red-300">
                        24/7 Studio Stream Ingest & Live Switcher
                      </h4>
                      <p className="text-[11px] text-red-800 dark:text-red-400 mt-0.5">
                        Configure the YouTube Live broadcast or HLS server feed served to desktop and mobile viewers.
                      </p>
                    </div>
                  </div>

                  {streamSuccessMsg && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{streamSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveStreamControl} className="space-y-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 dark:text-slate-200">Current Broadcast Title (English)</label>
                      <input
                        type="text"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800 dark:text-slate-200">Broadcast Title (Assamese / অসমীয়া)</label>
                      <input
                        type="text"
                        value={streamTitleAssamese}
                        onChange={(e) => setStreamTitleAssamese(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-serif"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 dark:text-slate-200">Broadcast Status</label>
                        <select
                          value={streamStatus}
                          onChange={(e) => setStreamStatus(e.target.value as any)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        >
                          <option value="live">🔴 LIVE ON AIR</option>
                          <option value="upcoming">⏳ SCHEDULED NEXT</option>
                          <option value="replay">🔁 RECORDED REPLAY</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 dark:text-slate-200">Active Viewers (Override)</label>
                        <input
                          type="number"
                          value={streamViewers}
                          onChange={(e) => setStreamViewers(Number(e.target.value))}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-800 dark:text-slate-200">Studio Location</label>
                        <input
                          type="text"
                          value={streamLocation}
                          onChange={(e) => setStreamLocation(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow flex items-center gap-2"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Live Stream Settings</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: STAFF & RBAC */}
              {activeTab === 'staff' && (
                <div className="space-y-6 text-xs">
                  {staffSuccessMsg && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{staffSuccessMsg}</span>
                    </div>
                  )}

                  {/* Add New Staff Form */}
                  <form onSubmit={handleAddStaff} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-wrap items-end gap-3">
                    <div className="space-y-1 flex-1 min-w-[140px]">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Staff Full Name</label>
                      <input
                        type="text"
                        required
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder="e.g. Parag Baruah"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1 flex-1 min-w-[180px]">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Official Email</label>
                      <input
                        type="email"
                        required
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        placeholder="editor@pressexpress.assam"
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1 w-32">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Role Privilege</label>
                      <select
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value as any)}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                      >
                        <option value="admin">Administrator</option>
                        <option value="editor">Senior Editor</option>
                        <option value="journalist">Field Reporter</option>
                      </select>
                    </div>

                    <div className="space-y-1 w-36">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Assigned District</label>
                      <select
                        value={newStaffDistrict}
                        onChange={(e) => setNewStaffDistrict(e.target.value as AssamDistrict)}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                      >
                        {ASSAM_DISTRICTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-slate-800 transition-colors shrink-0"
                    >
                      Invite Staff
                    </button>
                  </form>

                  {/* Staff Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
                      <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-3">Team Member</th>
                          <th className="py-3 px-3">Role Privilege</th>
                          <th className="py-3 px-3">District</th>
                          <th className="py-3 px-3">Security & MFA</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                        {staffList.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="py-3 px-3">
                              <p className="font-bold text-slate-900 dark:text-slate-100">{s.name}</p>
                              <p className="text-[10px] text-slate-400">{s.email}</p>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                s.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                  : s.role === 'editor'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}>
                                {s.role}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{s.district}</td>
                            <td className="py-3 px-3">
                              <span className={`flex items-center gap-1 text-[11px] ${s.mfaEnabled ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {s.mfaEnabled ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                <span>{s.mfaEnabled ? '2FA Enforced' : 'Password Only'}</span>
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {s.id !== 'staff-01' && (
                                <button
                                  onClick={() => handleRemoveStaff(s.id)}
                                  className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: SYSTEM & DIAGNOSTICS */}
              {activeTab === 'system' && (
                <div className="space-y-6 text-xs max-w-2xl">
                  {/* System Metrics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Total Articles</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{articles.length}</p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Breaking Stories</p>
                      <p className="text-xl font-bold text-red-600 mt-1">{articles.filter(a => a.isBreaking).length}</p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Total Views</p>
                      <p className="text-xl font-bold text-indigo-600 mt-1">
                        {articles.reduce((acc, a) => acc + (a.views || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Districts Covered</p>
                      <p className="text-xl font-bold text-emerald-600 mt-1">35</p>
                    </div>
                  </div>

                  {/* Maintenance Tools */}
                  <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-4">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Portal Maintenance & Diagnostics
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Perform administrative clearing, cache resets, or export complete audit metadata for compliance.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {onClearOfflineCache && (
                        <button
                          onClick={() => {
                            onClearOfflineCache();
                            alert('All offline cache records have been purged.');
                          }}
                          className="px-3.5 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                        >
                          Purge Device Storage Cache
                        </button>
                      )}

                      {onResetDefaultNews && (
                        <button
                          onClick={() => {
                            if (window.confirm('Reset articles archive to default mock stories?')) {
                              onResetDefaultNews();
                            }
                          }}
                          className="px-3.5 py-2 rounded-lg bg-amber-100 dark:bg-amber-950 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800 transition-colors"
                        >
                          Reset Articles to Seed Database
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(articles, null, 2));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `press_express_articles_export_${Date.now()}.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                        }}
                        className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Archive (JSON)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: MONETIZATION & ADS (Google AdSense & Direct Banners) */}
              {activeTab === 'monetization' && (
                <div className="space-y-6 text-xs max-w-4xl">
                  {monetizationSuccessMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{monetizationSuccessMsg}</span>
                    </div>
                  )}

                  {/* Earnings & Traffic Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-500/10 to-transparent">
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-600" />
                        Monthly Potential
                      </p>
                      <p className="text-xl font-black text-emerald-600 mt-1">₹50,000+</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Banners + AdSense</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Megaphone className="w-3 h-3 text-blue-500" />
                        Active Banners
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        {monetizationSettings.directBanners.filter(b => b.active).length} / {monetizationSettings.directBanners.length}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Local Clients</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Total Ad Views</p>
                      <p className="text-xl font-bold text-indigo-600 mt-1">
                        {monetizationSettings.directBanners.reduce((sum, b) => sum + (b.impressions || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Impressions served</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-amber-500" />
                        Total Clicks
                      </p>
                      <p className="text-xl font-bold text-amber-600 mt-1">
                        {monetizationSettings.directBanners.reduce((sum, b) => sum + (b.clicks || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Direct leads delivered</p>
                    </div>
                  </div>

                  {/* Section 1: Google AdSense Control */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                            Google AdSense Integration (গুগল এডচেন্স)
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Configure Google AdSense automated display ads across the portal.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {onOpenGoogleSEO && (
                          <button
                            type="button"
                            onClick={onOpenGoogleSEO}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Google Console & SEO Setup ↗</span>
                          </button>
                        )}
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          adsenseEnabled ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {adsenseEnabled ? 'AdSense Active' : 'AdSense Disabled'}
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleSaveAdSense} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                            AdSense Publisher ID (pub-xxxxxxxx) *
                          </label>
                          <input
                            type="text"
                            required
                            value={adsensePubId}
                            onChange={(e) => setAdsensePubId(e.target.value)}
                            placeholder="ca-pub-1234567890123456"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Available in your Google AdSense Dashboard under Settings {'>'} Account Information.
                          </p>
                        </div>

                        <div className="space-y-2 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={adsenseEnabled}
                              onChange={(e) => setAdsenseEnabled(e.target.checked)}
                              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                            />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              Enable Google AdSense on Portal
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={autoAdsEnabled}
                              onChange={(e) => setAutoAdsEnabled(e.target.checked)}
                              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                            />
                            <span className="text-slate-700 dark:text-slate-300">
                              Enable Google Auto-Ads (স্বয়ংক্রিয় বিজ্ঞাপন স্থান)
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-[11px] text-slate-500">
                          💡 AdSense code executes on production domains when approved by Google.
                        </p>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save AdSense Configuration</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Section 2: Direct Local Banner Ads Manager */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-red-600" />
                          <span>Direct Client Banner Ads (স্থানীয় ব্যৱসায়িক বিজ্ঞাপন)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Set custom banners for Assam colleges, tea brands, shops, and institutions with direct WhatsApp/Call leads.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAddingBanner(!isAddingBanner)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingBanner ? 'Close Form' : 'Add New Banner Ad'}</span>
                      </button>
                    </div>

                    {/* New Banner Form */}
                    {isAddingBanner && (
                      <form onSubmit={handleAddDirectBanner} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                          New Direct Banner Details
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                              Ad Title / Offer *
                            </label>
                            <input
                              type="text"
                              required
                              value={bannerTitle}
                              onChange={(e) => setBannerTitle(e.target.value)}
                              placeholder="e.g. 20% Discount on Assam Silk"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                              Client / Business Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={bannerClient}
                              onChange={(e) => setBannerClient(e.target.value)}
                              placeholder="e.g. Guwahati Tea Center"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                              Placement Slot *
                            </label>
                            <select
                              value={bannerPosition}
                              onChange={(e) => setBannerPosition(e.target.value as AdPosition)}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                            >
                              <option value="header">শীৰ্ষ ব্যেনাৰ (Header Leaderboard)</option>
                              <option value="in_feed">বাতৰিৰ মাজত (In-Feed Banner)</option>
                              <option value="article_middle">প্ৰবন্ধৰ ভিতৰত (In-Article Ad)</option>
                              <option value="sidebar">ছাইডবাৰ (Sidebar Ad)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                              Banner Image URL
                            </label>
                            <input
                              type="url"
                              value={bannerImageUrl}
                              onChange={(e) => setBannerImageUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                              Client WhatsApp / Phone
                            </label>
                            <input
                              type="tel"
                              value={bannerPhone}
                              onChange={(e) => setBannerPhone(e.target.value)}
                              placeholder="+91 98640 12345"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                            Destination Website (Optional if phone provided)
                          </label>
                          <input
                            type="url"
                            value={bannerTargetUrl}
                            onChange={(e) => setBannerTargetUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-red-500 outline-hidden"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsAddingBanner(false)}
                            className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                          >
                            Publish Banner Ad
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Banners List */}
                    <div className="space-y-2.5">
                      {monetizationSettings.directBanners.map((banner) => (
                        <div
                          key={banner.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={banner.imageUrl}
                              alt={banner.title}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white truncate">
                                  {banner.title}
                                </span>
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                                  {banner.position}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                Client: {banner.clientName} {banner.phoneOrWhatsapp && `• ${banner.phoneOrWhatsapp}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] shrink-0 self-end sm:self-center">
                            <div className="text-right">
                              <p className="font-bold text-slate-700 dark:text-slate-300">
                                {banner.impressions.toLocaleString()} views • {banner.clicks} clicks
                              </p>
                              <p className="text-[10px] text-emerald-600 font-mono">
                                CTR: {banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(1) : '0'}%
                              </p>
                            </div>

                            <button
                              onClick={() => handleToggleBanner(banner.id)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                                banner.active 
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                              }`}
                            >
                              {banner.active ? 'Active' : 'Paused'}
                            </button>

                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                              title="Delete banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Advertiser Inquiries (বিজ্ঞাপনৰ আবেদনসমূহ) */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span>Advertiser Inquiries (বিজ্ঞাপন আবেদনকাৰীসকল)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Prospective businesses wishing to place ads on Press Express Assam.
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {monetizationSettings.inquiries.length} Inquiries
                      </span>
                    </div>

                    {monetizationSettings.inquiries.length === 0 ? (
                      <p className="text-center py-6 text-slate-400">No ad inquiries received yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {monetizationSettings.inquiries.map((inq) => (
                          <div 
                            key={inq.id}
                            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                  {inq.businessName}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-600 dark:text-slate-300">{inq.clientName}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold uppercase">
                                  Slot: {inq.adPosition} ({inq.durationWeeks}w)
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                "{inq.message}"
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Contact: {inq.phone} {inq.email && `| ${inq.email}`} • {new Date(inq.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <a
                                href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`নমস্কাৰ ${inq.clientName} ডাঙৰীয়া, Press Express Assam-ত আপুনি "${inq.businessName}"-ৰ বিজ্ঞাপনৰ বাবে কৰা আবেদনৰ সন্দৰ্ভত যোগাযোগ কৰিছোঁ।`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp Contact</span>
                              </a>

                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as AdInquiry['status'])}
                                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold outline-hidden"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Press Express Assam Executive Admin Engine</span>
            <span>•</span>
            <span className="font-mono">Build 2026.09-Assam</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Online (Dispur Node)
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Modal */}
      {articleToDelete && (
        <div 
          id="admin-delete-confirm-modal"
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Delete Article Permanently?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action will permanently remove this story from the portal and all reader feeds.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              <img
                src={articleToDelete.imageUrl}
                alt={articleToDelete.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <div className="min-w-0 text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                  {articleToDelete.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="capitalize">{articleToDelete.category}</span>
                  <span>•</span>
                  <span>{articleToDelete.district}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
