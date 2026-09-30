import React from 'react';
import type { AvatarId } from '../../types';

interface AvatarIconProps {
  avatarId?: AvatarId;
  size?: number | string;
  className?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({
  avatarId = 'pro-man-1',
  size = 36,
  className = '',
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;

  switch (avatarId) {
    /* =========================================================================
       BOY 1 (pro-man-1): Modern Upward-Lifted Voluminous Hair, T-Shirt
       ========================================================================= */
    case 'pro-man-1':
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          <defs>
            <linearGradient id="bg-b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            <linearGradient id="hair-b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="skin-b1" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FCD3A8" />
              <stop offset="100%" stopColor="#F5B27D" />
            </linearGradient>

            <linearGradient id="tshirt-b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#bg-b1)" />

          {/* Hair Base */}
          <path
            d="M 28 36 C 24 24 32 10 50 8 C 66 8 76 22 72 38 C 73 48 70 54 68 56 L 32 56 C 30 54 27 48 28 36 Z"
            fill="#09090B"
          />

          {/* T-Shirt */}
          <path
            d="M 12 100 C 12 84 24 74 38 72 L 62 72 C 76 74 88 84 88 100 Z"
            fill="url(#tshirt-b1)"
          />
          <path d="M 28 78 L 22 100" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 72 78 L 78 100" stroke="#C2410C" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M 32 80 Q 36 90 35 100" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 68 80 Q 64 90 65 100" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Crew Neckband */}
          <path d="M 38 72 C 38 80 62 80 62 72 C 62 76 38 76 38 72 Z" fill="#C2410C" />
          <path d="M 40 72 Q 50 79 60 72" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Neck */}
          <path d="M 43 56 L 43 73 Q 50 77 57 73 L 57 56 Z" fill="url(#skin-b1)" />
          <path d="M 43 56 Q 50 64 57 56 Q 50 60 43 56 Z" fill="#D97706" opacity="0.45" />

          {/* Ears */}
          <path d="M 29 44 C 25 44 25 55 30 56 Z" fill="url(#skin-b1)" />
          <path d="M 28 47 Q 27 51 30 53" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 71 44 C 75 44 75 55 70 56 Z" fill="url(#skin-b1)" />
          <path d="M 72 47 Q 73 51 70 53" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Face */}
          <path
            d="M 30 38 C 30 56 37 66 50 66 C 63 66 70 56 70 38 C 70 28 63 22 50 22 C 37 22 30 28 30 38 Z"
            fill="url(#skin-b1)"
          />

          {/* Upward Quiff */}
          <path
            d="M 27 34 C 24 24 30 14 44 8 C 54 4 66 6 74 15 C 78 20 76 28 73 35 C 70 24 64 16 52 14 C 42 13 32 20 27 34 Z"
            fill="url(#hair-b1)"
          />
          <path
            d="M 28 32 C 32 18 42 8 54 6 C 65 4 72 10 74 20 C 70 14 62 10 52 11 C 42 12 34 20 30 32 Z"
            fill="#1E293B"
          />
          <path d="M 34 28 C 38 16 48 9 58 8 C 50 11 44 17 40 26 Z" fill="#475569" opacity="0.85" />
          <path d="M 48 9 C 58 7 68 11 73 18 C 68 13 60 11 52 12 Z" fill="#475569" opacity="0.85" />
          <path d="M 38 24 C 44 14 54 10 63 12 C 55 13 47 18 43 25 Z" fill="#334155" />
          <path
            d="M 31 32 C 37 23 49 20 62 23 C 67 25 70 29 70 33 C 67 27 58 24 49 24 C 39 24 33 28 31 32 Z"
            fill="#0F172A"
          />
          <path d="M 30 35 L 30 45 L 33 43 L 33 35 Z" fill="#0F172A" />
          <path d="M 70 35 L 70 45 L 67 43 L 67 35 Z" fill="#0F172A" />

          {/* Eyebrows */}
          <path d="M 35 40 Q 41 38 46 40" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 54 40 Q 59 38 65 40" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          <ellipse cx="41" cy="46" rx="3.2" ry="3.5" fill="#18181B" />
          <circle cx="40" cy="44.8" r="1.1" fill="#FFFFFF" />
          <circle cx="42.2" cy="47" r="0.5" fill="#FFFFFF" />

          <ellipse cx="59" cy="46" rx="3.2" ry="3.5" fill="#18181B" />
          <circle cx="58" cy="44.8" r="1.1" fill="#FFFFFF" />
          <circle cx="60.2" cy="47" r="0.5" fill="#FFFFFF" />

          {/* Nose & Smile */}
          <path d="M 49 46 Q 51 51 48 53 Q 50 54 52 53" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M 43 57 Q 50 63 57 57" stroke="#7C2D12" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 44.5 57.5 Q 50 62 55.5 57.5" fill="#FFFFFF" />
        </svg>
      );

    /* =========================================================================
       BOY 2 (pro-man-2): Stylish Sideways Cap, Modern Glasses, Collared Shirt
       ========================================================================= */
    case 'pro-man-2':
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          <defs>
            <linearGradient id="bg-b2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="cap-crown-b2" x1="30%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="cap-visor-b2" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            <linearGradient id="skin-b2" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FCD3A8" />
              <stop offset="100%" stopColor="#F5B27D" />
            </linearGradient>

            <linearGradient id="shirt-b2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#bg-b2)" />

          <path d="M 31 44 C 29 55 33 60 38 65 L 62 65 C 67 60 71 55 69 44 Z" fill="#18181B" />

          {/* Shirt */}
          <path
            d="M 12 100 C 12 84 24 74 38 72 L 62 72 C 76 74 88 84 88 100 Z"
            fill="url(#shirt-b2)"
          />
          <path d="M 50 78 L 50 100" stroke="#0284C7" strokeWidth="1.8" />
          <circle cx="50" cy="85" r="1.6" fill="#0369A1" />
          <circle cx="50" cy="94" r="1.6" fill="#0369A1" />

          {/* Neck */}
          <path d="M 43 56 L 43 74 Q 50 78 57 74 L 57 56 Z" fill="url(#skin-b2)" />
          <path d="M 43 56 Q 50 64 57 56 Q 50 60 43 56 Z" fill="#D97706" opacity="0.4" />

          {/* Collars */}
          <path d="M 42 68 L 32 78 L 46 76 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 58 68 L 68 78 L 54 76 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Ears & Face */}
          <path d="M 28 44 C 24 44 24 55 29 56 Z" fill="url(#skin-b2)" />
          <path d="M 27 47 Q 26 51 29 53" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 72 44 C 76 44 76 55 71 56 Z" fill="url(#skin-b2)" />
          <path d="M 73 47 Q 74 51 71 53" stroke="#D97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          <path
            d="M 29 38 C 29 56 36 66 50 66 C 64 66 71 56 71 38 C 71 28 64 24 50 24 C 36 24 29 28 29 38 Z"
            fill="url(#skin-b2)"
          />

          <path d="M 29 36 C 28 43 31 47 33 46 C 32 41 31 37 29 36 Z" fill="#18181B" />
          <path d="M 70 36 C 71 43 68 47 66 46 C 67 41 68 37 70 36 Z" fill="#18181B" />

          {/* Eyebrows */}
          <path d="M 34 38 Q 41 36 46 38" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 54 38 Q 59 36 66 38" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          <ellipse cx="40" cy="46" rx="3.2" ry="3.4" fill="#18181B" />
          <circle cx="39" cy="44.8" r="1.1" fill="#FFFFFF" />
          <circle cx="41.2" cy="47" r="0.5" fill="#FFFFFF" />

          <ellipse cx="60" cy="46" rx="3.2" ry="3.4" fill="#18181B" />
          <circle cx="59" cy="44.8" r="1.1" fill="#FFFFFF" />
          <circle cx="61.2" cy="47" r="0.5" fill="#FFFFFF" />

          {/* Glasses */}
          <rect x="32" y="40" width="16" height="13" rx="3.5" fill="rgba(255,255,255,0.22)" stroke="#0F172A" strokeWidth="2" />
          <path d="M 35 43 L 42 43" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="52" y="40" width="16" height="13" rx="3.5" fill="rgba(255,255,255,0.22)" stroke="#0F172A" strokeWidth="2" />
          <path d="M 55 43 L 62 43" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 48 45 Q 50 43 52 45" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 32 44 L 28 45" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 68 44 L 72 45" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />

          {/* Nose & Smile */}
          <path d="M 49 47 Q 51 52 48 54 Q 50 55 52 54" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M 43 58 Q 50 64 57 58" stroke="#713F12" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Sideways Cap */}
          <path d="M 26 34 C 23 16 35 10 52 11 C 67 12 77 20 74 37 Z" fill="url(#cap-crown-b2)" />
          <path d="M 53 11 L 51 34" stroke="#475569" strokeWidth="1.2" opacity="0.6" />
          <path d="M 53 11 Q 38 20 31 34" stroke="#475569" strokeWidth="1.1" opacity="0.5" />
          <path d="M 53 11 Q 65 21 70 35" stroke="#475569" strokeWidth="1.1" opacity="0.5" />
          <ellipse cx="53" cy="11" rx="3" ry="2" fill="#64748B" transform="rotate(12 53 11)" />
          <path d="M 26 34 C 36 30 64 26 80 27 C 82 29 76 36 68 37 C 52 38 36 38 26 34 Z" fill="url(#cap-visor-b2)" />
          <path d="M 26 34 C 42 37 60 37 80 27" stroke="#94A3B8" strokeWidth="1.3" fill="none" opacity="0.8" />
        </svg>
      );

    /* =========================================================================
       GIRL 1 (pro-woman-1): Exact Match to User Screenshot (Left)
       Crimson Background, Long Center-Part Brunette Hair, Burgundy Top, White Collar & Pearl
       ========================================================================= */
    case 'pro-woman-1':
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          {/* Deep Crimson/Burgundy Red Background */}
          <rect width="100" height="100" fill="#B91235" />

          {/* Long Brunette Hair Falling Behind */}
          <path
            d="M 25 50 C 25 28 36 17 50 17 C 64 17 75 28 75 50 C 75 70 72 86 72 100 L 28 100 C 28 86 25 70 25 50 Z"
            fill="#2E1005"
          />

          {/* Tailored Burgundy/Wine Top */}
          <path
            d="M 19 100 C 19 75 36 69 50 69 C 64 69 81 75 81 100 Z"
            fill="#881337"
          />

          {/* White Collar Opening */}
          <path
            d="M 39 69 Q 50 86 61 69 Z"
            fill="#F8FAFC"
          />

          {/* Delicate White Pearl Pendant */}
          <circle cx="50" cy="78" r="3.2" fill="#FFFFFF" />

          {/* Neck */}
          <rect x="43" y="57" width="14" height="14" fill="#FED7AA" />

          {/* Round Gentle Face */}
          <circle cx="50" cy="46" r="20" fill="#FED7AA" />

          {/* Front Symmetrical Brunette Hair with Center Parting */}
          <path
            d="M 29 40 C 29 24 39 18 50 18 C 61 18 71 24 71 40 C 69 33 61 27 50 28 C 39 27 31 33 29 40 Z"
            fill="#2E1005"
          />
          {/* Left Hair Lock framing cheek */}
          <path
            d="M 29 40 C 29 56 33 67 36 72 C 32 67 30 53 30 40 Z"
            fill="#2E1005"
          />
          {/* Right Hair Lock framing cheek */}
          <path
            d="M 71 40 C 71 56 67 67 64 72 C 68 67 70 53 70 40 Z"
            fill="#2E1005"
          />

          {/* Eyes with Upper Lash Line & Pupil Shine */}
          <path d="M 38 40 L 45 40" stroke="#2E1005" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 55 40 L 62 40" stroke="#2E1005" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="41.5" cy="44.5" rx="3.4" ry="3.8" fill="#2E1005" />
          <ellipse cx="58.5" cy="44.5" rx="3.4" ry="3.8" fill="#2E1005" />
          <circle cx="40.5" cy="43" r="1.2" fill="#FFFFFF" />
          <circle cx="57.5" cy="43" r="1.2" fill="#FFFFFF" />

          {/* Distinct Pink Circular Blush on Both Cheeks */}
          <circle cx="36" cy="50" r="4.2" fill="rgba(244,63,94,0.42)" />
          <circle cx="64" cy="50" r="4.2" fill="rgba(244,63,94,0.42)" />

          {/* Warm Sweet Smile */}
          <path
            d="M 45 55 Q 50 60 55 55"
            stroke="#9F1239"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    /* =========================================================================
       GIRL 2 (pro-woman-2): Exact Match to User Screenshot (Right)
       Emerald Green Background, Sleek High Top Bun, Gold Studs, Green Blazer + White V-Neck
       ========================================================================= */
    case 'pro-woman-2':
      return (
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          {/* Royal Purple Background (Distinct from other 3 avatars) */}
          <rect width="100" height="100" fill="#7C3AED" />

          {/* Sleek High Top Bun */}
          <ellipse cx="50" cy="21" rx="14" ry="10" fill="#18181B" />

          {/* Emerald Green Blazer / Jacket Body */}
          <path
            d="M 17 100 C 17 72 33 67 50 67 C 67 67 83 72 83 100 Z"
            fill="#064E3B"
          />

          {/* White V-Neck Shirt Opening */}
          <path
            d="M 40 67 L 50 83 L 60 67 Z"
            fill="#F8FAFC"
          />

          {/* Lapel Folds on Blazer */}
          <path d="M 36 67 L 46 97 L 39 100 Z" fill="#043B2C" />
          <path d="M 64 67 L 54 97 L 61 100 Z" fill="#043B2C" />

          {/* Neck */}
          <rect x="43" y="57" width="14" height="13" fill="#FEF08A" />

          {/* Round Bright Face */}
          <circle cx="50" cy="46" r="20" fill="#FEF08A" />

          {/* Sleek Parted Hair along Forehead */}
          <path
            d="M 29 40 C 29 24 39 18 50 18 C 61 18 71 24 71 40 C 67 31 58 26 50 26 C 42 26 33 31 29 40 Z"
            fill="#18181B"
          />

          {/* Large Golden Yellow Circular Stud Earrings */}
          <circle cx="30" cy="47" r="3.2" fill="#FBBF24" />
          <circle cx="70" cy="47" r="3.2" fill="#FBBF24" />

          {/* Confident Dark Eyes with Catchlights */}
          <ellipse cx="41.5" cy="44.5" rx="3.4" ry="3.8" fill="#18181B" />
          <ellipse cx="58.5" cy="44.5" rx="3.4" ry="3.8" fill="#18181B" />
          <circle cx="40.5" cy="43" r="1.2" fill="#FFFFFF" />
          <circle cx="57.5" cy="43" r="1.2" fill="#FFFFFF" />

          {/* Warm Brown Poised Smile */}
          <path
            d="M 45 55 Q 50 60 55 55"
            stroke="#92400E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
  }
};
