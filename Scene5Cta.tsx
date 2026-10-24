import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {T, S} from '../beats';
import {Bar, Cursor, GlassCard, IconCheck, IconLink} from '../components/ui';
import {CLAMP, Highlight, Pop, useFloat, useSpringAt} from '../components/motion';
import {SceneShell} from '../components/SceneShell';

const CARD = {x: 370, y: 330, w: 1180, h: 540};
const PILL = {x: 48, y: 270, w: 640, h: 92};
const TARGET = {x: 860, y: 652}; // cursor tip lands inside the link pill
const START = {x: 1560, y: 940};

// Scene 5 — CTA 1. Description box → cursor clicks the link pill.
export const Scene5Cta: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const t = (abs: number) => abs - S[4];
  const h = t(T.s5.headline);
  const cardAt = t(T.s5.card);
  const click = t(T.s5.click);
  const move0 = click - 26;

  const travel = interpolate(f, [move0, click], [0, 1], {easing: theme.ease.inOut, ...CLAMP});
  const cx = START.x + (TARGET.x - START.x) * travel;
  const cy = START.y + (TARGET.y - START.y) * travel - Math.sin(Math.PI * travel) * 70;
  const curOp = interpolate(f, [move0 - 8, move0], [0, 1], CLAMP);
  const press = interpolate(f, [click, click + 4, click + 12], [1, 0.8, 1], {easing: theme.ease.out, ...CLAMP});
  const ring = interpolate(f, [click, click + 18], [0, 1], {easing: theme.ease.out, ...CLAMP});
  const active = interpolate(f, [click, click + 6], [0, 1], CLAMP);
  const check = useSpringAt(click + 4, theme.spring.bouncy);
  const float = useFloat(5, 34);

  return (
    <SceneShell dur={dur}>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30, fontSize: 130, fontWeight: theme.weight.display, color: theme.colors.text, lineHeight: 1.2}}>
          <Pop at={h} dist={40}>Link-এ</Pop>
          <Pop at={h + 4} dist={40} cfg={theme.spring.bouncy}>
            <Highlight at={click - 2}>Click</Highlight>
          </Pop>
          <Pop at={h + 8} dist={40}>করুন</Pop>
        </div>

        <div style={{position: 'absolute', left: CARD.x, top: CARD.y + float}}>
          <Pop at={cardAt} dist={70} scaleFrom={0.92}>
            <GlassCard style={{width: CARD.w, height: CARD.h, borderRadius: theme.radius.lg}}>
              <div style={{position: 'absolute', left: 48, top: 40, display: 'flex', alignItems: 'center', gap: 16}}>
                <IconLink size={40} color={theme.colors.textDim} />
                <span style={{fontSize: 40, fontWeight: theme.weight.body, color: theme.colors.textDim, lineHeight: 1.2}}>Description</span>
              </div>
              <div style={{position: 'absolute', left: 48, right: 48, top: 114, display: 'flex', flexDirection: 'column', gap: 22}}>
                {['86%', '72%', '58%'].map((w, i) => (
                  <Pop key={i} at={cardAt + 8 + i * 4} from="left" dist={30}>
                    <Bar w={w} h={20} />
                  </Pop>
                ))}
              </div>
              <div style={{position: 'absolute', left: PILL.x, top: PILL.y}}>
                <Pop at={cardAt + 22} dist={30} cfg={theme.spring.bouncy}>
                  <div
                    style={{
                      width: PILL.w,
                      height: PILL.h,
                      borderRadius: theme.radius.pill,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      padding: '0 34px',
                      background: active > 0 ? theme.colors.accentSoft : theme.colors.surface,
                      border: `2px solid ${active > 0.5 ? theme.colors.accent : theme.colors.border}`,
                      boxShadow: active > 0.5 ? theme.shadow.glowAccent : 'none',
                    }}
                  >
                    <IconLink size={44} />
                    <Bar w="56%" h={18} style={{background: theme.colors.textFaint}} />
                    <div style={{flex: 1}} />
                    <div style={{opacity: Math.min(1, check), transform: `scale(${0.4 + 0.6 * check})`}}>
                      <IconCheck size={44} />
                    </div>
                  </div>
                </Pop>
              </div>
              <div style={{position: 'absolute', left: 48, right: 48, top: 410, display: 'flex', flexDirection: 'column', gap: 22}}>
                <Bar w="70%" h={20} />
                <Bar w="44%" h={20} />
              </div>
            </GlassCard>
          </Pop>
        </div>

        {/* click ripple */}
        <div
          style={{
            position: 'absolute',
            left: TARGET.x - 60,
            top: TARGET.y - 60 + float,
            width: 120,
            height: 120,
            borderRadius: 60,
            border: `3px solid ${theme.colors.accent}`,
            opacity: ring > 0 ? 0.85 * (1 - ring) : 0,
            transform: `scale(${0.2 + 2.2 * ring})`,
          }}
        />

        {/* cursor */}
        <div style={{position: 'absolute', left: cx - 10, top: cy - 6, opacity: curOp, transform: `scale(${press})`, transformOrigin: '10px 6px'}}>
          <Cursor size={64} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
