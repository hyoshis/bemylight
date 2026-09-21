import type { SVGProps } from "react";

export function CandleMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <path
        d="M16 3.5c3.2 3.4 4.7 5.8 4.7 8.1a4.7 4.7 0 1 1-9.4 0c0-2.3 1.5-4.7 4.7-8.1Z"
        fill="currentColor"
      />
      <path
        d="M16 8.2c1.4 1.6 2 2.7 2 3.7a2 2 0 1 1-4 0c0-1 .6-2.1 2-3.7Z"
        fill="#fff7d5"
      />
      <path
        d="M10.5 16.2h11v10.3a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V16.2Z"
        fill="#fff4cf"
      />
      <path
        d="M10.5 18.2c2.1.8 3.9.8 5.5 0 1.8-.9 3.6-.9 5.5 0"
        stroke="#d99a39"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function CandleGatheringIllustration({
  className,
  viewBox = "0 0 560 430",
  preserveAspectRatio,
}: {
  className?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
}) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      fill="none"
      role="img"
      aria-label="One bright candle surrounded by other candle lights"
    >
      <defs>
        <radialGradient id="centralGlow">
          <stop stopColor="#ffd978" stopOpacity=".72" />
          <stop offset=".48" stopColor="#e9a94f" stopOpacity=".18" />
          <stop offset="1" stopColor="#e9a94f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="night" x1="85" y1="30" x2="475" y2="405">
          <stop stopColor="#34435d" />
          <stop offset="1" stopColor="#202838" />
        </linearGradient>
        <linearGradient id="wax" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff9e5" />
          <stop offset="1" stopColor="#efdcae" />
        </linearGradient>
      </defs>
      <rect width="560" height="430" rx="42" fill="url(#night)" />
      <circle cx="280" cy="190" r="176" fill="url(#centralGlow)" />
      <g opacity=".5" fill="#ffd978">
        <circle cx="82" cy="88" r="3" />
        <circle cx="466" cy="94" r="4" />
        <circle cx="490" cy="198" r="2.5" />
        <circle cx="61" cy="222" r="2" />
        <circle cx="410" cy="51" r="2" />
        <circle cx="137" cy="47" r="2.5" />
      </g>
      <g transform="translate(82 212)">
        <ellipse cx="52" cy="142" rx="58" ry="14" fill="#141b27" opacity=".38" />
        <rect x="25" y="54" width="54" height="87" rx="11" fill="#e8d5a6" />
        <path d="M52 13c15 17 19 28 9 38-5 5-13 5-18 0-10-10-6-21 9-38Z" fill="#f1a84b" />
        <path d="M52 27c6 7 8 12 4 16-2 2-6 2-8 0-4-4-2-9 4-16Z" fill="#fff3b3" />
      </g>
      <g transform="translate(385 220)">
        <ellipse cx="47" cy="134" rx="55" ry="13" fill="#141b27" opacity=".38" />
        <rect x="21" y="51" width="52" height="82" rx="10" fill="#f3e2b7" />
        <path d="M47 12c14 16 18 27 9 36-5 5-13 5-18 0-9-9-5-20 9-36Z" fill="#e99a3c" />
        <path d="M47 25c6 7 8 11 4 15-2 2-6 2-8 0-4-4-2-8 4-15Z" fill="#fff1a8" />
      </g>
      <g transform="translate(205 82)">
        <ellipse cx="75" cy="281" rx="83" ry="18" fill="#141b27" opacity=".46" />
        <rect x="31" y="95" width="88" height="184" rx="16" fill="url(#wax)" />
        <path d="M75 7c24 27 31 45 15 61-8 8-22 8-30 0C44 52 51 34 75 7Z" fill="#f2a53e" />
        <path d="M75 30c10 12 13 20 6 27-3 4-9 4-13 0-7-7-3-15 7-27Z" fill="#fff6bc" />
        <path d="M31 132c16 8 29 8 41 1 15-9 30-9 47 0" stroke="#d49a3d" strokeWidth="3" />
      </g>
      <g opacity=".78">
        <circle cx="134" cy="225" r="75" fill="url(#centralGlow)" />
        <circle cx="432" cy="232" r="70" fill="url(#centralGlow)" />
      </g>
    </svg>
  );
}

export function CandleAmbience({ className }: { className?: string }) {
  return (
    <div
      className={
        className ? `candle-ambience ${className}` : "candle-ambience"
      }
      aria-hidden="true"
    >
      <svg className="candle-ambience-art" viewBox="0 0 280 240" fill="none">
        <defs>
          <radialGradient id="ambientGlow">
            <stop stopColor="#e8a13f" stopOpacity=".42" />
            <stop offset=".45" stopColor="#e8a13f" stopOpacity=".12" />
            <stop offset="1" stopColor="#e8a13f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ambientWax" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#e7c88a" />
            <stop offset="1" stopColor="#d8ae68" />
          </linearGradient>
        </defs>
        <circle cx="150" cy="118" r="120" fill="url(#ambientGlow)" />
        <g transform="translate(36 96)">
          <rect width="40" height="126" rx="10" y="8" fill="url(#ambientWax)" />
          <path
            className="candle-ambience-flame"
            d="M20 -18c11 13 14 21 7 28-4 4-10 4-14 0-7-7-4-15 7-28Z"
            fill="#e59a35"
          />
        </g>
        <g transform="translate(112 52)">
          <rect width="48" height="170" rx="12" y="10" fill="url(#ambientWax)" />
          <path
            className="candle-ambience-flame candle-ambience-flame-slow"
            d="M24 -24c14 17 18 27 9 36-5 5-13 5-18 0-9-9-5-19 9-36Z"
            fill="#e08f2b"
          />
          <path
            d="M2 76c14 7 26 7 37 1 13-8 27-8 41 0"
            stroke="#c98f37"
            strokeOpacity=".5"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(196 110)">
          <rect width="36" height="112" rx="9" y="8" fill="url(#ambientWax)" />
          <path
            className="candle-ambience-flame candle-ambience-flame-fast"
            d="M18 -16c10 12 13 19 6 26-3 4-9 4-13 0-6-7-3-14 7-26Z"
            fill="#e59a35"
          />
        </g>
      </svg>
    </div>
  );
}

