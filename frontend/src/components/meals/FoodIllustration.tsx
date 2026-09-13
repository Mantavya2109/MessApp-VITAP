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
          {/* Clay Bowl Shadow */}
          <ellipse cx="68" cy="88" rx="54" ry="24" fill="#451A03" opacity="0.5" />
          
          {/* Ceramic / Clay Bowl Body */}
          <path
            d="M 16 56 C 20 92 44 110 68 110 C 92 110 116 92 120 56 Z"
            fill="#854D0E"
            stroke="#451A03"
            strokeWidth="4"
          />
          {/* Inner Depth / Rim */}
          <ellipse cx="68" cy="56" rx="52" ry="24" fill="#A16207" stroke="#451A03" strokeWidth="3.5" />
          
          {/* Steaming Food / Broth / Noodles */}
          <ellipse cx="68" cy="56" rx="45" ry="19" fill="#FEF08A" />
          <ellipse cx="68" cy="54" rx="38" ry="15" fill="#FDE047" />
          
          {/* Curled Noodles / Rice Textures */}
          <path
            d="M 38 52 Q 52 42 66 52 Q 80 62 96 48"
            stroke="#EAB308"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 46 60 Q 62 50 78 60 Q 90 68 100 56"
            stroke="#CA8A04"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Green Peas & Red Carrots / Veggies */}
          <circle cx="50" cy="56" r="4" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          <circle cx="70" cy="60" r="4.5" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          <circle cx="86" cy="52" r="3.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <circle cx="58" cy="48" r="3" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <circle cx="94" cy="58" r="3" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />

          {/* Steam Swirls */}
          <path
            d="M 54 30 Q 50 18 56 10"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 72 32 Q 78 20 70 8"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case 'snacks':
      return (
        <svg
          viewBox="0 0 120 125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* Angled Straw */}
          <path
            d="M 70 48 L 86 20 L 102 12"
            stroke="#E2E8F0"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M 70 48 L 86 20 L 102 12"
            stroke="#CBD5E1"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Straw stripes */}
          <path d="M 88 19 L 91 17" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <path d="M 94 16 L 97 14" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

          {/* Juice Box Main Body */}
          <rect
            x="22"
            y="48"
            width="72"
            height="66"
            rx="12"
            fill="#4ADE80"
            stroke="#166534"
            strokeWidth="3.5"
          />
          {/* Angled Box Top Lip */}
          <path
            d="M 22 58 L 58 46 L 94 58"
            fill="#86EFAC"
            stroke="#166534"
            strokeWidth="3"
          />

          {/* Circular Graphic Pattern on Box */}
          <circle cx="58" cy="82" r="18" fill="#22C55E" />
          <circle cx="58" cy="82" r="12" fill="#BBF7D0" />
          <circle cx="58" cy="82" r="5" fill="#166534" />

          {/* White Specular Shine */}
          <path
            d="M 28 62 L 28 104"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
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
