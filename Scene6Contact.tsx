import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {T, S} from '../beats';
import {Bar, GlassCard, IconChat, IconShare, Window} from '../components/ui';
import {Pop, Words, gradientText, useFloat, useSpringAt} from '../components/motion';
import {SceneShell} from '../components/SceneShell';

const TypingDots: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = useSpringAt(at, theme.spring.snappy);
  return (
    <div style={{alignSelf: 'flex-start', display: 'flex', gap: 10, padding: '22px 28px', borderRadius: 28, background: theme.colors.surfaceStrong, opacity: Math.min(1, p), transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: 'left center'}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: 14, height: 14, borderRadius: 7, background: theme.colors.textDim, transform: `translateY(${Math.sin(f / 5 + i * 0.9) * 6}px)`}} />
      ))}
    </div>
  );
};

// Scene 6 — CONTACT. Glass cards (Social Media, WhatsApp — names only, no logos) + chat mockup.
export const Scene6Contact: React.FC<{dur: number}> = ({dur}) => {
  const t = (abs: number) => abs - S[5];
  const float = useFloat(5, 34);
  const floatB = useFloat(4, 28, 1.2);
  const h = t(T.s6.headline);
  const big = (g: boolean): React.CSSProperties =>
    g
      ? {fontSize: 112, fontWeight: theme.weight.display, lineHeight: 1.18, filter: `drop-shadow(0 0 30px ${theme.colors.heroGlow})`, ...gradientText}
      : {fontSize: 112, fontWeight: theme.weight.display, lineHeight: 1.18, color: theme.colors.text};

  return (
    <SceneShell dur={dur}>
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 130, top: 170}}>
          <Words text="পছন্দের Website" at={h} per={5} gap={28} wordStyle={(w) => big(w === 'Website')} />
          <Words text="বানিয়ে নিন" at={h + 10} per={5} gap={28} wordStyle={() => big(false)} />
        </div>

        {[
          {top: 560, at: t(T.s6.social), label: 'Social Media', icon: <IconShare size={56} />},
          {top: 700, at: t(T.s6.whatsapp), label: 'WhatsApp', icon: <IconChat size={56} />},
        ].map((c) => (
          <div key={c.label} style={{position: 'absolute', left: 130, top: c.top + floatB}}>
            <Pop at={c.at} from="left" dist={90} cfg={theme.spring.bouncy}>
              <GlassCard style={{width: 640, height: 120, borderRadius: theme.radius.pill, display: 'flex', alignItems: 'center', gap: 26, paddingLeft: 44}}>
                {c.icon}
                <span style={{fontSize: 56, fontWeight: theme.weight.strong, color: theme.colors.text, lineHeight: 1.2}}>{c.label}</span>
              </GlassCard>
            </Pop>
          </div>
        ))}

        <div style={{position: 'absolute', left: 1010, top: 200 + float}}>
          <Pop at={t(T.s6.chat)} from="right" dist={90} scaleFrom={0.92}>
            <Window width={780} height={660}>
              <div style={{position: 'absolute', inset: 0, padding: 36, display: 'flex', flexDirection: 'column', gap: 26}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                  <div style={{width: 64, height: 64, borderRadius: 32, background: theme.colors.accentSoft, border: `2px solid ${theme.colors.accent}`}} />
                  <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                    <Bar w={180} h={16} />
                    <Bar w={110} h={12} />
                  </div>
                </div>
                <div style={{alignSelf: 'flex-start', padding: '24px 28px', borderRadius: 28, background: theme.colors.surfaceStrong, display: 'flex', flexDirection: 'column', gap: 12}}>
                  <Bar w={260} h={14} style={{background: theme.colors.textFaint}} />
                  <Bar w={170} h={14} style={{background: theme.colors.textFaint}} />
                </div>
                <Pop at={t(T.s6.whatsapp)} from="right" dist={40} style={{alignSelf: 'flex-end'}}>
                  <div style={{maxWidth: 560, padding: '24px 32px', borderRadius: 28, background: theme.colors.accentSoft, border: `1px solid ${theme.colors.accent}`}}>
                    <Words text="আমার পছন্দের Website বানিয়ে দিন" at={t(T.s6.whatsapp) + 4} per={5} gap={14} wordStyle={() => ({fontSize: 46, fontWeight: theme.weight.body, color: theme.colors.text, lineHeight: 1.35})} />
                  </div>
                </Pop>
                <TypingDots at={t(T.s6.reply)} />
              </div>
            </Window>
          </Pop>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
