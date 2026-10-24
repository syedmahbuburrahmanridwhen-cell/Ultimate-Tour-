import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {T, S} from '../beats';
import {CLAMP, Pop, Words, gradientText, useBreath, useFloat} from '../components/motion';
import {SceneShell} from '../components/SceneShell';

// Scene 7 — STATEMENT CARD. Calm, final CTA. No exit: the video ends on this frame.
export const Scene7End: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const t = (abs: number) => abs - S[6];
  const m = t(T.s7.main);
  const breath = useBreath(0.01, 20);
  const orb = useFloat(10, 26);
  const underline = interpolate(f, [m + 10, m + 26], [0, 1], {easing: theme.ease.out, ...CLAMP});

  return (
    <SceneShell dur={dur} exit={false}>
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{position: 'absolute', width: 760, height: 760, borderRadius: '50%', background: `radial-gradient(circle, ${theme.colors.heroGlowSoft}, transparent 65%)`, transform: `translateY(${orb}px) scale(${breath})`}} />
        <div style={{transform: `scale(${breath})`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Words
            text="যোগাযোগ করুন"
            at={m}
            per={5}
            gap={44}
            cfg={theme.spring.bouncy}
            style={{justifyContent: 'center'}}
            wordStyle={(w) =>
              w === 'করুন'
                ? {fontSize: 220, fontWeight: theme.weight.display, lineHeight: 1.2, filter: `drop-shadow(0 0 36px ${theme.colors.heroGlow})`, ...gradientText}
                : {fontSize: 220, fontWeight: theme.weight.display, lineHeight: 1.2, color: theme.colors.text}
            }
          />
          <div style={{width: 600, height: 6, borderRadius: 3, background: theme.colors.accent, transformOrigin: 'center', transform: `scaleX(${underline})`, margin: '10px 0 26px', boxShadow: theme.shadow.glowAccent}} />
          <Pop at={t(T.s7.thanks)} cfg={theme.spring.bouncy} dist={30}>
            <div style={{fontSize: 112, fontWeight: theme.weight.strong, color: theme.colors.accent, lineHeight: 1.2}}>ধন্যবাদ</div>
          </Pop>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
