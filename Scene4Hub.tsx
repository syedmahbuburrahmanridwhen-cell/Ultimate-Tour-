import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {T, S} from '../beats';
import {Bar, Chip, GlassCard, IconCart, IconGlobe, IconGrid, IconSpark, Window} from '../components/ui';
import {CLAMP, Pop, useFloat, useSpringAt} from '../components/motion';
import {SceneShell} from '../components/SceneShell';

const HUB = {x: 960, y: 470};
const PILL = {w: 440, h: 112};
const spokes = [
  {key: 'p', cx: 330, cy: 250, label: 'Portfolio', icon: <IconGrid size={52} />},
  {key: 'e', cx: 1590, cy: 250, label: 'E-commerce', icon: <IconCart size={52} />},
  {key: 'a', cx: 960, cy: 905, label: 'সব ধরনের', icon: <IconGlobe size={52} />},
];

const SiteSkeleton: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Bar w={70} h={12} />
      <div style={{display: 'flex', gap: 10}}>
        <Bar w={40} h={12} />
        <Bar w={40} h={12} />
        <Bar w={40} h={12} />
      </div>
    </div>
    <div style={{display: 'flex', gap: 20, height: 130}}>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center'}}>
        <Bar w="90%" h={16} />
        <Bar w="68%" h={16} />
        <div style={{width: 110, height: 30, borderRadius: 15, background: theme.colors.hero, marginTop: 6}} />
      </div>
      <div style={{width: 170, height: 130, borderRadius: 16, background: theme.gradient.thumb}} />
    </div>
    <div style={{display: 'flex', gap: 14}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{flex: 1, height: 70, borderRadius: 12, background: theme.colors.surface, border: `1px solid ${theme.colors.border}`}} />
      ))}
    </div>
  </div>
);

// Scene 4 — HUB & SPOKE. Website hub → Portfolio / E-commerce / সব ধরনের, then the hub grows into "my work".
export const Scene4Hub: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const t = (abs: number) => abs - S[3];
  const pB = t(T.s4.phaseB);
  const spokeAt = [t(T.s4.spokePortfolio), t(T.s4.spokeEcom), t(T.s4.spokeAll)];

  const exitP = interpolate(f, [pB, pB + 10], [0, 1], {easing: theme.ease.in, ...CLAMP});
  const grow = useSpringAt(pB + 4, theme.spring.smooth);
  const hubScale = 1 + 0.6 * grow;
  const float = useFloat(5, 32);

  return (
    <SceneShell dur={dur}>
      <AbsoluteFill>
        {/* connector lines + travelling dots */}
        <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          {spokes.map((s, i) => {
            const draw = interpolate(f, [spokeAt[i] - 2, spokeAt[i] + 14], [0, 1], {easing: theme.ease.out, ...CLAMP});
            const prog = Math.min(draw, 1 - exitP);
            const x2 = HUB.x + (s.cx - HUB.x) * prog;
            const y2 = HUB.y + (s.cy - HUB.y) * prog;
            const u = (f * 0.018 + i * 0.33) % 1;
            return (
              <g key={s.key}>
                <line x1={HUB.x} y1={HUB.y} x2={x2} y2={y2} stroke={theme.colors.accent} strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
                {draw > 0.98 && exitP < 0.2 ? (
                  <circle cx={HUB.x + (s.cx - HUB.x) * u} cy={HUB.y + (s.cy - HUB.y) * u} r={7} fill={theme.colors.accent} style={{filter: `drop-shadow(0 0 10px ${theme.colors.accentGlow})`}} />
                ) : null}
              </g>
            );
          })}
        </svg>

        {/* hub window */}
        <div style={{position: 'absolute', left: HUB.x - 260, top: HUB.y - 180 + float, width: 520, height: 360, transform: `scale(${hubScale})`}}>
          <Pop at={t(T.s4.hub)} dist={30} scaleFrom={0.8} cfg={theme.spring.bouncy}>
            <Window width={520} height={360}>
              <SiteSkeleton />
            </Window>
          </Pop>
        </div>

        {/* spokes */}
        {spokes.map((s, i) => (
          <div key={s.key} style={{position: 'absolute', left: s.cx - PILL.w / 2, top: s.cy - PILL.h / 2, opacity: 1 - exitP, transform: `scale(${1 - 0.15 * exitP})`}}>
            <Pop at={spokeAt[i]} cfg={theme.spring.bouncy} dist={40} from={i === 2 ? 'below' : i === 0 ? 'left' : 'right'}>
              <GlassCard style={{width: PILL.w, height: PILL.h, borderRadius: theme.radius.pill, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
                {s.icon}
                <span style={{fontSize: 52, fontWeight: theme.weight.strong, color: theme.colors.text, lineHeight: 1.2}}>{s.label}</span>
              </GlassCard>
            </Pop>
          </div>
        ))}

        {/* phase B labels */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center', gap: 28}}>
          <Pop at={t(T.s4.labelWork)} cfg={theme.spring.bouncy} dist={30}>
            <Chip label="আমার কাজ" size={48} icon={<IconGrid size={44} />} />
          </Pop>
          <Pop at={t(T.s4.labelOwn)} cfg={theme.spring.bouncy} dist={30}>
            <Chip label="নিজের তৈরি Website" size={48} icon={<IconSpark size={44} />} />
          </Pop>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
