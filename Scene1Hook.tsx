import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {T, S} from '../beats';
import {Bar, Chip, Window} from '../components/ui';
import {CLAMP, Pop, Words, gradientText, useBreath, useSpringAt} from '../components/motion';
import {SceneShell} from '../components/SceneShell';

// Scene 1 — HOOK. Kinetic typography over a wireframe site that a magnifier is "searching".
export const Scene1Hook: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const t = (abs: number) => abs - S[0];
  const hl = t(T.s1.headline);

  const dim = interpolate(f, [hl - 4, hl + 14], [1, 0.26], {easing: theme.ease.out, ...CLAMP});
  const blur = interpolate(f, [hl - 4, hl + 14], [0, 3], CLAMP);
  const magOp = interpolate(f, [hl - 6, hl + 8], [1, 0], CLAMP);
  const magIn = useSpringAt(4, theme.spring.bouncy);
  const mx = 960 + 330 * Math.sin(f / 34);
  const my = 640 + 80 * Math.cos(f / 23);
  const breath = useBreath(0.008, 26);

  return (
    <SceneShell dur={dur}>
      {/* wireframe site being "searched" */}
      <div style={{position: 'absolute', left: 460, top: 200, opacity: dim, filter: `blur(${blur}px)`}}>
        <Pop at={0} dist={60} scaleFrom={0.9}>
          <Window width={1000} height={620}>
            <div style={{position: 'absolute', inset: 0, padding: 30, display: 'flex', flexDirection: 'column', gap: 24}}>
              <Pop at={6} scaleFrom={0.92}>
                <div style={{height: 200, borderRadius: 20, background: theme.gradient.thumb}} />
              </Pop>
              <div style={{display: 'flex', gap: 24}}>
                {[0, 1, 2].map((i) => (
                  <Pop key={i} at={12 + i * 5} scaleFrom={0.9}>
                    <div style={{width: 292, height: 170, borderRadius: 20, background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, padding: 24}}>
                      <Bar w="70%" h={16} />
                      <Bar w="45%" h={16} style={{marginTop: 16}} />
                    </div>
                  </Pop>
                ))}
              </div>
              <Pop at={30}>
                <Bar w="60%" h={18} />
              </Pop>
            </div>
          </Window>
        </Pop>
      </div>

      {/* magnifier */}
      <div style={{position: 'absolute', left: mx - 95, top: my - 95, opacity: magOp * Math.min(1, magIn), transform: `scale(${0.6 + 0.4 * magIn})`}}>
        <svg width={190} height={190} viewBox="0 0 190 190" style={{filter: `drop-shadow(0 0 24px ${theme.colors.accentGlow})`}}>
          <circle cx={80} cy={80} r={62} fill={theme.colors.accentSoft} stroke={theme.colors.accent} strokeWidth={10} />
          <path d="M126 126L176 176" stroke={theme.colors.accent} strokeWidth={16} strokeLinecap="round" />
        </svg>
      </div>

      {/* kinetic headline */}
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${breath})`}}>
        <div style={{display: 'flex', gap: 24, marginBottom: 34}}>
          <Pop at={t(T.s1.chipBusiness)} cfg={theme.spring.bouncy} dist={30}>
            <Chip label="Business" icon={<div style={{width: 14, height: 14, borderRadius: 7, background: theme.colors.accent}} />} />
          </Pop>
          <Pop at={t(T.s1.chipPersonal)} cfg={theme.spring.bouncy} dist={30}>
            <Chip label="Personal Brand" icon={<div style={{width: 14, height: 14, borderRadius: 7, background: theme.colors.accent}} />} />
          </Pop>
        </div>
        <Words
          text="Professional Website"
          at={hl}
          per={5}
          gap={34}
          cfg={theme.spring.bouncy}
          style={{justifyContent: 'center'}}
          wordStyle={(w) =>
            w === 'Website'
              ? {fontSize: 156, fontWeight: theme.weight.display, lineHeight: 1.12, filter: `drop-shadow(0 0 34px ${theme.colors.heroGlow})`, ...gradientText}
              : {fontSize: 156, fontWeight: theme.weight.display, lineHeight: 1.12, color: theme.colors.text}
          }
        />
        <Pop at={t(T.s1.question)} cfg={theme.spring.bouncy} dist={30}>
          <div style={{fontSize: 96, fontWeight: theme.weight.strong, color: theme.colors.text, lineHeight: 1.25, marginTop: 4}}>খুঁজছেন?</div>
        </Pop>
      </AbsoluteFill>
    </SceneShell>
  );
};
