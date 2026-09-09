import React, { useState } from 'react';
import { X, Sparkles, MapPin, Tag, Check, Sliders, Info, RotateCcw } from 'lucide-react';
import { UserPreferences, NewsCategory, AssamDistrict } from '../types';
import { ASSAM_DISTRICTS, CATEGORY_LABELS } from '../data/mockNews';

interface PersonalizedFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (prefs: UserPreferences) => void;
}

export const PersonalizedFeedModal: React.FC<PersonalizedFeedModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>({ ...preferences });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleDistrict = (district: string) => {
    const current = new Set(localPrefs.selectedDistricts);
    if (district === 'All Assam') {
      setLocalPrefs({ ...localPrefs, selectedDistricts: ['All Assam'] as AssamDistrict[] });
      return;
    }
    current.delete('All Assam' as AssamDistrict);
    if (current.has(district as AssamDistrict)) {
      current.delete(district as AssamDistrict);
    } else {
      current.add(district as AssamDistrict);
    }
    setLocalPrefs({
      ...localPrefs,
      selectedDistricts: Array.from(current) as AssamDistrict[]
    });
  };

  const toggleCategory = (cat: NewsCategory) => {
    const current = new Set(localPrefs.favoriteCategories);
    if (current.has(cat)) {
      if (current.size > 1) {
        current.delete(cat);
      }
    } else {
      current.add(cat);
    }
    setLocalPrefs({
      ...localPrefs,
      favoriteCategories: Array.from(current)
    });
  };

  const handleSave = () => {
    onSavePreferences(localPrefs);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const availableCategories: NewsCategory[] = [
    'wildlife-floods',
    'tea-economy',
    'guwahati',
    'politics',
    'culture',
    'sports',
    'opinion'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-newspaper">Personalized Feed & Reading Preferences</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize your Assam news algorithm based on your home districts & interests
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Section: Districts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-xs uppercase tracking-wider flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Select Your Priority Districts (অসমৰ জিলাসমূহ)
              </label>
              <span className="text-[11px] text-slate-500">
                {localPrefs.selectedDistricts.length} selected
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Stories from selected districts will appear prominently on your homepage feed and regional alert broadcasts.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ASSAM_DISTRICTS.map((district) => {
                const isSelected = localPrefs.selectedDistricts.includes(district as AssamDistrict);
                return (
                  <button
                    key={district}
                    onClick={() => toggleDistrict(district)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 shadow-sm font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{district}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Topics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-xs uppercase tracking-wider flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                Preferred Topics & Categories
              </label>
              <span className="text-[11px] text-slate-500">
                {localPrefs.favoriteCategories.length} selected
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableCategories.map((cat) => {
                const isSelected = localPrefs.favoriteCategories.includes(cat);
                const label = CATEGORY_LABELS[cat];
                return (
                  <div
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-red-600 bg-red-500/10 text-slate-950 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{label.en}</p>
                      <p className="text-[11px] font-serif text-red-600 dark:text-red-400">{label.as}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected ? 'bg-red-600 border-red-600 text-white' : 'border-slate-400 dark:border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Offline & Low Data */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Remote Area Accessibility & Caching Options
            </h4>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs">Auto-cache visited stories</p>
                <p className="text-[11px] text-slate-500">Automatically store opened articles for reading without network</p>
              </div>
              <input
                type="checkbox"
                checked={localPrefs.offlineAutoDownload}
                onChange={(e) => setLocalPrefs({ ...localPrefs, offlineAutoDownload: e.target.checked })}
                className="w-4 h-4 accent-red-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs">Low-Data Saver Mode</p>
                <p className="text-[11px] text-slate-500">Compress image previews and prioritize text payloads for 2G/3G networks</p>
              </div>
              <input
                type="checkbox"
                checked={localPrefs.lowDataMode}
                onChange={(e) => setLocalPrefs({ ...localPrefs, lowDataMode: e.target.checked })}
                className="w-4 h-4 accent-red-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => setLocalPrefs({
              ...localPrefs,
              selectedDistricts: ['Kamrup Metropolitan', 'Dibrugarh', 'Jorhat'],
              favoriteCategories: ['wildlife-floods', 'tea-economy', 'guwahati'],
            })}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Defaults
          </button>

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
              <span>{savedSuccess ? 'Preferences Saved!' : 'Apply Preferences'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
