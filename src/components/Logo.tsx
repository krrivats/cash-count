interface LogoProps {
  size?: number;
}

export default function Logo({ size = 28 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cash Count logo"
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Stacked notes background */}
      <rect x="6" y="14" width="28" height="20" rx="3" fill="#1b2138" stroke="url(#logoGrad)" strokeWidth="1.5" />
      <rect x="10" y="10" width="28" height="20" rx="3" fill="#161b30" stroke="url(#logoGrad)" strokeWidth="1.5" />
      <rect x="14" y="6" width="28" height="20" rx="3" fill="url(#logoGrad)" />
      {/* ₹ symbol */}
      <text
        x="28"
        y="21"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
        fill="#080a12"
        fontFamily="system-ui, sans-serif"
      >
        ₹
      </text>
      {/* Coin at bottom-right */}
      <circle cx="36" cy="36" r="8" fill="#1b2138" stroke="url(#logoGrad)" strokeWidth="1.5" />
      <circle cx="36" cy="36" r="5" fill="url(#logoGrad)" opacity="0.3" />
      <text
        x="36"
        y="39"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="#34d399"
        fontFamily="system-ui, sans-serif"
      >
        ₹
      </text>
    </svg>
  );
}
