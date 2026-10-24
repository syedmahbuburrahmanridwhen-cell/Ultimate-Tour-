import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {CLAMP} from './motion';

/** Soft diagonal light band that crosses the frame at each scene boundary. */
export const Sweep: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 16], [0, 1], {easing: theme.ease.inOut, ...CLAMP});
  const x = -700 + p * 3300;
  const op = Math.sin(Math.PI * p) * 0.6;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          top: -200,
          bottom: -200,
          width: 520,
          left: x,
          opacity: op,
          transform: 'skewX(-14deg)',
          background: `linear-gradient(90deg, transparent, ${theme.colors.heroGlow}, transparent)`,
          filter: 'blur(24px)',
        }}
      />
    </AbsoluteFill>
  );
};
