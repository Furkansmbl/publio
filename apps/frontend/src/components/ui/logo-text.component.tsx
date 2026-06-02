import React from 'react';

// Publio wordmark — graffiti italic P + Sora wordmark, matches marketing
export const LogoTextComponent = () => {
  return (
    <span
      className="inline-flex items-center gap-[10px] text-[22px] leading-none"
      style={{ color: 'currentColor', fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: '-0.03em' }}
    >
      <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="publio-mark-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f3df0" />
            <stop offset="50%" stopColor="#ff7448" />
            <stop offset="100%" stopColor="#0fbfa1" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="#0e0d0b" />
        <g transform="rotate(-8 32 32)">
          <text
            x="33"
            y="48"
            fontFamily="Impact, 'Arial Black', sans-serif"
            fontSize="48"
            fontWeight={900}
            fontStyle="italic"
            textAnchor="middle"
            fill="url(#publio-mark-grad)"
            stroke="#fff"
            strokeWidth={1.4}
            strokeLinejoin="round"
          >
            P
          </text>
        </g>
        <circle cx="50" cy="14" r="3" fill="#ff7448" />
        <circle cx="12" cy="50" r="2" fill="#0fbfa1" />
      </svg>
      <span>publio</span>
    </span>
  );
};
