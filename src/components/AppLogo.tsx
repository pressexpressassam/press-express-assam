import React, { useState } from 'react';
import logoImg from '../assets/images/press_express_logo_1788418321439.jpg';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Size mappings for circular badge
  const sizeClasses = {
    xs: 'w-7 h-7 min-w-[28px]',
    sm: 'w-8 h-8 min-w-[32px]',
    md: 'w-9 h-9 sm:w-11 sm:h-11 min-w-[36px] sm:min-w-[44px]',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 min-w-[48px] sm:min-w-[56px]',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 min-w-[64px] sm:min-w-[80px]',
  };

  const textClasses = {
    xs: {
      title: 'text-xs sm:text-sm font-extrabold',
      subtitle: 'text-[8px] sm:text-[9px]',
      tagline: 'text-[7px]',
    },
    sm: {
      title: 'text-sm sm:text-base font-extrabold',
      subtitle: 'text-[9px] sm:text-[10px]',
      tagline: 'text-[8px]',
    },
    md: {
      title: 'text-sm sm:text-lg md:text-xl font-black tracking-normal',
      subtitle: 'text-[9px] sm:text-[11px]',
      tagline: 'text-[8px] sm:text-[9px]',
    },
    lg: {
      title: 'text-xl sm:text-2xl font-black',
      subtitle: 'text-xs sm:text-sm',
      tagline: 'text-[10px] sm:text-[11px]',
    },
    xl: {
      title: 'text-2xl sm:text-3xl font-black',
      subtitle: 'text-sm sm:text-base',
      tagline: 'text-xs',
    },
  };

  const selectedText = textClasses[size];

  return (
    <div 
      id="app-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Emblem Container with circular border and exact fit */}
      <div className={`relative rounded-full overflow-hidden shadow-sm ring-2 ring-red-600 dark:ring-red-500 bg-white dark:bg-slate-900 transition-transform duration-200 group-hover:scale-105 shrink-0 flex items-center justify-center aspect-square p-0.5 ${sizeClasses[size]}`}>
        {!imgError ? (
          <img
            src={logoImg || '/press_express_logo.jpg'}
            alt="Press Express Assam - Fast Fair Fearless"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-full"
          />
        ) : (
          /* High-fidelity SVG recreation if image fallback is needed */
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#dc2626" strokeWidth="3" />
            <circle cx="50" cy="50" r="44" fill="none" stroke="#0f172a" strokeWidth="1.5" />
            {/* Stylized P with speed lines */}
            <path d="M22 35 h14 M20 40 h18 M18 45 h16 M24 50 h12" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M34 26 h14 c8 0 12 5 12 12 s-4 12 -12 12 h-14 z" fill="#dc2626" />
            <path d="M30 26 h10 v48 h-10 z" fill="#0f172a" />
            {/* Red banner */}
            <rect x="18" y="66" width="64" height="12" rx="2" fill="#dc2626" />
            <text x="50" y="75" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">EXPRESS</text>
            <text x="50" y="63" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="900" fontFamily="sans-serif">PRESS</text>
            <text x="50" y="87" textAnchor="middle" fill="#0f172a" fontSize="5.5" fontWeight="bold" fontFamily="sans-serif">— ASSAM —</text>
          </svg>
        )}
      </div>

      {/* Typography block */}
      {showText && (
        <div className="flex flex-col justify-center text-left">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`tracking-tight uppercase font-newspaper leading-none text-slate-950 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors ${selectedText.title}`}>
              Press Express
            </span>
            <span className={`tracking-tight uppercase font-newspaper leading-none text-red-600 dark:text-red-400 ${selectedText.title}`}>
              Assam
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 flex-wrap">
            <span className={`font-serif text-slate-600 dark:text-slate-400 font-semibold tracking-normal ${selectedText.subtitle}`}>
              প্ৰেছ এক্সপ্ৰেছ অসম
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className={`hidden sm:inline font-bold tracking-widest text-red-600 dark:text-red-400 uppercase ${selectedText.tagline}`}>
              FAST • FAIR • FEARLESS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
