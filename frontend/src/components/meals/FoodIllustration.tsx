import React from 'react';
import type { MealType } from '../../types';

interface FoodIllustrationProps {
  type: MealType;
  className?: string;
}

export const FoodIllustration: React.FC<FoodIllustrationProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'breakfast':
      return (
        <svg
          viewBox="0 0 130 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Back Toast Slice */}
          <rect
            x="48"
            y="12"
            width="46"
            height="48"
            rx="12"
            fill="#E28743"
            stroke="#9A3412"
            strokeWidth="3.5"
            transform="rotate(8 48 12)"
          />
          <rect
            x="52"
            y="16"
            width="38"
            height="40"
            rx="9"
            fill="#F6BD60"
            transform="rotate(8 52 16)"
          />

          {/* Front Toast Slice */}
          <rect
            x="24"
            y="20"
            width="50"
            height="52"
            rx="13"
            fill="#E28743"
            stroke="#9A3412"
            strokeWidth="3.5"
            transform="rotate(-8 24 20)"
          />
          <rect
            x="28"
            y="24"
            width="42"
            height="44"
            rx="10"
            fill="#F7C59F"
            transform="rotate(-8 28 24)"
          />
          {/* Toast Texture Dots */}
          <circle cx="42" cy="40" r="3" fill="#E28743" opacity="0.6" />
          <circle cx="56" cy="46" r="2.5" fill="#E28743" opacity="0.6" />

          {/* Rounded Pop-up Toaster Body */}
          <rect
            x="14"
            y="54"
            width="96"
            height="52"
            rx="18"
            fill="#E63946"
            stroke="#7F1D1D"
            strokeWidth="3.5"
          />
          {/* Toaster Highlights */}
          <path
            d="M 24 62 Q 62 58 100 62"
            stroke="#FFAAA6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Toaster Slot Top Lip */}
          <rect x="22" y="52" width="76" height="5.5" rx="2.5" fill="#450A0A" />
          {/* Side Handle / Knob */}
          <circle cx="90" cy="80" r="6" fill="#FFAAA6" stroke="#7F1D1D" strokeWidth="2.5" />
          <circle cx="90" cy="80" r="2" fill="#7F1D1D" />
          {/* Left Lever */}
          <rect x="6" y="68" width="10" height="7" rx="3.5" fill="#334155" />
          {/* Bottom Feet */}
          <rect x="26" y="104" width="14" height="6" rx="3" fill="#1E293B" />
          <rect x="84" y="104" width="14" height="6" rx="3" fill="#1E293B" />
        </svg>
      );

    case 'lunch':
      return (
        <svg
          viewBox="0 0 135 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Defs for Dal, Rice, and Steam */}
          <defs>
            <linearGradient id="dalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="lunchPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="lunchSteamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Plate Shadow */}
          <ellipse cx="68" cy="88" rx="56" ry="20" fill="#0F172A" opacity="0.55" />

          {/* Serving Dish / Plate Rim */}
          <ellipse cx="68" cy="76" rx="56" ry="25" fill="url(#lunchPlateGrad)" stroke="#1E293B" strokeWidth="3.5" />
          <ellipse cx="68" cy="73" rx="51" ry="21" fill="#475569" />
          <ellipse cx="68" cy="70" rx="47" ry="18" fill="#1E293B" />

          {/* Steamed Fluffy Basmati Rice Mound (Left Side) */}
          <path
            d="M 24 68 C 24 50 46 42 66 52 C 72 56 72 68 66 78 C 48 83 26 80 24 68 Z"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="2"
          />
          {/* Fluffy Rice Highlights */}
          <ellipse cx="44" cy="58" rx="16" ry="9" fill="#FFFFFF" />
          {/* Individual Basmati Rice Grains */}
          <ellipse cx="36" cy="56" rx="3.5" ry="1.5" fill="#E2E8F0" transform="rotate(-20 36 56)" />
          <ellipse cx="48" cy="52" rx="3.5" ry="1.5" fill="#E2E8F0" transform="rotate(15 48 52)" />
          <ellipse cx="42" cy="64" rx="3.5" ry="1.5" fill="#E2E8F0" transform="rotate(-10 42 64)" />
          <ellipse cx="54" cy="60" rx="3.5" ry="1.5" fill="#E2E8F0" transform="rotate(30 54 60)" />
          <ellipse cx="32" cy="66" rx="3.5" ry="1.5" fill="#E2E8F0" transform="rotate(10 32 66)" />

          {/* Aromatic Golden Dal Tadka (Right Side & Pooling) */}
          <path
            d="M 58 54 C 76 46 106 50 110 66 C 112 78 88 86 64 82 C 60 76 56 64 58 54 Z"
            fill="url(#dalGradient)"
            stroke="#B45309"
            strokeWidth="2.5"
          />
          {/* Dal Tadka Ghee Sheen */}
          <ellipse cx="86" cy="66" rx="18" ry="9" fill="#FDE047" opacity="0.8" />
          <ellipse cx="84" cy="64" rx="11" ry="5" fill="#FEF08A" opacity="0.9" />

          {/* Cumin / Jeera Tadka Seeds */}
          <ellipse cx="78" cy="62" rx="2" ry="0.8" fill="#78350F" transform="rotate(25 78 62)" />
          <ellipse cx="92" cy="68" rx="2" ry="0.8" fill="#78350F" transform="rotate(-35 92 68)" />
          <ellipse cx="84" cy="72" rx="2" ry="0.8" fill="#78350F" transform="rotate(15 84 72)" />

          {/* Red Tadka Chilli */}
          <path d="M 95 58 Q 103 54 101 64" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="95" cy="58" r="1.5" fill="#16A34A" />

          {/* Fresh Coriander Garnish (Cilantro) */}
          <path
            d="M 64 62 C 62 58 66 56 68 58 C 70 56 74 58 72 62 C 74 66 70 68 68 66 C 66 68 62 66 64 62 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="0.8"
          />

          {/* Hot Steam Wisps */}
          <path
            d="M 44 42 C 40 30 48 22 42 12"
            stroke="url(#lunchSteamGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 72 40 C 78 28 66 18 74 8"
            stroke="url(#lunchSteamGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lunch aroma sparkle */}
          <path
            d="M 98 28 L 99.5 24 L 101 28 L 105 29.5 L 101 31 L 99.5 35 L 98 31 L 94 29.5 Z"
            fill="#FACC15"
            opacity="0.85"
          />
        </svg>
      );

    case 'snacks':
      return (
        <svg
          viewBox="0 0 130 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Defs for Gradients */}
          <defs>
            <linearGradient id="teaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="cupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="55%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="saucerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="steamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Saucer / Plate Shadow */}
          <ellipse cx="62" cy="98" rx="46" ry="14" fill="#0F172A" opacity="0.45" />

          {/* Ceramic Saucer Plate */}
          <ellipse cx="62" cy="94" rx="46" ry="13" fill="url(#saucerGradient)" stroke="#64748B" strokeWidth="3" />
          <ellipse cx="62" cy="92.5" rx="40" ry="10" fill="#FFFFFF" />
          {/* Inner Saucer Indentation */}
          <ellipse cx="62" cy="93" rx="26" ry="6.5" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Cup Handle (Back Outer Stroke & Inner Highlight) */}
          <path
            d="M 82 60 C 104 60 106 82 82 84"
            stroke="#064E3B"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 82 60 C 104 60 106 82 82 84"
            stroke="#34D399"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cup Body Base (Matte Emerald Green) */}
          <path
            d="M 32 58 C 32 86 42 94 62 94 C 82 94 92 86 92 58 Z"
            fill="url(#cupGradient)"
            stroke="#064E3B"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Cup Body Specular Gloss Curve */}
          <path
            d="M 39 63 C 38 78 44 86 52 89"
            stroke="rgba(255, 255, 255, 0.42)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cup Rim & Hot Masala Chai Surface */}
          <ellipse cx="62" cy="58" rx="30" ry="12" fill="#059669" stroke="#064E3B" strokeWidth="3.5" />
          <ellipse cx="62" cy="57" rx="26" ry="9.5" fill="#A7F3D0" />
          {/* Hot Tea Liquid */}
          <ellipse cx="62" cy="57" rx="23" ry="8" fill="url(#teaGradient)" stroke="#78350F" strokeWidth="1.5" />
          {/* Frothy Tea Swirl / Creamy Foam Sheen */}
          <ellipse cx="59" cy="56" rx="16" ry="5.5" fill="#F59E0B" opacity="0.8" />
          <ellipse cx="56" cy="55.5" rx="10" ry="3" fill="#FEF3C7" opacity="0.65" />
          <path
            d="M 68 57 Q 73 55 77 58"
            stroke="#FEF3C7"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Hot Waves / Rising Steam Trails */}
          {/* Left Steam Wave */}
          <path
            d="M 46 44 C 40 32 50 24 44 12"
            stroke="url(#steamGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Center Main Steam Wave (Taller & Radiant) */}
          <path
            d="M 62 42 C 70 30 55 18 64 6"
            stroke="url(#steamGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Steam Wave */}
          <path
            d="M 76 45 C 82 34 72 24 80 14"
            stroke="url(#steamGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sparkles / Warm Aroma Stars */}
          <path
            d="M 94 22 L 95.5 17 L 97 22 L 102 23.5 L 97 25 L 95.5 30 L 94 25 L 89 23.5 Z"
            fill="#FACC15"
            opacity="0.9"
          />
          <circle cx="36" cy="20" r="2.5" fill="#FDE047" opacity="0.8" />
          <circle cx="86" cy="38" r="2" fill="#FDE047" opacity="0.75" />
        </svg>
      );

    case 'dinner':
      return (
        <svg
          viewBox="0 0 135 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Dinner Plate Shadow */}
          <ellipse cx="68" cy="94" rx="56" ry="18" fill="#0F172A" opacity="0.6" />

          {/* Stainless Steel / Metallic Thali Base */}
          <ellipse cx="68" cy="82" rx="56" ry="24" fill="#334155" stroke="#1E293B" strokeWidth="3.5" />
          <ellipse cx="68" cy="79" rx="52" ry="21" fill="#475569" />
          <ellipse cx="68" cy="76" rx="48" ry="18" fill="#1E293B" />

          {/* Saffron Spiced Rice Mound (Center-Left) */}
          <ellipse cx="48" cy="74" rx="22" ry="12" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <ellipse cx="48" cy="72" rx="18" ry="9" fill="#FEF08A" />
          {/* Rice Grain Details */}
          <path d="M 38 70 Q 42 68 46 70" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
          <path d="M 48 73 Q 52 71 56 73" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="67" r="2.5" fill="#22C55E" /> {/* Green Pea */}

          {/* Rich Curry Katori (Top-Right) */}
          <ellipse cx="86" cy="65" rx="20" ry="11" fill="#991B1B" stroke="#450A0A" strokeWidth="2.5" />
          <ellipse cx="86" cy="63" rx="17" ry="8.5" fill="#DC2626" />
          <ellipse cx="86" cy="62" rx="14" ry="6.5" fill="#EA580C" />
          {/* Paneer / Butter Cube in Curry */}
          <rect x="80" y="58" width="7" height="6" rx="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          <circle cx="91" cy="61" r="2" fill="#16A34A" /> {/* Cilantro garnish */}

          {/* Golden Layered Naan / Roti (Front-Left, draping over rim) */}
          <path
            d="M 22 72 C 26 50 56 46 68 58 C 76 66 70 84 54 86 C 36 88 18 84 22 72 Z"
            fill="#E28743"
            stroke="#9A3412"
            strokeWidth="3"
          />
          <path
            d="M 26 71 C 30 54 54 50 64 60 C 70 66 65 80 52 82 C 38 84 24 81 26 71 Z"
            fill="#F6BD60"
          />
          {/* Char-grilled marks on Naan */}
          <ellipse cx="42" cy="62" rx="4" ry="2.5" fill="#9A3412" opacity="0.8" transform="rotate(-15 42 62)" />
          <ellipse cx="54" cy="68" rx="3.5" ry="2" fill="#9A3412" opacity="0.8" transform="rotate(10 54 68)" />
          <ellipse cx="36" cy="74" rx="3" ry="2" fill="#9A3412" opacity="0.7" />
          {/* Melting Butter Glaze */}
          <ellipse cx="48" cy="64" rx="5" ry="3" fill="#FEF08A" opacity="0.9" />

          {/* Whimsical Night Aroma / Steam Wisps */}
          <path
            d="M 86 48 Q 82 36 88 28"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 96 46 Q 100 34 94 24"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Night sparkle / evening dinner star */}
          <path
            d="M 104 22 L 106 16 L 108 22 L 114 24 L 108 26 L 106 32 L 104 26 L 98 24 Z"
            fill="#FACC15"
            opacity="0.85"
          />
        </svg>
      );

    default:
      return null;
  }
};
