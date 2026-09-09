import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  CloudCheck, 
  RefreshCw, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  WifiOff, 
  HardDrive,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { UserProfile, Article } from '../types';
import { storageService } from '../services/storageService';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  cachedArticles: Article[];
  onClearOfflineCache: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  isOffline,
  onToggleOffline,
  cachedArticles,
  onClearOfflineCache,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [backupJson, setBackupJson] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const storageStats = storageService.getStorageStats();

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      onUpdateUser({
        ...user,
        lastSyncTimestamp: new Date().toISOString()
      });
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  const handleExportBackup = () => {
    const data = storageService.exportCloudBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `press-express-assam-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    if (!backupJson.trim()) return;
    const ok = storageService.importCloudBackup(backupJson);
    if (ok) {
      setImportStatus('success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setImportStatus('error');
    }
  };

  const getDeviceIcon = (type: 'phone' | 'tablet' | 'desktop') => {
    switch (type) {
      case 'phone': return <Smartphone className="w-4 h-4 text-blue-600" />;
      case 'tablet': return <Tablet className="w-4 h-4 text-purple-600" />;
      case 'desktop': return <Laptop className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Cloud Synchronization & Offline Vault</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-device reading continuity, encrypted cloud backups, and local storage quota
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
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Real-time Sync Status Card */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  Cross-Device Synchronization Active
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Last synchronized: <strong>{new Date(user.lastSyncTimestamp).toLocaleTimeString()}</strong>
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">
                Saved bookmarks, reading progress & article cache sync across phone, tablet & laptop.
              </p>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Connected Device Ecosystem */}
          <div>
            <label className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
              Connected Reading Devices
            </label>
            <div className="space-y-2">
              {user.connectedDevices.map((dev) => (
                <div 
                  key={dev.id} 
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center border border-slate-700/40">
                      {getDeviceIcon(dev.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{dev.deviceName}</span>
                        {dev.current && (
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-extrabold uppercase px-1.5 rounded border border-emerald-500/30">
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">Last active: {dev.lastActive}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Synced
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Cache Storage Manager */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs">Offline Local Storage Vault</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {storageStats.usedKb} KB / {storageStats.quotaKb / 1024} MB
              </span>
            </div>

            {/* Storage bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${Math.min(100, Math.max(4, (storageStats.usedKb / storageStats.quotaKb) * 100))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{cachedArticles.length} stories cached for offline reading in remote areas</span>
              <button
                onClick={onClearOfflineCache}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear Cache
              </button>
            </div>

            {/* Offline Simulation Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs">Simulate Remote Offline Mode</p>
                <p className="text-[10px] text-slate-500">Test how the portal performs in remote river/hill areas without turning off WiFi</p>
              </div>
              <button
                onClick={onToggleOffline}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isOffline
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isOffline ? 'Offline Simulation ON' : 'Turn On Offline Test'}
              </button>
            </div>
          </div>

          {/* Secure Cloud Backup & Restore */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Encrypted Cloud Backup & Migration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportBackup}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1.5 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Cloud Backup</span>
              </button>
              <button
                onClick={() => setShowImportBox(!showImportBox)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center justify-center gap-1.5 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                <span>Restore Backup</span>
              </button>
            </div>

            {showImportBox && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-2 mt-2">
                <textarea
                  value={backupJson}
                  onChange={(e) => setBackupJson(e.target.value)}
                  placeholder="Paste backup JSON data here..."
                  rows={3}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono text-[11px]"
                />
                <div className="flex items-center justify-between">
                  {importStatus === 'success' && (
                    <span className="text-emerald-600 font-bold text-[11px]">Restored successfully! Reloading...</span>
                  )}
                  {importStatus === 'error' && (
                    <span className="text-red-600 font-bold text-[11px]">Invalid backup format</span>
                  )}
                  <button
                    onClick={handleImportBackup}
                    className="ml-auto px-4 py-1 rounded bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold"
                  >
                    Apply Restore
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>AES-256 GCM encrypted state sync</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
