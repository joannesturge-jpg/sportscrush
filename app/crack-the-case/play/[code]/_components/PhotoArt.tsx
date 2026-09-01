import { EvidenceItem } from "@/lib/game/types";

type Scene = NonNullable<EvidenceItem["photo"]>["scene"];

const SKY: Record<Scene, [string, string]> = {
  driveway: ["#2a1a4a", "#5b3a86"],
  porch: ["#ff8b3d", "#ff2fb0"],
  "traffic-cam": ["#1a1a1a", "#2c2c2c"],
  "crime-scene": ["#232323", "#3a3226"],
  "prom-photo": ["#3a2110", "#6b3a1a"],
  map: ["#e8dcc0", "#cbb98f"],
  school: ["#1a1030", "#2f1c4a"],
};

function Figure({ x, fill = "#1c1024" }: { x: number; fill?: string }) {
  return (
    <g transform={`translate(${x},0)`}>
      <circle cx="0" cy="42" r="9" fill={fill} />
      <path d="M -10 60 Q 0 50 10 60 L 13 95 L -13 95 Z" fill={fill} />
    </g>
  );
}

export default function PhotoArt({ scene }: { scene: Scene }) {
  const [c1, c2] = SKY[scene];

  return (
    <svg viewBox="0 0 240 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`grad-${scene}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="240" height="180" fill={`url(#grad-${scene})`} />

      {scene === "porch" && (
        <>
          <rect x="0" y="120" width="240" height="60" fill="#3a2416" />
          <rect x="20" y="60" width="200" height="70" fill="#4a2f1c" />
          <circle cx="120" cy="88" r="10" fill="#f3d9c4" />
          <path d="M 90 100 Q 120 88 150 100 L 158 160 L 82 160 Z" fill="#ffd7ea" />
          <rect x="105" y="118" width="10" height="18" fill="#ffe9c8" />
        </>
      )}

      {scene === "driveway" && (
        <>
          <rect x="0" y="130" width="240" height="50" fill="#241536" />
          <rect x="140" y="95" width="80" height="34" rx="6" fill="#1c1024" />
          <circle cx="155" cy="130" r="8" fill="#0a0612" />
          <circle cx="205" cy="130" r="8" fill="#0a0612" />
          <rect x="196" y="105" width="18" height="7" fill="#ffd23f" opacity="0.8" />
          <Figure x="40" fill="#3a2350" />
          <Figure x="65" fill="#3a2350" />
          <Figure x="90" fill="#3a2350" />
        </>
      )}

      {scene === "traffic-cam" && (
        <>
          <rect x="0" y="0" width="240" height="180" fill="#161616" />
          <rect x="0" y="140" width="240" height="40" fill="#202020" />
          <Figure x="120" fill="#e5e5e5" />
          <rect x="170" y="110" width="46" height="20" rx="3" fill="#4a4a4a" />
          <circle cx="180" cy="130" r="5" fill="#161616" />
          <circle cx="208" cy="130" r="5" fill="#161616" />
          <text x="10" y="20" fontSize="10" fill="#e5e5e5" fontFamily="monospace">
            CAM 07 — MAPLE ST
          </text>
        </>
      )}

      {scene === "map" && (
        <>
          <rect x="14" y="14" width="212" height="152" fill="none" stroke="#5c4a2e" strokeWidth="2" />
          <line x1="14" y1="60" x2="226" y2="60" stroke="#8a7550" strokeWidth="1.5" />
          <line x1="120" y1="14" x2="120" y2="166" stroke="#8a7550" strokeWidth="1.5" />
          <path d="M 60 30 L 60 90 L 150 90 L 150 140" stroke="#c23b3b" strokeWidth="3" fill="none" strokeDasharray="1 0" />
          <circle cx="60" cy="30" r="5" fill="#3a2f1a" />
          <circle cx="150" cy="140" r="5" fill="#3a2f1a" />
          <text x="24" y="28" fontSize="9" fill="#3a2f1a" fontFamily="monospace">
            RIDGEVIEW
          </text>
        </>
      )}

      {scene === "school" && (
        <>
          <rect x="0" y="110" width="240" height="70" fill="#120a20" />
          <rect x="30" y="40" width="180" height="80" fill="#1e1436" />
          <rect x="100" y="20" width="40" height="20" fill="#241a42" />
          <rect x="55" y="60" width="18" height="26" fill="#ffd23f" opacity="0.7" />
          <rect x="90" y="60" width="18" height="26" fill="#ffd23f" opacity="0.4" />
          <rect x="130" y="60" width="18" height="26" fill="#ffd23f" opacity="0.7" />
          <rect x="165" y="60" width="18" height="26" fill="#ffd23f" opacity="0.4" />
          <Figure x="120" fill="#0b0612" />
        </>
      )}

      {scene === "crime-scene" && (
        <>
          <rect x="0" y="120" width="240" height="60" fill="#2b271c" />
          <path d="M 10 165 Q 90 140 230 168" stroke="#171410" strokeWidth="4" fill="none" strokeDasharray="10 8" />
          <rect x="95" y="128" width="30" height="18" fill="#ffb8dd" transform="rotate(-8 110 137)" />
          <rect x="98" y="131" width="24" height="12" fill="#f4ecd8" opacity="0.5" transform="rotate(-8 110 137)" />
        </>
      )}

      {scene === "prom-photo" && (
        <>
          <rect x="0" y="130" width="240" height="50" fill="#1c1024" />
          <rect x="150" y="95" width="60" height="36" fill="#5b3a1a" />
          <ellipse cx="168" cy="98" rx="16" ry="6" fill="#d9a86b" />
          <ellipse cx="196" cy="100" rx="7" ry="10" fill="#ff6fc9" opacity="0.8" />
          <Figure x="40" fill="#e9dcc8" />
          <Figure x="65" fill="#e9dcc8" />
          <Figure x="90" fill="#e9dcc8" />
          <circle cx="30" cy="20" r="14" fill="#ffd23f" opacity="0.6" />
        </>
      )}
    </svg>
  );
}
