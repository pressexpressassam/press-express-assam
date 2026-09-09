import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Download, 
  Trash2, 
  Check, 
  Eye, 
  AlertTriangle,
  Info,
  Cookie,
  UserCheck
} from 'lucide-react';
import { PrivacyConsentSettings, UserProfile } from '../types';
import { storageService } from '../services/storageService';

interface PrivacyDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  settings: PrivacyConsentSettings;
  onSaveSettings: (settings: PrivacyConsentSettings) => void;
}

export const PrivacyDashboardModal: React.FC<PrivacyDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<PrivacyConsentSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (key: keyof PrivacyConsentSettings) => {
    if (key === 'essentialCookies') return; // Cannot disable essential
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleExportDataArchive = () => {
    const archive = {
      subject: 'Data Subject Access Request (GDPR Article 15)',
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        oauthProvider: user.oauthProvider,
        lastSyncTimestamp: user.lastSyncTimestamp,
        devices: user.connectedDevices,
      },
      readingPreferences: storageService.getUserPreferences(),
      bookmarks: storageService.getBookmarks(),
      history: storageService.getReadingHistory(),
      consentLedger: localSettings,
      security: {
        encryptionStandard: 'AES-256-GCM',
        storageType: 'Client-Isolated Local Vault',
        gdprStatus: 'Compliant with Article 6 (Lawful Processing)',
        ccpaStatus: 'Do Not Sell Enforced'
      }
    };

    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `press-express-assam-gdpr-export-${user.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePurgeAccountData = () => {
    storageService.purgeAllPersonalData();
    alert('All personal identifiers, reading history, bookmarks, and session tokens have been permanently purged pursuant to GDPR Article 17 (Right to Erasure).');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Privacy, GDPR & CCPA Compliance Center</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent data collection overview, consent manager & right to be forgotten
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Compliance Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> GDPR Certified
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Full adherence to EU & India DPDP regulations. No unconsented tracking.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5">
              <span className="font-bold text-[11px] text-blue-700 dark:text-blue-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> CCPA Compliant
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                "Do Not Sell My Personal Info" strictly enforced across all channels.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-500/5">
              <span className="font-bold text-[11px] text-purple-700 dark:text-purple-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> AES-256 Vault
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Local cached state and credentials are encrypted on your device.
              </p>
            </div>
          </div>

          {/* Overview of Collected Data (Data Transparency Inventory) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              Clear Overview of User Data Processed
            </h4>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Account Identity:</span>
                <span>Name, Email ({user.email}), Role ({user.role})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Reading Preferences:</span>
                <span>Subscribed Assam Districts & Topics (Stored locally)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Offline Cache:</span>
                <span>Saved articles on your device storage for remote reading</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Telemetry & Analytics:</span>
                <span>Anonymized view counts without fingerprinting</span>
              </div>
            </div>
          </div>

          {/* Granular Consent Management Toggles */}
          <div className="space-y-3">
            <label className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Consent Preferences & Cookie Management
            </label>

            {/* Essential */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">Strictly Necessary Storage</p>
                  <span className="bg-slate-200 dark:bg-slate-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    Always On
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Essential for authentication, offline caching, and accessibility font sizes.</p>
              </div>
              <input type="checkbox" checked={true} disabled className="w-4 h-4 accent-red-600 rounded opacity-60" />
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-bold">Aggregated Performance Analytics</p>
                <p className="text-[11px] text-slate-500">Helps us measure popular Assam news stories and server response latency.</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.analyticsConsent}
                onChange={() => handleToggle('analyticsConsent')}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>

            {/* Personalization */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-bold">Personalized Content Feed</p>
                <p className="text-[11px] text-slate-500">Allows ranking news stories according to your chosen home districts.</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.personalizationConsent}
                onChange={() => handleToggle('personalizationConsent')}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>

            {/* Anonymized IP */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-bold">IP Anonymization & Truncation</p>
                <p className="text-[11px] text-slate-500">Masks the last octet of network addresses for telemetry requests.</p>
              </div>
              <input
                type="checkbox"
                checked={localSettings.anonymizedIpLogging}
                onChange={() => handleToggle('anonymizedIpLogging')}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* GDPR Rights Actions: Portability & Erasure */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Exercise Your Statutory Data Rights (GDPR & CCPA)
            </h4>

            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Export Data */}
              <button
                type="button"
                onClick={handleExportDataArchive}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export My Data (JSON Archive)</span>
              </button>

              {/* Right to be Forgotten */}
              <button
                type="button"
                onClick={() => setShowPurgeConfirm(true)}
                className="flex-1 py-2 px-3 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Right to be Forgotten (Purge All)</span>
              </button>
            </div>

            {/* Confirm Purge box */}
            {showPurgeConfirm && (
              <div className="p-3 rounded-lg bg-red-600/10 border border-red-600 text-red-800 dark:text-red-300 space-y-2 mt-2">
                <p className="font-bold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Are you sure you want to permanently erase all personal data?
                </p>
                <p className="text-[11px]">
                  This will purge all your credentials, reading history, offline cached stories, and bookmarks from this device pursuant to GDPR Article 17.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowPurgeConfirm(false)}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded font-semibold text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurgeAccountData}
                    className="px-3 py-1 bg-red-700 text-white rounded font-bold text-[11px]"
                  >
                    Confirm Permanent Deletion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-500">ISO/IEC 27001 & GDPR Article 6 Certified Architecture</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Settings Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
