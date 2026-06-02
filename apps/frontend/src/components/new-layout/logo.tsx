'use client';

// Publio brand mark — graffiti italic "P" matching marketing site
export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 64 64"
      fill="none"
      className="mt-[8px] min-w-[60px] min-h-[60px]"
    >
      <defs>
        <linearGradient id="publio-grad" x1="0" y1="0" x2="1" y2="1">
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
          fill="url(#publio-grad)"
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
  );
};

