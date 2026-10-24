import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {T, S} from '../beats';
import {Bar, GlassCard, IconGrid} from '../components/ui';
import {CLAMP, Pop, gradientText, useFloat, useSpringAt} from '../components/motion';
import {SceneShell} from '../components/SceneShell';

const Gauge: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const p = useSpringAt(at + 6, {damping: 16, stiffness: 70, mass: 1});
  const arcLen = Math.PI * 150;
  const wobble = p > 0.98 ? Math.sin(frame / 5) * 1.4 : 0;
  const ticks = Array.from({length: 11}, (_, i) => {
    const a = (Math.PI * (180 - i * 18)) / 180;
    return {x1: 200 + 166 * Math.cos(a), y1: 200 - 166 * Math.sin(a), x2: 200 + 182 * Math.cos(a), y2: 200 - 182 * Math.sin(a)};
  });
  return (
    <svg width={440} height={253} viewBox="0 0 400 230">
      {ticks.map((k, i) => (
        <line key={i} x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2} stroke={theme.colors.textFaint} strokeWidth={3} strokeLinecap="round" />
      ))}
      <path d="M50 200 A150 150 0 0 1 350 200" fill="none" stroke={theme.colors.surfaceStrong} strokeWidth={22} strokeLinecap="round" />
      <path
        d="M50 200 A150 150 0 0 1 350 200"
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth={22}
        strokeLinecap="round"
        strokeDasharray={arcLen}
        strokeDashoffset={arcLen * (1 - Math.min(1, Math.max(0, p)))}
        style={{filter: `drop-shadow(0 0 12px ${theme.colors.accentGlow})`}}
      />
      <g transform={`rotate(${-90 + 180 * Math.min(1.04, Math.max(0, p)) + wobble} 200 200)`}>
        <line x1={200} y1={200} x2={200} y2={72} stroke={theme.colors.text} strokeWidth={8} strokeLinecap="round" />
      </g>
      <circle cx={200} cy={200} r={15} fill={theme.colors.text} />
    </svg>
  );
};

const Device: React.FC<{w: number; h: number; at: number}> = ({w, h, at}) => (
  <Pop at={at} dist={36} cfg={theme.spring.snappy}>
    <div style={{width: w, height: h, borderRadius: 16, border: `2px solid ${theme.colors.textDim}`, background: theme.colors.panel, padding: 12, display: 'flex', flexDirection: 'column', gap: 8}}>
      <Bar w="55%" h={8} />
      <div style={{height: h * 0.34, borderRadius: 8, background: theme.gradient.thumb}} />
      <Bar w="85%" h={8} />
      <Bar w="60%" h={8} />
    </div>
  </Pop>
);

// Scene 3 — FEATURES. Bento grid: speed gauge, 100% responsive devices, portfolio thumbnails.
export const Scene3Bento: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (abs: number) => abs - S[2];
  const aAt = t(T.s3.tileSpeed);
  const bAt = t(T.s3.tileResp);
  const cAt = t(T.s3.tilePortfolio);

  const cp = spring({frame: f - bAt - 6, fps, config: {damping: 30, stiffness: 60, mass: 1}});
  const val = Math.min(100, Math.round(interpolate(cp, [0, 1], [0, 100], CLAMP)));
  const fA = useFloat(4, 34);
  const fB = useFloat(4, 30, 1);
  const fC = useFloat(4, 38, 2);

  return (
    <SceneShell dur={dur}>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 150, top: 150, width: 1620, height: 780}}>
          {/* A — speed */}
          <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${fA}px)`}}>
            <Pop at={aAt} scaleFrom={0.92} dist={60}>
              <GlassCard style={{width: 520, height: 780, borderRadius: theme.radius.lg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
                <Gauge at={aAt} />
                <div style={{fontSize: 76, fontWeight: theme.weight.display, color: theme.colors.text, lineHeight: 1.15}}>Super Fast</div>
                <div style={{fontSize: 48, fontWeight: theme.weight.body, color: theme.colors.textDim, lineHeight: 1.2}}>Speed</div>
              </GlassCard>
            </Pop>
          </div>

          {/* B — responsive */}
          <div style={{position: 'absolute', left: 548, top: 0, transform: `translateY(${fB}px)`}}>
            <Pop at={bAt} scaleFrom={0.92} dist={60}>
              <GlassCard style={{width: 1072, height: 460, borderRadius: theme.radius.lg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div style={{fontSize: 172, fontWeight: theme.weight.display, lineHeight: 1.05, minWidth: 440, fontVariantNumeric: 'tabular-nums', filter: `drop-shadow(0 0 30px ${theme.colors.heroGlow})`, ...gradientText}}>{val}%</div>
                  <div style={{fontSize: 68, fontWeight: theme.weight.strong, color: theme.colors.text, lineHeight: 1.2}}>Responsive</div>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-end', gap: 20, height: 190}}>
                  <Device w={230} h={156} at={bAt + 10} />
                  <Device w={120} h={170} at={bAt + 16} />
                  <Device w={70} h={140} at={bAt + 22} />
                </div>
              </GlassCard>
            </Pop>
          </div>

          {/* C — portfolio */}
          <div style={{position: 'absolute', left: 548, top: 488, transform: `translateY(${fC}px)`}}>
            <Pop at={cAt} scaleFrom={0.92} dist={60}>
              <GlassCard style={{width: 1072, height: 292, borderRadius: theme.radius.lg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <IconGrid size={64} />
                  <div style={{fontSize: 76, fontWeight: theme.weight.display, color: theme.colors.text, lineHeight: 1.2}}>Portfolio</div>
                </div>
                <div style={{display: 'flex', gap: 18}}>
                  {[0, 1, 2].map((i) => (
                    <Pop key={i} at={cAt + 8 + i * 5} dist={30} cfg={theme.spring.snappy}>
                      <div style={{width: 150, height: 170, borderRadius: 18, background: theme.colors.panel, border: `1px solid ${theme.colors.border}`, padding: 12, display: 'flex', flexDirection: 'column', gap: 10}}>
                        <div style={{height: 88, borderRadius: 12, background: theme.gradient.thumb}} />
                        <Bar w="80%" h={10} />
                        <Bar w="52%" h={10} />
                      </div>
                    </Pop>
                  ))}
                </div>
              </GlassCard>
            </Pop>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
