import React from 'react';
import {theme} from '../theme';

export const GlassCard: React.FC<{style?: React.CSSProperties; children?: React.ReactNode}> = ({style, children}) => (
  <div
    style={{
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md,
      boxShadow: theme.shadow.card,
      backdropFilter: 'blur(18px)',
      position: 'relative',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Glossy app window (browser / editor / chat frame). */
export const Window: React.FC<{
  width: number;
  height: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({width, height, style, children}) => (
  <div
    style={{
      width,
      height,
      borderRadius: theme.radius.md,
      background: theme.colors.panel,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.card,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', flexShrink: 0, borderBottom: `1px solid ${theme.colors.border}`}}>
      {[0.5, 0.35, 0.22].map((o, i) => (
        <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: theme.colors.text, opacity: o}} />
      ))}
      <div style={{flex: 1, height: 26, marginLeft: 16, borderRadius: 13, background: theme.colors.surface}} />
    </div>
    <div style={{position: 'relative', flex: 1}}>{children}</div>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `linear-gradient(180deg, ${theme.colors.gloss}, transparent 28%)`,
      }}
    />
  </div>
);

export const Chip: React.FC<{icon?: React.ReactNode; label: string; style?: React.CSSProperties; size?: number}> = ({icon, label, style, size = 40}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 30px',
      borderRadius: theme.radius.pill,
      background: theme.colors.surfaceStrong,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.card,
      backdropFilter: 'blur(14px)',
      color: theme.colors.text,
      fontSize: size,
      fontWeight: theme.weight.strong,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export const Bar: React.FC<{w: number | string; h?: number; style?: React.CSSProperties}> = ({w, h = 14, style}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: theme.colors.surfaceStrong, ...style}} />
);

// ---------- icons: simple SVG strokes in theme colours (no emoji, no brand logos) ----------
type IconProps = {size?: number; color?: string; stroke?: number};
const Svg: React.FC<IconProps & {children: React.ReactNode; fill?: string}> = ({size = 48, color = theme.colors.text, stroke = 2, fill = 'none', children}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
    {children}
  </svg>
);
export const IconBolt: React.FC<IconProps> = (p) => (
  <Svg {...p} fill={p.color ?? theme.colors.accent} color={p.color ?? theme.colors.accent} stroke={1}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
  </Svg>
);
export const IconSpark: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent} fill={p.color ?? theme.colors.accent} stroke={1}>
    <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
  </Svg>
);
export const IconGrid: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);
export const IconCart: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21.5 8H6" />
  </Svg>
);
export const IconGlobe: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19" />
    <path d="M12 2.5c2.8 3 4 6 4 9.5s-1.2 6.5-4 9.5c-2.8-3-4-6-4-9.5s1.2-6.5 4-9.5z" />
  </Svg>
);
export const IconLink: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Svg>
);
export const IconChat: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);
export const IconShare: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </Svg>
);
export const IconSearch: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent}>
    <circle cx="11" cy="11" r="7.5" />
    <path d="M21 21l-4.6-4.6" />
  </Svg>
);
export const IconCheck: React.FC<IconProps> = (p) => (
  <Svg {...p} color={p.color ?? theme.colors.accent} stroke={p.stroke ?? 3}>
    <path d="M4 12.5l5 5L20 6.5" />
  </Svg>
);
export const Cursor: React.FC<{size?: number}> = ({size = 64}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.55))'}}>
    <path d="M4 2.5l15 8.2-6.4 2-2.6 6.6z" fill={theme.colors.text} stroke={theme.colors.bg} strokeWidth={1.2} strokeLinejoin="round" />
  </svg>
);
