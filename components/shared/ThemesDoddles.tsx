"use client";

import { useTheme } from "@/lib/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeDoodles() {
  const theme = useTheme();
  const [comfort, setComfort] = useState<string>("spiritual");

  useEffect(() => {
    const saved = localStorage.getItem("sanctuary_comfort") || "spiritual";
    setComfort(saved);
  }, []);

  const color = theme.accent;
  const opacity = 0.07; 

  return (
    <svg
      style={{
        position: "fixed",   // Fixed so it stays as you scroll
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",  // Clicks pass through to content below
        zIndex: 0,              // Behind all content
        overflow: "hidden",
      }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 800"
    >
      {comfort === "spiritual" && <SpiritualDoodles color={color} opacity={opacity} />}
      {comfort === "nature"    && <NatureDoodles    color={color} opacity={opacity} />}
      {comfort === "practical" && <PracticalDoodles color={color} opacity={opacity} />}
      {comfort === "community" && <CommunityDoodles color={color} opacity={opacity} />}
    </svg>
  );
}


function SpiritualDoodles({ color, opacity }: { color: string; opacity: number }) {
  return (
    <g stroke={color} fill="none" opacity={opacity} strokeWidth="1">

      {/* Top left — large crescent */}
      <path d="M80 120 Q120 80 160 120 Q120 160 80 120Z" strokeWidth="1.5"/>
      <path d="M95 120 Q120 95 145 120 Q120 145 95 120Z" fill={color} stroke="none"/>

      {/* Top right — mandala-like circle */}
      <circle cx="1100" cy="80" r="40"/>
      <circle cx="1100" cy="80" r="28"/>
      <circle cx="1100" cy="80" r="16"/>
      <line x1="1060" y1="80" x2="1140" y2="80"/>
      <line x1="1100" y1="40" x2="1100" y2="120"/>
      <line x1="1072" y1="52" x2="1128" y2="108"/>
      <line x1="1128" y1="52" x2="1072" y2="108"/>

      {/* Stars scattered */}
      <StarShape cx={300} cy={60}  r={6} color={color}/>
      <StarShape cx={900} cy={200} r={4} color={color}/>
      <StarShape cx={200} cy={400} r={5} color={color}/>
      <StarShape cx={1050} cy={500} r={7} color={color}/>
      <StarShape cx={600} cy={700} r={4} color={color}/>

      {/* Bottom left — geometric diamond */}
      <polygon points="100,700 140,660 180,700 140,740" strokeWidth="1.5"/>
      <polygon points="115,700 140,675 165,700 140,725"/>

      {/* Bottom right — crescent small */}
      <path d="M1050 680 Q1080 650 1110 680 Q1080 710 1050 680Z" strokeWidth="1.5"/>

      {/* Middle left — dotted arc */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 7) * Math.PI;
        const x = 50 + Math.cos(angle) * 60;
        const y = 350 - Math.sin(angle) * 60;
        return <circle key={i} cx={x} cy={y} r="2" fill={color} stroke="none"/>;
      })}

    </g>
  );
}

function NatureDoodles({ color, opacity }: { color: string; opacity: number }) {
  return (
    <g stroke={color} fill="none" opacity={opacity} strokeWidth="1">

      {/* Top left — branch with leaves */}
      <path d="M40 40 Q80 100 60 180"/>
      <path d="M60 80  Q100 60 120 80"/>
      <path d="M55 120 Q85 95  110 105"/>
      <path d="M52 155 Q75 130 95  140"/>
      {/* Leaf shapes off branch */}
      <ellipse cx="120" cy="80"  rx="12" ry="6" transform="rotate(-30 120 80)"/>
      <ellipse cx="110" cy="105" rx="10" ry="5" transform="rotate(-20 110 105)"/>
      <ellipse cx="95"  cy="140" rx="9"  ry="5" transform="rotate(-10 95 140)"/>

      {/* Top right — flower */}
      <FlowerShape cx={1080} cy={100} r={30} color={color}/>

      {/* Bottom left — dewdrops */}
      {[120, 150, 180].map((x, i) => (
        <path key={i} d={`M${x} 720 Q${x+8} 700 ${x+16} 720 Q${x+8} 740 ${x} 720`}
          fill={color} stroke="none" opacity={0.5}/>
      ))}

      {/* Bottom right — branch growing up */}
      <path d="M1150 800 Q1130 720 1150 640"/>
      <path d="M1145 720 Q1110 700 1090 715"/>
      <path d="M1148 680 Q1115 655 1095 665"/>
      <ellipse cx="1090" cy="715" rx="11" ry="5" transform="rotate(20 1090 715)"/>
      <ellipse cx="1095" cy="665" rx="10" ry="5" transform="rotate(15 1095 665)"/>

      {/* Middle scattered leaves */}
      <ellipse cx="200"  cy="500" rx="14" ry="6" transform="rotate(-45 200 500)"/>
      <ellipse cx="1000" cy="350" rx="12" ry="5" transform="rotate(30 1000 350)"/>
      <ellipse cx="700"  cy="100" rx="10" ry="4" transform="rotate(-20 700 100)"/>

      {/* Small flower bottom center */}
      <FlowerShape cx={600} cy={750} r={18} color={color}/>

    </g>
  );
}

