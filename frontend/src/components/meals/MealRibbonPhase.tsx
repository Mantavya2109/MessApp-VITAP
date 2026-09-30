import React from 'react';
import type { MealType } from '../../types';

interface MealRibbonPhaseProps {
  type: MealType;
  className?: string;
}

export const MealRibbonPhase: React.FC<MealRibbonPhaseProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'breakfast':
      return (
        <svg
          viewBox="0 0 44 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '38px', height: '50px', display: 'block' }}
        >
          <defs>
            {/* 3D Ribbon Gradients */}
            <linearGradient id="bfRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="bfSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* 3D Top Fold Overhang (Wrapped over Card Edge) */}
          <path d="M 4 4 L 40 4 L 44 0 L 0 0 Z" fill="#7C2D12" />
          <path d="M 0 0 L 4 4 L 0 4 Z" fill="#431407" />
          <path d="M 44 0 L 40 4 L 44 4 Z" fill="#431407" />

          {/* Main 3D Ribbon Body with Swallowtail Cut */}
          <path
            d="M 4 4 L 40 4 L 40 48 L 22 40 L 4 48 Z"
            fill="url(#bfRibbonGrad)"
            stroke="#7C2D12"
            strokeWidth="1.2"
          />

          {/* Satin Sheen Highlight Strip */}
          <path
            d="M 9 4 L 15 4 L 15 42 L 9 44 Z"
            fill="rgba(255, 255, 255, 0.28)"
          />

          {/* Stitching / Gold Accent Border line */}
          <path
            d="M 7 5 L 7 43 L 22 37 L 37 43 L 37 5"
            stroke="#FDE047"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.75"
            fill="none"
          />

          {/* Celestial Phase: 🌅 DAWN / SUNRISE PHASE */}
          {/* Horizon Line */}
          <line x1="12" y1="26" x2="32" y2="26" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Rising Half Sun Crest */}
          <path
            d="M 14 26 A 8 8 0 0 1 30 26 Z"
            fill="url(#bfSunGrad)"
            stroke="#FDE047"
            strokeWidth="1.2"
          />

          {/* Sunrise Rays */}
          <line x1="22" y1="13" x2="22" y2="9.5" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="15" y1="17" x2="12" y2="14" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="29" y1="17" x2="32" y2="14" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />

          {/* Dawn Sparkle */}
          <path d="M 28 8 L 29 6 L 30 8 L 32 9 L 30 10 L 29 12 L 28 10 L 26 9 Z" fill="#FFFFFF" />
        </svg>
      );

    case 'lunch':
      return (
        <svg
          viewBox="0 0 44 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '38px', height: '50px', display: 'block' }}
        >
          <defs>
            {/* 3D Ribbon Gradients */}
            <linearGradient id="lunchRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <radialGradient id="lunchNoonSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FACC15" />
            </radialGradient>
          </defs>

          {/* 3D Top Fold Overhang */}
          <path d="M 4 4 L 40 4 L 44 0 L 0 0 Z" fill="#78350F" />
          <path d="M 0 0 L 4 4 L 0 4 Z" fill="#451A03" />
          <path d="M 44 0 L 40 4 L 44 4 Z" fill="#451A03" />

          {/* Main 3D Ribbon Body with Swallowtail Cut */}
          <path
            d="M 4 4 L 40 4 L 40 48 L 22 40 L 4 48 Z"
            fill="url(#lunchRibbonGrad)"
            stroke="#78350F"
            strokeWidth="1.2"
          />

          {/* Satin Sheen Highlight Strip */}
          <path
            d="M 9 4 L 15 4 L 15 42 L 9 44 Z"
            fill="rgba(255, 255, 255, 0.3)"
          />

          {/* Golden Stitching Accent */}
          <path
            d="M 7 5 L 7 43 L 22 37 L 37 43 L 37 5"
            stroke="#FEF08A"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.8"
            fill="none"
          />

          {/* Celestial Phase: ☀️ ZENITH MIDDAY HIGH SUN */}
          {/* Outer Sun Rays */}
          <line x1="22" y1="9" x2="22" y2="6.5" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="35" x2="22" y2="37.5" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="22" x2="10.5" y2="22" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
          <line x1="33.5" y1="22" x2="36" y2="22" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="12" x2="14" y2="14" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="30" y1="30" x2="32" y2="32" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="12" y1="32" x2="14" y2="30" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="30" y1="14" x2="32" y2="12" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />

          {/* Rotating Solar Corona Ring */}
          <circle cx="22" cy="22" r="10" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" opacity="0.75" />

          {/* Zenith Sun Core */}
          <circle cx="22" cy="22" r="7" fill="url(#lunchNoonSun)" stroke="#B45309" strokeWidth="1.2" />
          <circle cx="19.5" cy="19.5" r="2" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );

    case 'snacks':
      return (
        <svg
          viewBox="0 0 44 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '38px', height: '50px', display: 'block' }}
        >
          <defs>
            {/* 3D Ribbon Gradients (Emerald Dusk) */}
            <linearGradient id="snackRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="snackSunsetSun" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
          </defs>

          {/* 3D Top Fold Overhang */}
          <path d="M 4 4 L 40 4 L 44 0 L 0 0 Z" fill="#064E3B" />
          <path d="M 0 0 L 4 4 L 0 4 Z" fill="#022C22" />
          <path d="M 44 0 L 40 4 L 44 4 Z" fill="#022C22" />

          {/* Main 3D Ribbon Body with Swallowtail Cut */}
          <path
            d="M 4 4 L 40 4 L 40 48 L 22 40 L 4 48 Z"
            fill="url(#snackRibbonGrad)"
            stroke="#064E3B"
            strokeWidth="1.2"
          />

          {/* Satin Sheen Highlight Strip */}
          <path
            d="M 9 4 L 15 4 L 15 42 L 9 44 Z"
            fill="rgba(255, 255, 255, 0.28)"
          />

          {/* Mint Stitching Accent */}
          <path
            d="M 7 5 L 7 43 L 22 37 L 37 43 L 37 5"
            stroke="#A7F3D0"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.8"
            fill="none"
          />

          {/* Celestial Phase: 🌇 GOLDEN HOUR / SUNSET PHASE */}
          {/* Flying Twilight Birds */}
          <path d="M 12 11 Q 14 9 16 11 Q 18 9 20 11" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 25 8 Q 27 6 29 8 Q 31 6 33 8" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Sunset Horizon Line */}
          <line x1="12" y1="22" x2="32" y2="22" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />

          {/* Setting Sun Dipping into Horizon */}
          <path
            d="M 14 22 A 8 8 0 0 0 30 22 Z"
            fill="url(#snackSunsetSun)"
            stroke="#FDE047"
            strokeWidth="1.2"
          />

          {/* Warm Dusk Aura */}
          <line x1="16" y1="26" x2="28" y2="26" stroke="rgba(254, 240, 138, 0.7)" strokeWidth="1" strokeLinecap="round" />
          <line x1="19" y1="29" x2="25" y2="29" stroke="rgba(254, 240, 138, 0.5)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    case 'dinner':
      return (
        <svg
          viewBox="0 0 44 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '38px', height: '50px', display: 'block' }}
        >
          <defs>
            {/* 3D Ribbon Gradients (Royal Midnight Indigo) */}
            <linearGradient id="dinRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#3730A3" />
            </linearGradient>
            <linearGradient id="dinMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>
          </defs>

          {/* 3D Top Fold Overhang */}
          <path d="M 4 4 L 40 4 L 44 0 L 0 0 Z" fill="#312E81" />
          <path d="M 0 0 L 4 4 L 0 4 Z" fill="#1E1B4B" />
          <path d="M 44 0 L 40 4 L 44 4 Z" fill="#1E1B4B" />

          {/* Main 3D Ribbon Body with Swallowtail Cut */}
          <path
            d="M 4 4 L 40 4 L 40 48 L 22 40 L 4 48 Z"
            fill="url(#dinRibbonGrad)"
            stroke="#312E81"
            strokeWidth="1.2"
          />

          {/* Satin Sheen Highlight Strip */}
          <path
            d="M 9 4 L 15 4 L 15 42 L 9 44 Z"
            fill="rgba(255, 255, 255, 0.26)"
          />

          {/* Lavender Silver Stitching Accent */}
          <path
            d="M 7 5 L 7 43 L 22 37 L 37 43 L 37 5"
            stroke="#C7D2FE"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            opacity="0.8"
            fill="none"
          />

          {/* Celestial Phase: 🌙 WAXING CRESCENT MOON & TWILIGHT STARS */}
          {/* Glowing Waxing Crescent Moon */}
          <path
            d="M 24 13 C 18 14 14 19 15 25 C 16 30 21 34 26 33 C 21 34 16 29 17 22 C 18 17 21 14 24 13 Z"
            fill="url(#dinMoonGrad)"
            stroke="#EAB308"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Twinkling Night Stars */}
          <path d="M 29 14 L 30 11.5 L 31 14 L 33.5 15 L 31 16 L 30 18.5 L 29 16 L 26.5 15 Z" fill="#FDE047" />
          <path d="M 12 15 L 12.5 13.5 L 13 15 L 14.5 15.5 L 13 16 L 12.5 17.5 L 12 16 L 10.5 15.5 Z" fill="#FFFFFF" opacity="0.9" />
          <circle cx="30" cy="27" r="1.2" fill="#C7D2FE" />
          <circle cx="23" cy="9" r="0.9" fill="#FEF08A" />
        </svg>
      );

    default:
      return null;
  }
};
