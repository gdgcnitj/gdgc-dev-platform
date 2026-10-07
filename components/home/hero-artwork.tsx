// Flat, decorative geometry. This is not a chapter logo or a student portrait.
export function HeroArtwork() {
  return (
    <svg className="club-hero-art" viewBox="0 0 520 460" fill="none" aria-hidden="true">
      <defs>
        <clipPath id="club-hero-green-clip">
          <rect x="12" y="248" width="212" height="200" rx="20" />
        </clipPath>
      </defs>
      <g className="club-hero-shape club-hero-shape-blue">
        <rect
          x="12"
          y="12"
          width="272"
          height="222"
          rx="20"
          fill="#4285F4"
          stroke="#222222"
          strokeWidth="2"
        />
        <g stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path className="club-loop club-code-left" d="m112 82-43 41 43 41" />
          <path className="club-loop club-code-right" d="m182 82 43 41-43 41" />
          <path className="club-loop club-code-slash" d="m156 105-19 52" />
        </g>
      </g>
      <g className="club-hero-shape club-hero-shape-red">
        <rect
          x="298"
          y="12"
          width="210"
          height="222"
          rx="105"
          fill="#EA4335"
          stroke="#222222"
          strokeWidth="2"
        />
        <path
          className="club-loop club-spark"
          d="M403 60v126m-63-63h126m-107-44 88 88m0-88-88 88"
          stroke="#222222"
          strokeWidth="12"
        />
      </g>
      <g className="club-hero-shape club-hero-shape-green">
        <rect
          x="12"
          y="248"
          width="212"
          height="200"
          rx="20"
          fill="#34A853"
          stroke="#222222"
          strokeWidth="2"
        />
        <g clipPath="url(#club-hero-green-clip)" fill="#FFFFFF" stroke="#222222" strokeWidth="2">
          <path className="club-loop club-tile club-tile-a" d="M12 346c0-59 48-98 106-98v98H12Z" />
          <path className="club-loop club-tile club-tile-b" d="M118 448c0-59 48-102 106-102v102H118Z" />
        </g>
        <path d="M118 248v200M12 346h212" stroke="#222222" strokeWidth="2" />
        <rect x="12" y="248" width="212" height="200" rx="20" stroke="#222222" strokeWidth="2" />
      </g>
      <g className="club-hero-shape club-hero-shape-yellow">
        <rect
          x="238"
          y="248"
          width="270"
          height="200"
          rx="20"
          fill="#FBBC05"
          stroke="#222222"
          strokeWidth="2"
        />
        <circle className="club-loop club-dial" cx="373" cy="348" r="64" fill="#FFFFFF" stroke="#222222" strokeWidth="2" />
        <path
          className="club-loop club-arrow"
          d="M350 348h46m-18-18 18 18-18 18"
          stroke="#222222"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
