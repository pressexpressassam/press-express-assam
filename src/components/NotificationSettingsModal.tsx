import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  Volume2, 
  AlertTriangle, 
  ShieldAlert, 
  Coffee, 
  Building2, 
  Trophy, 
  Check, 
  Sparkles, 
  Radio,
  Clock,
  Trash2
} from 'lucide-react';
import { NotificationSettings, AppNotification } from '../types';
import { pushNotificationService } from '../services/pushNotificationService';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onSaveSettings: (settings: NotificationSettings) => void;
  notificationsList: AppNotification[];
  onClearNotifications: () => void;
  onSelectArticleFromNotif?: (articleId: string) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  notificationsList,
  onClearNotifications,
  onSelectArticleFromNotif,
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>({ ...settings });
  const [permissionState, setPermissionState] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testSent, setTestSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'inbox'>('settings');

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await pushNotificationService.requestBrowserPermission();
    setPermissionState(granted ? 'granted' : 'denied');
    setLocalSettings(prev => ({
      ...prev,
      browserPermissionGranted: granted,
      pushEnabled: granted ? true : prev.pushEnabled
    }));
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const handleSendTestNotification = () => {
    pushNotificationService.dispatchNotification(
      '🚨 BRAHMAPUTRA FLASH ALERT: Telemetry Gauge Update',
      'Hydrological sensor at Uzanbazar indicates rising discharge; early warning teams activated.',
      'wildlife-floods',
      { ...localSettings, pushEnabled: true, floodWeatherAlerts: true },
      'art-001',
      true
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-600 dark:text-red-400 flex items-center justify-center border border-red-500/30">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Push Notifications & Alert Dashboard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure real-time breaking alerts and category-specific triggers
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

        {/* Tab switch: Settings vs Inbox */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950 text-xs font-bold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notification Rules & Channels
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'inbox'
                ? 'border-b-2 border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Alert Inbox ({notificationsList.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {activeTab === 'settings' ? (
            <>
              {/* Browser Permission Banner */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${permissionState === 'granted' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <p className="font-bold text-xs">
                      Browser Web Push: {permissionState.toUpperCase()}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {permissionState === 'granted' 
                      ? 'You will receive native desktop/mobile alerts even when backgrounded.' 
                      : 'Grant browser permission to receive immediate breaking alerts on desktop & mobile.'}
                  </p>
                </div>

                {permissionState !== 'granted' && (
                  <button
                    onClick={handleRequestPermission}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 shadow-xs"
                  >
                    Enable Push
                  </button>
                )}
              </div>

              {/* Master Push Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50">
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">Master Notifications Switch</p>
                  <p className="text-[11px] text-slate-500">Allow Press Express Assam to send alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.pushEnabled}
                  onChange={() => handleToggle('pushEnabled')}
                  className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                />
              </div>

              {/* Category-Specific Alert Triggers */}
              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Category-Triggered Push Alerts
                </label>

                {/* Breaking */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <p className="font-bold">Breaking Stories & Urgent Flashes</p>
                      <p className="text-[10px] text-slate-500">Immediate bulletins across Assam</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.breakingNewsAlerts}
                    onChange={() => handleToggle('breakingNewsAlerts')}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>

                {/* Flood & Weather */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Brahmaputra Flood & Disaster Warnings</p>
                      <p className="text-[10px] text-slate-500">NESAC, CWC & ASDMA hydrological sensor bulletins</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.floodWeatherAlerts}
                    onChange={() => handleToggle('floodWeatherAlerts')}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>

                {/* Tea & Economy */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <p className="font-bold">Tea Industry & Business Wire</p>
                      <p className="text-[10px] text-slate-500">Guwahati Tea Auction & Industrial milestones</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.teaEconomyAlerts}
                    onChange={() => handleToggle('teaEconomyAlerts')}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>

                {/* Guwahati Local */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-bold">Guwahati Metro & Urban Transit</p>
                      <p className="text-[10px] text-slate-500">Traffic, metro developments, civic notices</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.guwahatiLocalAlerts}
                    onChange={() => handleToggle('guwahatiLocalAlerts')}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>

                {/* Sports */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="font-bold">Sports & North East United FC</p>
                      <p className="text-[10px] text-slate-500">Live match scores and tournament coverage</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.sportsAlerts}
                    onChange={() => handleToggle('sportsAlerts')}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>
              </div>

              {/* Sound & Delivery frequency */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="font-bold">Subtle Audio Chime</p>
                      <p className="text-[10px] text-slate-500">Play harmonic chime for breaking notifications</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.soundEnabled}
                    onChange={() => handleToggle('soundEnabled')}
                    className="w-4 h-4 accent-red-600 rounded"
                  />
                </div>

                <div>
                  <p className="font-bold mb-1">Alert Delivery Frequency</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['immediate', 'hourly-digest', 'daily'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setLocalSettings({ ...localSettings, frequency: freq })}
                        className={`py-1.5 px-2 rounded-lg text-center font-semibold capitalize border ${
                          localSettings.frequency === freq
                            ? 'bg-red-600 text-white border-red-600'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {freq.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Alert Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/60"
                >
                  <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                  <span>{testSent ? '⚡ Test Alert Dispatched!' : 'Send Test Breaking Alert'}</span>
                </button>
              </div>
            </>
          ) : (
            /* Inbox list */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Recent Push Notifications Received
                </span>
                {notificationsList.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>

              {notificationsList.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold">No recent notifications</p>
                  <p className="text-[11px] mt-0.5">Urgent bulletins from Assam will be listed here.</p>
                </div>
              ) : (
                notificationsList.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      if (n.articleId && onSelectArticleFromNotif) {
                        onSelectArticleFromNotif(n.articleId);
                        onClose();
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      n.isBreaking 
                        ? 'border-red-500/40 bg-red-500/5' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[10px] uppercase bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        {n.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
