// The chapter's bracket mark, drawn as four separate bars so each can animate in.
export function BracketMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 29"
      width="56"
      height="29"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#202124" strokeWidth="1.67">
        <path
          className="bracket-bar"
          style={{ "--i": 0 } as React.CSSProperties}
          d="M13.5471 14.4959L22.2188 9.2232C24.26 7.98284 24.9565 5.23264 23.7794 3.08174C22.6023 0.930838 19.9924 0.196833 17.9513 1.4372L2.96642 10.5518L13.5471 14.4959Z"
          fill="#EA4335"
        />
        <path
          className="bracket-bar"
          style={{ "--i": 1 } as React.CSSProperties}
          d="M20.0799 28.0558C21.5524 28.0558 22.9896 27.2474 23.7787 25.8073C24.9558 23.6564 24.2592 20.9063 22.2181 19.6659L7.23322 10.5513C5.19203 9.3109 2.58214 10.0449 1.40504 12.1958C0.227942 14.3467 0.924506 17.0969 2.96569 18.3373L17.9505 27.4519C18.6251 27.8607 19.3569 28.0558 20.0799 28.0558Z"
          fill="#4285F4"
        />
        <path
          className="bracket-bar"
          style={{ "--i": 2 } as React.CSSProperties}
          d="M34.985 28.0563C35.708 28.0563 36.4398 27.8612 37.1144 27.4524L52.0992 18.3377L41.6552 14.31L32.8512 19.6664C30.8101 20.9067 30.1091 23.6569 31.2906 25.8078C32.0753 27.2479 33.5125 28.0563 34.985 28.0563Z"
          fill="#FBBC04"
        />
        <path
          className="bracket-bar"
          style={{ "--i": 3 } as React.CSSProperties}
          d="M49.9619 18.9417C51.4344 18.9417 52.8716 18.138 53.6608 16.6932C54.8379 14.5423 54.1413 11.7922 52.1001 10.5518L37.1152 1.4372C35.0741 0.196835 32.4642 0.930837 31.2871 3.08173C30.11 5.23263 30.8065 7.98281 32.8477 9.22318L47.8326 18.3378C48.5027 18.7466 49.2389 18.9417 49.9619 18.9417Z"
          fill="#34A853"
        />
      </g>
    </svg>
  );
}

// A drawn check with four brand-coloured sparks for confirmations.
export function SuccessMark() {
  return (
    <svg
      className="success-mark"
      viewBox="0 0 64 64"
      width="64"
      height="64"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="success-ring"
        cx="32"
        cy="32"
        r="22"
        stroke="#137333"
        strokeWidth="2.5"
      />
      <path
        className="success-check"
        d="M22.5 32.5l6.5 6.5 13-14"
        stroke="#137333"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {(
        [
          ["#4285F4", 32, 4],
          ["#EA4335", 60, 32],
          ["#FBBC04", 32, 60],
          ["#34A853", 4, 32],
        ] as const
      ).map(([color, cx, cy], index) => (
        <circle
          key={color}
          className="success-spark"
          style={{ "--i": index } as React.CSSProperties}
          cx={cx}
          cy={cy}
          r="3"
          fill={color}
        />
      ))}
    </svg>
  );
}
