import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type SpringCfg = {damping: number; stiffness: number; mass: number};
export type From = 'below' | 'above' | 'left' | 'right' | 'none';

const offsetOf = (from: From, d: number) =>
  from === 'below' ? {x: 0, y: d} : from === 'above' ? {x: 0, y: -d} : from === 'left' ? {x: -d, y: 0} : from === 'right' ? {x: d, y: 0} : {x: 0, y: 0};

export const useSpringAt = (at: number, cfg: SpringCfg = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: cfg});
};

/** Idle micro-motion for anything that stays on screen. */
export const useBreath = (amp = 0.012, period = 24, phase = 0) => {
  const frame = useCurrentFrame();
  return 1 + Math.sin(frame / period + phase) * amp;
};
export const useFloat = (px = 5, period = 32, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / period + phase) * px;
};

/** Premium entrance: opacity + translate + scale, spring-driven. */
export const Pop: React.FC<{
  at: number;
  from?: From;
  dist?: number;
  scaleFrom?: number;
  cfg?: SpringCfg;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({at, from = 'below', dist = 40, scaleFrom = 0.94, cfg = theme.spring.smooth, style, children}) => {
  const p = useSpringAt(at, cfg);
  const o = offsetOf(from, dist);
  return (
    <div
      style={{
        opacity: Math.min(1, Math.max(0, p * 1.25)),
        transform: `translate(${(1 - p) * o.x}px, ${(1 - p) * o.y}px) scale(${scaleFrom + (1 - scaleFrom) * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Word-by-word staggered reveal. Splits ONLY on spaces — never inside a word,
 * so Bengali conjuncts / kar-marks / ref never break.
 */
export const Words: React.FC<{
  text: string;
  at: number;
  per?: number;
  gap?: number;
  cfg?: SpringCfg;
  style?: React.CSSProperties;
  wordStyle?: (word: string, i: number) => React.CSSProperties;
}> = ({text, at, per = 4, gap = 24, cfg = theme.spring.snappy, style, wordStyle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ').filter(Boolean);
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: gap, rowGap: 0, ...style}}>
      {words.map((w, i) => {
        const p = spring({frame: frame - at - i * per, fps, config: cfg});
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              opacity: Math.min(1, Math.max(0, p * 1.3)),
              transform: `translateY(${(1 - p) * 38}px) scale(${0.9 + 0.1 * p})`,
              ...(wordStyle ? wordStyle(w, i) : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Hero-coloured highlight pill that sweeps in behind a word. */
export const Highlight: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [at, at + 14], [0, 1], {
    easing: theme.ease.out,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <span style={{position: 'relative', display: 'inline-block', isolation: 'isolate', padding: '0 22px', ...style}}>
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '10%',
          bottom: '4%',
          borderRadius: theme.radius.md,
          background: theme.colors.hero,
          boxShadow: theme.shadow.glowHero,
          transformOrigin: 'left center',
          transform: `scaleX(${sweep})`,
          zIndex: -1,
        }}
      />
      {children}
    </span>
  );
};

/** Gradient keyword text (hero → accent). */
export const gradientText: React.CSSProperties = {
  background: theme.gradient.hero,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};
