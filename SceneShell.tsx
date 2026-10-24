import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {CLAMP} from './motion';
import {EXIT} from '../timing';

/** Wraps a scene: faster-than-entrance exit (opacity + scale + blur) over the last EXIT frames. */
export const SceneShell: React.FC<{dur: number; exit?: boolean; children: React.ReactNode}> = ({dur, exit = true, children}) => {
  const f = useCurrentFrame();
  const out = exit
    ? interpolate(f, [dur - EXIT, dur - 1], [0, 1], {easing: theme.ease.in, ...CLAMP})
    : 0;
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - out,
        transform: `scale(${1 + out * 0.05})`,
        filter: out > 0.01 ? `blur(${out * 8}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
