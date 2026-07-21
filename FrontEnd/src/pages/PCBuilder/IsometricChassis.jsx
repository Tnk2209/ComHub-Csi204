import React from 'react';

const ACTIVE_COLOR = 'var(--brand-blue, #0a84ff)';
const INACTIVE_COLOR = 'var(--app-border, #3a3a4a)';
const GLOW_FILTER = 'drop-shadow(0 0 6px rgba(10,132,255,0.5))';

function IsometricChassis({ selectedParts }) {
  const active = (key) => !!selectedParts[key];
  const color = (key) => active(key) ? ACTIVE_COLOR : INACTIVE_COLOR;
  const glow = (key) => active(key) ? GLOW_FILTER : 'none';

  return (
    <svg
      viewBox="0 0 380 420"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      role="img"
      aria-label="PC Case Isometric Blueprint"
    >
      <defs>
        <filter id="glow-blue">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Case body — isometric box (front face + side face + top face) */}
      <g data-component="case" data-active={String(active('case'))}>
        {/* Front face */}
        <polygon
          points="60,80 260,80 260,380 60,380"
          fill={active('case') ? 'rgba(10,132,255,0.04)' : 'rgba(255,255,255,0.02)'}
          stroke={color('case')}
          strokeWidth="2"
          style={{ filter: glow('case') }}
        />
        {/* Side face (right panel — perspective) */}
        <polygon
          points="260,80 340,40 340,340 260,380"
          fill={active('case') ? 'rgba(10,132,255,0.06)' : 'rgba(255,255,255,0.01)'}
          stroke={color('case')}
          strokeWidth="2"
          style={{ filter: glow('case') }}
        />
        {/* Top face */}
        <polygon
          points="60,80 140,40 340,40 260,80"
          fill={active('case') ? 'rgba(10,132,255,0.08)' : 'rgba(255,255,255,0.03)'}
          stroke={color('case')}
          strokeWidth="2"
          style={{ filter: glow('case') }}
        />
        {/* Glass panel lines on front */}
        <rect
          x="70" y="90" width="180" height="240" rx="4"
          fill="none"
          stroke={active('case') ? 'rgba(10,132,255,0.3)' : 'rgba(255,255,255,0.08)'}
          strokeWidth="1"
          strokeDasharray="4 2"
        />
      </g>

      {/* Motherboard — inside the glass panel area */}
      <g data-component="motherboard" data-active={String(active('motherboard'))}>
        <rect
          x="85" y="100" width="150" height="200" rx="3"
          fill={active('motherboard') ? 'rgba(10,132,255,0.06)' : 'rgba(255,255,255,0.02)'}
          stroke={color('motherboard')}
          strokeWidth="1.5"
          style={{ filter: glow('motherboard') }}
        />
        <text
          x="160" y="115" textAnchor="middle"
          fontSize="7" fontWeight="bold" fontFamily="monospace"
          fill={color('motherboard')}
          opacity="0.7"
        >
          {active('motherboard') ? 'MOTHERBOARD' : 'ATX SLOT'}
        </text>
      </g>

      {/* CPU — square on motherboard */}
      <g data-component="cpu" data-active={String(active('cpu'))}>
        <rect
          x="120" y="130" width="50" height="50" rx="4"
          fill={active('cpu') ? 'rgba(10,132,255,0.12)' : 'rgba(255,255,255,0.02)'}
          stroke={color('cpu')}
          strokeWidth="1.5"
          style={{ filter: glow('cpu') }}
        />
        {/* CPU heatsink lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={127 + i * 9} y1="135"
            x2={127 + i * 9} y2="175"
            stroke={color('cpu')}
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}
        <text
          x="145" y="158" textAnchor="middle"
          fontSize="8" fontWeight="bold" fontFamily="monospace"
          fill={color('cpu')}
        >
          CPU
        </text>
      </g>

      {/* RAM — 4 sticks next to CPU */}
      <g data-component="ram" data-active={String(active('ram'))}>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={185 + i * 7} y="125" width="4" height="55" rx="1"
            fill={active('ram') ? 'rgba(10,132,255,0.2)' : 'none'}
            stroke={color('ram')}
            strokeWidth="1"
            style={{ filter: glow('ram') }}
          />
        ))}
        <text
          x="199" y="192" textAnchor="middle"
          fontSize="6" fontWeight="bold" fontFamily="monospace"
          fill={color('ram')}
        >
          RAM
        </text>
      </g>

      {/* GPU — long card in PCIe area */}
      <g data-component="gpu" data-active={String(active('gpu'))}>
        <rect
          x="90" y="210" width="140" height="28" rx="3"
          fill={active('gpu') ? 'rgba(10,132,255,0.1)' : 'rgba(255,255,255,0.02)'}
          stroke={color('gpu')}
          strokeWidth="1.5"
          style={{ filter: glow('gpu') }}
        />
        {/* GPU fans */}
        <circle cx="125" cy="224" r="8" fill="none" stroke={color('gpu')} strokeWidth="0.8" opacity="0.6" />
        <circle cx="160" cy="224" r="8" fill="none" stroke={color('gpu')} strokeWidth="0.8" opacity="0.6" />
        <circle cx="195" cy="224" r="8" fill="none" stroke={color('gpu')} strokeWidth="0.8" opacity="0.6" />
        <text
          x="160" y="228" textAnchor="middle"
          fontSize="7" fontWeight="bold" fontFamily="monospace"
          fill={color('gpu')}
        >
          GPU
        </text>
      </g>

      {/* Storage — M.2 SSD small chip */}
      <g data-component="storage" data-active={String(active('storage'))}>
        <rect
          x="95" y="255" width="45" height="10" rx="2"
          fill={active('storage') ? 'rgba(10,132,255,0.15)' : 'none'}
          stroke={color('storage')}
          strokeWidth="1"
          style={{ filter: glow('storage') }}
        />
        <text
          x="117" y="263" textAnchor="middle"
          fontSize="6" fontWeight="bold" fontFamily="monospace"
          fill={color('storage')}
        >
          M.2
        </text>
      </g>

      {/* PSU — bottom compartment */}
      <g data-component="psu" data-active={String(active('psu'))}>
        {/* PSU shroud divider line */}
        <line
          x1="65" y1="320" x2="255" y2="320"
          stroke={color('psu')}
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity="0.5"
        />
        <rect
          x="80" y="335" width="160" height="35" rx="3"
          fill={active('psu') ? 'rgba(10,132,255,0.08)' : 'rgba(255,255,255,0.02)'}
          stroke={color('psu')}
          strokeWidth="1.5"
          style={{ filter: glow('psu') }}
        />
        {/* PSU fan */}
        <circle cx="160" cy="352" r="10" fill="none" stroke={color('psu')} strokeWidth="0.8" opacity="0.6" />
        <text
          x="160" y="356" textAnchor="middle"
          fontSize="7" fontWeight="bold" fontFamily="monospace"
          fill={color('psu')}
        >
          PSU
        </text>
      </g>

      {/* Front panel fans on side face */}
      {[100, 180, 260].map((cy, i) => (
        <circle
          key={i}
          cx="300" cy={cy} r="18"
          fill="none"
          stroke={active('case') ? ACTIVE_COLOR : INACTIVE_COLOR}
          strokeWidth="1"
          opacity="0.4"
        />
      ))}

      {/* Top exhaust fan */}
      <ellipse
        cx="200" cy="58"
        rx="25" ry="8"
        fill="none"
        stroke={active('case') ? ACTIVE_COLOR : INACTIVE_COLOR}
        strokeWidth="1"
        opacity="0.4"
      />
    </svg>
  );
}

export default IsometricChassis;
