import React from 'react';

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {/* Crystal / shield / A hybrid */}
      <path d="M20 2 L36 12 L32 34 L20 38 L8 34 L4 12 Z" fill="url(#logoGrad)" opacity="0.15" />
      <path d="M20 2 L36 12 L32 34 L20 38 L8 34 L4 12 Z" stroke="url(#logoGrad)" strokeWidth="1.2" fill="none" />
      <path d="M20 8 L13 28 M20 8 L27 28 M16 21 L24 21" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="8" r="2" fill="#c084fc" />
    </svg>
  );
}
