import type { GuardianId } from '../types';

/**
 * UI-AAA-02C — visual-only preview. Independent of combat and simulation.
 * Each guardian has its own silhouette, energy signature and head direction.
 */
type GuardianArt = {
  body: string;
  x: number;
  y: number;
  angle: number;
  energy: string;
  highlight: string;
  background: string;
  symbol: string;
};

const GUARDIAN_ART: Record<GuardianId, GuardianArt> = {
  FOTON: {
    body: 'M 76 303 C 66 235 182 275 195 164 C 215 67 350 71 344 177 C 338 280 475 262 515 145',
    x: 515, y: 145, angle: -46, energy: '#fbbf24', highlight: '#fff4ba', background: '#6d3d09', symbol: '☀',
  },
  HYDRO: {
    body: 'M 66 294 C 145 330 144 170 231 178 C 330 188 331 302 418 237 C 469 202 448 103 523 140',
    x: 523, y: 140, angle: -17, energy: '#38bdf8', highlight: '#e4fcff', background: '#06356b', symbol: '≈',
  },
  AERO: {
    body: 'M 72 299 C 156 260 134 148 265 129 C 351 117 346 230 446 187 C 497 165 506 108 553 118',
    x: 553, y: 118, angle: -15, energy: '#5eead4', highlight: '#f1ffff', background: '#035b63', symbol: '➤',
  },
  TERMO: {
    body: 'M 74 315 C 129 245 224 280 221 187 C 216 92 369 48 387 171 C 399 287 478 279 537 155',
    x: 537, y: 155, angle: -49, energy: '#ff6a2a', highlight: '#ffe1ab', background: '#78200b', symbol: '✦',
  },
  MAGNE: {
    body: 'M 72 308 C 94 207 243 275 257 174 C 267 98 373 52 411 150 C 450 265 493 257 540 131',
    x: 540, y: 131, angle: -49, energy: '#a78bfa', highlight: '#f4dfff', background: '#3d176d', symbol: '⟡',
  },
  ATON: {
    body: 'M 76 311 C 88 220 205 266 233 154 C 257 70 387 85 392 180 C 396 269 497 269 553 151',
    x: 553, y: 151, angle: -42, energy: '#d9ff5a', highlight: '#faffcb', background: '#4b6207', symbol: '⚛',
  },
};

export const GUARDIAN_SIGILS: Record<GuardianId, string> = {
  FOTON: '☀',
  HYDRO: '≈',
  AERO: '➤',
  TERMO: '✦',
  MAGNE: '⟡',
  ATON: '⚛',
};

