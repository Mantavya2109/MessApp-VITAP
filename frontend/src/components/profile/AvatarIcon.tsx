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
    case 'pro-man-2':
      // Professional Man 2: Charcoal blazer, white shirt, sleek modern spectacles, cool teal background
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          {/* Background */}
          <rect width="36" height="36" fill="#0D9488" />
          
          {/* Charcoal Blazer */}
          <path d="M 6 36 C 6 26 12 24 18 24 C 24 24 30 26 30 36 Z" fill="#1E293B" />
          {/* White Shirt Opening */}
          <path d="M 14 24 L 18 32 L 22 24 Z" fill="#FFFFFF" />
          {/* Lapels */}
          <path d="M 12 24 L 16 34 L 14 36 Z" fill="#0F172A" />
          <path d="M 24 24 L 20 34 L 22 36 Z" fill="#0F172A" />

          {/* Neck */}
          <rect x="15.5" y="20" width="5" height="5.5" fill="#FDE68A" />

          {/* Face */}
          <circle cx="18" cy="16.5" r="7.2" fill="#FDE68A" />

          {/* Modern Fade Haircut */}
          <path d="M 10.5 14.5 C 10.5 9 14 6.5 18 6.5 C 22 6.5 25.5 9 25.5 14.5 C 24.5 10.5 21.5 9 18 9 C 14.5 9 11.5 10.5 10.5 14.5 Z" fill="#18181B" />
          
          {/* Modern Rectangular Spectacles */}
          <rect x="12" y="13.5" width="5" height="3.8" rx="1" stroke="#0F172A" strokeWidth="1.2" fill="rgba(255,255,255,0.3)" />
          <rect x="19" y="13.5" width="5" height="3.8" rx="1" stroke="#0F172A" strokeWidth="1.2" fill="rgba(255,255,255,0.3)" />
          <line x1="17" y1="15" x2="19" y2="15" stroke="#0F172A" strokeWidth="1.2" />

          {/* Eyes */}
          <circle cx="14.5" cy="15.4" r="0.9" fill="#0F172A" />
          <circle cx="21.5" cy="15.4" r="0.9" fill="#0F172A" />

          {/* Confident Smile */}
          <path d="M 16 19.8 Q 18 21.5 20 19.8" stroke="#78350F" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'pro-woman-1':
      // Professional Woman 1: Tailored burgundy blazer, white blouse, styled brunette hair, warm wine background
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          {/* Background */}
          <rect width="36" height="36" fill="#BE123C" />
          
          {/* Back Hair */}
          <path d="M 9 18 C 9 10 13 6 18 6 C 23 6 27 10 27 18 C 27 25 26 31 26 36 C 21 36 15 36 10 36 C 10 31 9 25 9 18 Z" fill="#2E1005" />

          {/* Tailored Burgundy Blazer */}
          <path d="M 7 36 C 7 27 13 25 18 25 C 23 25 29 27 29 36 Z" fill="#881337" />
          {/* White Blouse Neckline */}
          <path d="M 14 25 Q 18 31 22 25 Z" fill="#F8FAFC" />
          {/* Delicate Pearl Pendant */}
          <circle cx="18" cy="28" r="1.1" fill="#FFFFFF" />

          {/* Neck */}
          <rect x="15.5" y="20.5" width="5" height="5" fill="#FED7AA" />

          {/* Face */}
          <circle cx="18" cy="16.5" r="7.2" fill="#FED7AA" />

          {/* Styled Front Hair & Bangs */}
          <path d="M 10.5 14.5 C 10.5 8.5 14 6.5 18 6.5 C 22 6.5 25.5 8.5 25.5 14.5 C 25 12 22 9.5 18 10 C 14 9.5 11 12 10.5 14.5 Z" fill="#2E1005" />
          <path d="M 10.5 14.5 C 10.5 20 12 24 13 26 C 11.5 24 11 19 11 14.5 Z" fill="#2E1005" />
          <path d="M 25.5 14.5 C 25.5 20 24 24 23 26 C 24.5 24 25 19 25 14.5 Z" fill="#2E1005" />

          {/* Refined Eyes */}
          <ellipse cx="15" cy="16" rx="1.2" ry="1.4" fill="#2E1005" />
          <ellipse cx="21" cy="16" rx="1.2" ry="1.4" fill="#2E1005" />
          <circle cx="14.6" cy="15.5" r="0.4" fill="#FFFFFF" />
          <circle cx="20.6" cy="15.5" r="0.4" fill="#FFFFFF" />

          {/* Eyelash Accent */}
          <path d="M 13.8 14.5 L 16.2 14.5" stroke="#2E1005" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M 19.8 14.5 L 22.2 14.5" stroke="#2E1005" strokeWidth="0.8" strokeLinecap="round" />

          {/* Rosy Executive Glow */}
          <circle cx="13.2" cy="18" r="1.3" fill="rgba(244,63,94,0.3)" />
          <circle cx="22.8" cy="18" r="1.3" fill="rgba(244,63,94,0.3)" />

          {/* Warm Professional Smile */}
          <path d="M 16.2 19.8 Q 18 21.5 19.8 19.8" stroke="#9F1239" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'pro-woman-2':
      // Professional Woman 2: Emerald power blazer, chic sleek updo, gold stud earrings, emerald background
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          {/* Background */}
          <rect width="36" height="36" fill="#059669" />
          
          {/* Chic Low Updo Bun */}
          <ellipse cx="18" cy="7.5" rx="5" ry="3.5" fill="#18181B" />

          {/* Emerald Power Blazer */}
          <path d="M 6 36 C 6 26 12 24 18 24 C 24 24 30 26 30 36 Z" fill="#064E3B" />
          {/* High-Neck Silk Blouse */}
          <path d="M 14.5 24 L 18 30 L 21.5 24 Z" fill="#F8FAFC" />
          <path d="M 13 24 L 16.5 35 L 14 36 Z" fill="#043B2C" />
          <path d="M 23 24 L 19.5 35 L 22 36 Z" fill="#043B2C" />

          {/* Neck */}
          <rect x="15.5" y="20.5" width="5" height="4.5" fill="#FDE68A" />

          {/* Face */}
          <circle cx="18" cy="16.5" r="7.2" fill="#FDE68A" />

          {/* Sleek Parted Hair */}
          <path d="M 10.5 14.5 C 10.5 8.5 14 6.5 18 6.5 C 22 6.5 25.5 8.5 25.5 14.5 C 24 11 21 9.5 18 9.5 C 14 9.5 11.5 11 10.5 14.5 Z" fill="#18181B" />

          {/* Minimalist Gold Stud Earrings */}
          <circle cx="10.8" cy="17" r="1.1" fill="#FBBF24" />
          <circle cx="25.2" cy="17" r="1.1" fill="#FBBF24" />

          {/* Confident Eyes */}
          <ellipse cx="15" cy="16" rx="1.2" ry="1.4" fill="#18181B" />
          <ellipse cx="21" cy="16" rx="1.2" ry="1.4" fill="#18181B" />
          <circle cx="14.6" cy="15.5" r="0.4" fill="#FFFFFF" />
          <circle cx="20.6" cy="15.5" r="0.4" fill="#FFFFFF" />

          {/* Poised Smile */}
          <path d="M 16.2 19.8 Q 18 21.5 19.8 19.8" stroke="#92400E" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'pro-man-1':
    default:
      // Professional Man 1 (Default): Deep Navy Suit, White Dress Shirt, Royal Blue Silk Tie, Classic Side-Part
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: dimension, height: dimension, display: 'block', borderRadius: '50%' }}
          className={className}
        >
          {/* Background */}
          <rect width="36" height="36" fill="#2563EB" />
          
          {/* Deep Navy Tailored Suit */}
          <path d="M 6 36 C 6 26 12 24 18 24 C 24 24 30 26 30 36 Z" fill="#0F172A" />
          
          {/* White Dress Shirt V-Opening */}
          <path d="M 13.5 24 L 18 31 L 22.5 24 Z" fill="#FFFFFF" />
          
          {/* Royal Blue Silk Tie */}
          <path d="M 17 24.5 L 19 24.5 L 18.5 32 L 18 34.5 L 17.5 32 Z" fill="#3B82F6" />
          {/* Tie Knot */}
          <polygon points="16.8,24 19.2,24 18.8,26 17.2,26" fill="#1D4ED8" />

          {/* Neck */}
          <rect x="15.5" y="20" width="5" height="5.5" fill="#FED7AA" />

          {/* Clean Chiseled Face */}
          <circle cx="18" cy="16.5" r="7.4" fill="#FED7AA" />

          {/* Classic Groomed Side-Part Hair */}
          <path d="M 10 15 C 10 8 14.5 5.5 21.5 5.5 C 25.5 5.5 26.5 8 26.5 12 C 26.5 15 25 17 25 17 C 23.5 12 20.5 9 17 9 C 13.5 9 11 11 10 15 Z" fill="#18181B" />
          <path d="M 11 11.5 Q 15 8.5 18 9" stroke="#18181B" strokeWidth="1.2" fill="none" />

          {/* Confident Professional Eyes */}
          <circle cx="15" cy="15.8" r="1.1" fill="#18181B" />
          <circle cx="21" cy="15.8" r="1.1" fill="#18181B" />
          <circle cx="14.6" cy="15.3" r="0.4" fill="#FFFFFF" />
          <circle cx="20.6" cy="15.3" r="0.4" fill="#FFFFFF" />

          {/* Defined Eyebrows */}
          <path d="M 13.5 13.5 Q 15 12.8 16.5 13.5" stroke="#18181B" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M 19.5 13.5 Q 21 12.8 22.5 13.5" stroke="#18181B" strokeWidth="1.1" strokeLinecap="round" fill="none" />

          {/* Approachable Executive Smile */}
          <path d="M 15.8 19.8 Q 18 21.8 20.2 19.8" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
};
