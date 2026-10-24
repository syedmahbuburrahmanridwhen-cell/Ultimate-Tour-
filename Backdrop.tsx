import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {theme} from '../theme';

// Layer 1 — animated background mesh + faint dot grid (never a flat colour).
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  const d3 = Math.sin(frame / 90 + 1) * 40;
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${theme.colors.bg} 0%, ${theme.colors.bgAlt} 100%)`}}>
      <div
        style={{
          position: 'absolute',
          width: 1300,
          height: 1300,
          borderRadius: '50%',
          top: -560 + d3,
          left: -380 + d1,
          filter: 'blur(60px)',
          background: `radial-gradient(circle, ${theme.colors.heroGlow}, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          bottom: -460,
          right: -300 - d2,
          filter: 'blur(70px)',
          background: `radial-gradient(circle, ${theme.colors.accentSoft}, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${theme.colors.textFaint} 1.5px, transparent 1.6px)`,
          backgroundSize: '64px 64px',
          backgroundPosition: `${(frame * 0.25) % 64}px ${(frame * 0.15) % 64}px`,
          opacity: 0.22,
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />
    </AbsoluteFill>
  );
};

// Layer 4 — colour grade (above content, below grain).
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill
      style={{backgroundColor: theme.colors.hero, mixBlendMode: 'soft-light', opacity: 0.2}}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.10), transparent 28%, transparent 72%, rgba(0,0,0,0.2))',
      }}
    />
  </AbsoluteFill>
);

// Layer 5a — procedural film grain (no asset file).
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: noise,
        backgroundSize: '220px',
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// Layer 5b — vignette (topmost).
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.3) 100%)',
    }}
  />
);