function PracticalDoodles({ color, opacity }: { color: string; opacity: number }) {
  return (
    <g stroke={color} fill="none" opacity={opacity}>

      {/* Dot grid — top right corner */}
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={1050 + col * 22}
            cy={50  + row * 22}
            r="2"
            fill={color}
            stroke="none"
          />
        ))
      )}

      {/* Dot grid — bottom left corner */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <circle
            key={`bl-${row}-${col}`}
            cx={40  + col * 22}
            cy={660 + row * 22}
            r="2"
            fill={color}
            stroke="none"
          />
        ))
      )}

      {/* Clean corner bracket — top left */}
      <path d="M40 40 L40 100 M40 40 L100 40" strokeWidth="1.5"/>

      {/* Clean corner bracket — bottom right */}
      <path d="M1160 760 L1160 700 M1160 760 L1100 760" strokeWidth="1.5"/>

      {/* Horizontal rule lines — left side */}
      <line x1="40"  y1="200" x2="120" y2="200" strokeWidth="0.8"/>
      <line x1="40"  y1="220" x2="100" y2="220" strokeWidth="0.8"/>
      <line x1="40"  y1="240" x2="80"  y2="240" strokeWidth="0.8"/>

      {/* Horizontal rule lines — right side */}
      <line x1="1080" y1="400" x2="1160" y2="400" strokeWidth="0.8"/>
      <line x1="1100" y1="420" x2="1160" y2="420" strokeWidth="0.8"/>
      <line x1="1120" y1="440" x2="1160" y2="440" strokeWidth="0.8"/>

      {/* Small squares */}
      <rect x="60"   y="500" width="16" height="16" strokeWidth="1"/>
      <rect x="84"   y="500" width="10" height="10" strokeWidth="0.8"/>
      <rect x="1100" y="600" width="20" height="20" strokeWidth="1"/>
      <rect x="1128" y="608" width="12" height="12" strokeWidth="0.8"/>

    </g>
  );
}

function CommunityDoodles({ color, opacity }: { color: string; opacity: number }) {
  return (
    <g stroke={color} fill="none" opacity={opacity} strokeWidth="1">

      {/* Speech bubble — top left */}
      <rect x="40" y="50" width="90" height="55" rx="12" strokeWidth="1.5"/>
      <path d="M60 105 L50 125 L80 105" strokeWidth="1.5"/>
      {/* Dots inside bubble */}
      <circle cx="70"  cy="77" r="4" fill={color} stroke="none"/>
      <circle cx="85"  cy="77" r="4" fill={color} stroke="none"/>
      <circle cx="100" cy="77" r="4" fill={color} stroke="none"/>

      {/* Smaller speech bubble — top right */}
      <rect x="1060" y="60" width="70" height="44" rx="10" strokeWidth="1.2"/>
      <path d="M1110 104 L1120 118 L1095 104" strokeWidth="1.2"/>
      <circle cx="1080" cy="82" r="3" fill={color} stroke="none"/>
      <circle cx="1093" cy="82" r="3" fill={color} stroke="none"/>
      <circle cx="1106" cy="82" r="3" fill={color} stroke="none"/>

      {/* Connection lines with dots — left side */}
      <circle cx="60"  cy="300" r="6" fill={color} stroke="none"/>
      <circle cx="60"  cy="340" r="6" fill={color} stroke="none"/>
      <circle cx="60"  cy="380" r="6" fill={color} stroke="none"/>
      <path d="M60 306 Q80 320 60 334" strokeWidth="1" strokeDasharray="3 2"/>
      <path d="M60 346 Q80 360 60 374" strokeWidth="1" strokeDasharray="3 2"/>

      {/* Wavy line — bottom */}
      <path d="M200 740 Q250 720 300 740 Q350 760 400 740 Q450 720 500 740 Q550 760 600 740"
        strokeWidth="1.2"/>

      {/* Heart shape — bottom right (community = warmth) */}
      <path d="M1100 700 Q1100 680 1120 680 Q1140 680 1140 700 Q1140 720 1120 740 Q1100 720 1100 700Z"
        strokeWidth="1.5"/>

      {/* Small circles scattered — feeling of people */}
      <circle cx="400" cy="80"  r="8"  strokeWidth="1"/>
      <circle cx="420" cy="80"  r="5"  strokeWidth="1"/>
      <circle cx="800" cy="700" r="10" strokeWidth="1"/>
      <circle cx="822" cy="700" r="6"  strokeWidth="1"/>

    </g>
  );
}

// 6-pointed star
function StarShape({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  const points = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * Math.PI) / 3 - Math.PI / 6;
    const inner = r * 0.4;
    const outerX = cx + r     * Math.cos(angle);
    const outerY = cy + r     * Math.sin(angle);
    const innerX = cx + inner * Math.cos(angle + Math.PI / 6);
    const innerY = cy + inner * Math.sin(angle + Math.PI / 6);
    return `${outerX},${outerY} ${innerX},${innerY}`;
  }).join(" ");
  return <polygon points={points} stroke={color} fill="none" strokeWidth="1"/>;
}

// Simple 5-petal flower
function FlowerShape({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 5;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        return (
          <ellipse
            key={i}
            cx={(cx + px) / 2}
            cy={(cy + py) / 2}
            rx={r * 0.45}
            ry={r * 0.2}
            transform={`rotate(${(angle * 180) / Math.PI} ${(cx + px) / 2} ${(cy + py) / 2})`}
            stroke={color}
            fill="none"
            strokeWidth="1"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.2} stroke={color} fill="none" strokeWidth="1"/>
    </g>
  );
}