import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {theme} from '../theme';
import {T, S} from '../beats';
import {Chip, IconBolt, IconSpark, Window} from '../components/ui';
import {Highlight, Pop, Words, useFloat, useSpringAt} from '../components/motion';
import {SceneShell} from '../components/SceneShell';

type Tone = 'a' | 'd' | 's';
const tone = (k: Tone) => (k === 'a' ? theme.colors.accent : k === 's' ? theme.colors.textDim : theme.colors.textFaint);
const rows: {i: number; b: [number, Tone][]}[] = [
  {i: 0, b: [[90, 'a'], [150, 'd']]},
  {i: 1, b: [[120, 's'], [70, 'd'], [110, 'a']]},
  {i: 1, b: [[180, 'd']]},
  {i: 2, b: [[100, 'a'], [140, 'd']]},
  {i: 2, b: [[160, 's']]},
  {i: 1, b: [[90, 'd'], [130, 'a']]},
  {i: 0, b: [[70, 's']]},
  {i: 0, b: [[200, 'd'], [80, 'a']]},
  {i: 1, b: [[150, 'd']]},
];

const CodeRow: React.FC<{row: (typeof rows)[number]; at: number; last: boolean}> = ({row, at, last}) => {
  const frame = useCurrentFrame();
  const p = useSpringAt(at, theme.spring.snappy);
  return (
    <div style={{display: 'flex', alignItems: 'center', height: 28}}>
      <div style={{width: 18, height: 10, borderRadius: 5, background: theme.colors.textFaint, opacity: 0.6}} />
      <div style={{width: 22 + row.i * 34}} />
      <div style={{display: 'flex', gap: 12, alignItems: 'center', transformOrigin: 'left center', transform: `scaleX(${Math.max(0.001, p)})`, opacity: Math.min(1, p * 1.5)}}>
        {row.b.map(([w, k], j) => (
          <div key={j} style={{width: w, height: 16, borderRadius: 8, background: tone(k)}} />
        ))}
        {last ? <div style={{width: 4, height: 28, borderRadius: 2, background: theme.colors.accent, opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.15}} /> : null}
      </div>
    </div>
  );
};

// Scene 2 — INTRO. Glossy / dark-tech editor window + stacked headline.
export const Scene2Intro: React.FC<{dur: number}> = ({dur}) => {
  const t = (abs: number) => abs - S[1];
  const float = useFloat(6, 30);
  const floatB = useFloat(5, 26, 1.5);
  const textStyle = (size: number, color: string, weight: number): React.CSSProperties => ({fontSize: size, fontWeight: weight, color, lineHeight: 1.12});

  return (
    <SceneShell dur={dur}>
      <AbsoluteFill>
        {/* left: stacked headline */}
        <div style={{position: 'absolute', left: 130, top: 0, bottom: 0, width: 1020, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Pop at={4} from="left" dist={50}>
            <div style={{...textStyle(64, theme.colors.textDim, theme.weight.body), marginBottom: 8}}>Hi, আমি একজন</div>
          </Pop>
          <Words
            text="Full Stack"
            at={t(T.s2.fullStack)}
            per={5}
            gap={30}
            wordStyle={() => textStyle(156, theme.colors.text, theme.weight.display)}
          />
          <Words
            text="Website Builder"
            at={t(T.s2.builder)}
            per={5}
            gap={26}
            wordStyle={() => textStyle(108, theme.colors.text, theme.weight.display)}
          />
          <div style={{display: 'flex', gap: 24, alignItems: 'center', marginTop: 14}}>
            <Pop at={t(T.s2.developer)}>
              <div style={textStyle(108, theme.colors.textDim, theme.weight.display)}>&amp;</div>
            </Pop>
            <Pop at={t(T.s2.developer) + 3} cfg={theme.spring.bouncy}>
              <Highlight at={t(T.s2.developer) + 6}>
                <span style={textStyle(108, theme.colors.text, theme.weight.display)}>Developer</span>
              </Highlight>
            </Pop>
          </div>
        </div>

        {/* right: editor window */}
        <div style={{position: 'absolute', left: 1180, top: 250, transform: `translateY(${float}px)`}}>
          <Pop at={14} from="right" dist={90} scaleFrom={0.92}>
            <Window width={640} height={500}>
              <div style={{position: 'absolute', inset: 0, padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: 16}}>
                {rows.map((r, i) => (
                  <CodeRow key={i} row={r} at={24 + i * 5} last={i === rows.length - 1} />
                ))}
              </div>
            </Window>
          </Pop>
        </div>

        {/* feature chips overlapping the window */}
        <div style={{position: 'absolute', left: 1110, top: 690, transform: `translateY(${floatB}px)`}}>
          <Pop at={t(T.s2.chipModern)} cfg={theme.spring.bouncy} dist={30}>
            <Chip label="Modern Design" icon={<IconSpark size={40} />} />
          </Pop>
        </div>
        <div style={{position: 'absolute', left: 1500, top: 200, transform: `translateY(${-floatB}px)`}}>
          <Pop at={t(T.s2.chipFast)} cfg={theme.spring.bouncy} dist={30}>
            <Chip label="Super Fast" icon={<IconBolt size={40} />} />
          </Pop>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