export function GuardianShowcaseArt({ guardianId }: { guardianId: GuardianId }) {
  const art = GUARDIAN_ART[guardianId];
  const headTransform = 'translate(' + art.x + ' ' + art.y + ') rotate(' + art.angle + ')';
  return (
    <svg
      key={guardianId}
      className={'orbi-serpent-silhouette orbi-guardian-art orbi-guardian-art--' + guardianId.toLowerCase()}
      viewBox="0 0 640 395"
      role="img"
      aria-label={'Vista artística de la serpiente energética ' + guardianId}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="orbiGuardianMetal" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={art.highlight} />
          <stop offset=".40" stopColor={art.energy} />
          <stop offset=".78" stopColor={art.background} />
          <stop offset="1" stopColor={art.energy} />
        </linearGradient>
        <radialGradient id="orbiGuardianAura">
          <stop offset="0" stopColor={art.energy} stopOpacity=".44" />
          <stop offset="1" stopColor={art.energy} stopOpacity="0" />
        </radialGradient>
        <filter id="orbiGuardianBlur" x="-35%" y="-60%" width="170%" height="220%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
        <filter id="orbiGuardianSmallGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <ellipse cx="327" cy="208" rx="280" ry="171" fill="url(#orbiGuardianAura)" />
      <g className="orbi-guardian-art__orbit" opacity=".62" stroke={art.energy} fill="none">
        <ellipse cx="320" cy="207" rx="265" ry="116" strokeWidth="1.2" transform="rotate(-15 320 207)" />
        <ellipse cx="320" cy="207" rx="205" ry="148" strokeWidth=".8" transform="rotate(18 320 207)" />
      </g>
      <g className="orbi-guardian-art__sparks" fill={art.highlight}>
        <circle cx="86" cy="70" r="3" />
        <circle cx="184" cy="94" r="2.3" />
        <circle cx="296" cy="37" r="3.5" />
        <circle cx="484" cy="61" r="2.5" />
        <circle cx="574" cy="276" r="3.3" />
        <circle cx="130" cy="338" r="2.8" />
      </g>
      {guardianId === 'FOTON' && (
        <g stroke={art.highlight} fill="none" strokeWidth="2" opacity=".85">
          <circle cx="315" cy="180" r="54" strokeDasharray="7 14" />
          <path d="M315 115V130 M315 230V245 M250 180H265 M365 180H380" />
        </g>
      )}
      {guardianId === 'HYDRO' && (
        <g stroke={art.highlight} fill="none" opacity=".65" strokeWidth="3">
          <path d="M107 184 Q155 122 201 187 T298 187 M359 304 Q402 259 445 298" />
          <circle cx="177" cy="123" r="10" /><circle cx="463" cy="302" r="7" />
        </g>
      )}
      {guardianId === 'AERO' && (
        <g stroke={art.highlight} strokeWidth="3" opacity=".6" fill="none" strokeLinecap="round">
          <path d="M79 179L194 141 M112 213L224 178 M364 104L494 76 M409 127L532 101" />
        </g>
      )}
      {guardianId === 'TERMO' && (
        <g fill={art.energy} opacity=".8">
          <path d="M110 210L123 178 129 206 149 166 146 222Z M329 67L349 28 355 74 373 47 374 95Z M462 299L479 258 486 293Z" />
        </g>
      )}
      {guardianId === 'MAGNE' && (
        <g fill="none" stroke={art.highlight} opacity=".7">
          <ellipse cx="322" cy="184" rx="189" ry="61" strokeWidth="3" transform="rotate(25 322 184)" />
          <ellipse cx="322" cy="184" rx="142" ry="111" strokeWidth="1.5" transform="rotate(-23 322 184)" />
          <circle cx="322" cy="184" r="16" strokeWidth="4" />
        </g>
      )}
      {guardianId === 'ATON' && (
        <g fill="none" stroke={art.highlight} strokeWidth="2" opacity=".8">
          <ellipse cx="325" cy="185" rx="75" ry="33" transform="rotate(28 325 185)" />
          <ellipse cx="325" cy="185" rx="75" ry="33" transform="rotate(-28 325 185)" />
          <circle cx="325" cy="185" r="12" fill={art.energy} />
        </g>
      )}
      <g className="orbi-guardian-art__body">
        <path d={art.body} stroke={art.energy} strokeWidth="53" opacity=".44" fill="none" strokeLinecap="round" filter="url(#orbiGuardianBlur)" />
        <path d={art.body} stroke="#051122" strokeWidth="39" fill="none" strokeLinecap="round" />
        <path d={art.body} stroke="url(#orbiGuardianMetal)" strokeWidth="29" fill="none" strokeLinecap="round" />
        <path d={art.body} stroke={art.highlight} strokeWidth="4" opacity=".88" fill="none" strokeLinecap="round" />
        <path d={art.body} stroke="#ffffff" strokeWidth="2" opacity=".65" fill="none" strokeLinecap="round" strokeDasharray="2 26" />
      </g>
      <g transform={headTransform} className="orbi-guardian-art__head">
        <path d="M-32 -23 L-14 -32 L19 -24 L54 -9 L62 0 L53 13 L16 26 L-13 30 L-31 18 L-40 1 Z" fill="#051221" stroke={art.energy} strokeWidth="4" />
        <path d="M-21 -19 L16 -16 L45 -5 L18 1 L45 9 L14 17 L-21 18 L-9 0 Z" fill="url(#orbiGuardianMetal)" />
        <path d="M-20 -21 L-35 -45 L6 -29 M-12 24 L-28 45 L16 27" stroke={art.energy} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M19 -15 L36 -9 L21 -4 Z" fill="white" />
        <path d="M19 15 L36 9 L21 4 Z" fill="white" />
        <circle cx="43" cy="0" r="6.5" fill={art.highlight} filter="url(#orbiGuardianSmallGlow)" />
      </g>
      <g className="orbi-guardian-art__signature" aria-hidden="true">
        <circle cx="82" cy="72" r="30" fill="#020817" fillOpacity=".68" stroke={art.energy} strokeWidth="2" />
        <text x="82" y="83" textAnchor="middle" fontSize="32" fill={art.highlight} fontWeight="bold">{art.symbol}</text>
      </g>
    </svg>
  );
}
