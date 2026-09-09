import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  User, 
  Check, 
  Smartphone, 
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
}) => {
  const [step, setStep] = useState<'profile' | 'mfa_verify'>('profile');
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [mfaError, setMfaError] = useState('');
  const [mfaSuccessMessage, setMfaSuccessMessage] = useState('');
  const [targetRole, setTargetRole] = useState<UserRole>(user.role);

  if (!isOpen) return null;

  const handleMfaVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      setMfaError('Please enter a valid 6-digit TOTP or SMS verification code.');
      return;
    }
    setMfaError('');
    setMfaSuccessMessage('MFA verification successful! Role permissions updated.');
    setTimeout(() => {
      onUpdateUser({
        ...user,
        role: targetRole,
        mfaEnabled: true,
        lastSyncTimestamp: new Date().toISOString()
      });
      setMfaSuccessMessage('');
      setStep('profile');
    }, 1000);
  };

  const handleRoleSelect = (newRole: UserRole) => {
    if (newRole === user.role) return;
    setTargetRole(newRole);
    if (user.mfaEnabled) {
      setTotpCode('');
      setMfaError('');
      setStep('mfa_verify');
    } else {
      onUpdateUser({ ...user, role: newRole });
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'apple' | 'assam_egov') => {
    // Simulated OAuth 2.0 flow
    onUpdateUser({
      ...user,
      oauthProvider: provider,
      isLoggedIn: true,
      lastSyncTimestamp: new Date().toISOString()
    });
  };

  const roleDescriptions: Record<UserRole, { title: string; desc: string; badge: string }> = {
    reader: {
      title: 'Subscriber / Reader',
      desc: 'Full access to articles, live streams, offline caching, and personalized feeds.',
      badge: 'Standard Access'
    },
    journalist: {
      title: 'Field Journalist / Reporter',
      desc: 'Submit field reports, upload photos, report live breaking updates from districts.',
      badge: 'Authoring Rights'
    },
    editor: {
      title: 'Editorial Desk',
      desc: 'Review submitted reports, broadcast breaking push alerts, edit newsroom wire.',
      badge: 'Publishing Rights'
    },
    admin: {
      title: 'System Administrator',
      desc: 'Full governance, administrative oversight, RBAC enforcement, analytics & GDPR audit.',
      badge: 'Full Oversight'
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Identity, Security & Role Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                OAuth 2.0, Multi-Factor Authentication (MFA) & Role Privileges
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
          {step === 'profile' ? (
            <>
              {/* User Overview Profile Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-red-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{user.name}</h4>
                      <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      OAuth 2.0 Authenticated • AES-256 Encrypted Session
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* MFA Security Status */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-xs">Multi-Factor Authentication (MFA)</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.mfaEnabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/30' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {user.mfaEnabled ? 'MFA ACTIVE (TOTP / SMS)' : 'MFA DISABLED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Protects administrative and journalist publishing channels. Changing privileged roles requires entering a secondary 6-digit TOTP verification token.
                </p>
              </div>

              {/* Role-Based Access Control (RBAC) Switcher */}
              <div>
                <label className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Role-Based Access Control (RBAC) Oversight
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Select a role below to simulate and experience the platform under different operational privileges:
                </p>

                <div className="space-y-2">
                  {(['reader', 'journalist', 'editor', 'admin'] as const).map((r) => {
                    const isCurrent = user.role === r;
                    const meta = roleDescriptions[r];
                    return (
                      <div
                        key={r}
                        onClick={() => handleRoleSelect(r)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'border-purple-600 bg-purple-500/10 dark:bg-purple-900/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold uppercase text-xs ${
                            isCurrent ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-700/50'
                          }`}>
                            {r.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs">{meta.title}</span>
                              <span className="text-[10px] text-slate-400">({meta.badge})</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {meta.desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isCurrent ? (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                              <Check className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                              Switch
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OAuth 2.0 Providers */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-2">
                  Connected Single Sign-On (OAuth 2.0)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleOAuthLogin('google')}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-center font-medium transition-colors"
                  >
                    Google OAuth
                  </button>
                  <button
                    onClick={() => handleOAuthLogin('apple')}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-center font-medium transition-colors"
                  >
                    Apple ID
                  </button>
                  <button
                    onClick={() => handleOAuthLogin('assam_egov')}
                    className="p-2 rounded-lg border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-center font-medium transition-colors"
                  >
                    Assam e-Praman
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* MFA Verification Step */
            <form onSubmit={handleMfaVerify} className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto border border-purple-500/30">
                  <Smartphone className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-base font-bold font-newspaper">Two-Factor Authentication (MFA)</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You are switching privileges to <strong>{targetRole.toUpperCase()}</strong>. Enter the 6-digit TOTP code from your authenticator app (e.g. 123456).
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center text-2xl tracking-widest font-mono py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:ring-2 focus:ring-purple-600 outline-none"
                  autoFocus
                />
                <p className="text-[10px] text-center text-slate-400">
                  Tip for demo: Enter any 6-digit code like <strong>778899</strong>
                </p>
              </div>

              {mfaError && (
                <p className="text-xs text-center text-red-600 font-medium">
                  {mfaError}
                </p>
              )}

              {mfaSuccessMessage && (
                <p className="text-xs text-center text-emerald-600 font-medium flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {mfaSuccessMessage}
                </p>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('profile')}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold shadow"
                >
                  Verify & Switch Role
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>GDPR Compliant • OAuth 2.0 Secure Handshake</span>
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
