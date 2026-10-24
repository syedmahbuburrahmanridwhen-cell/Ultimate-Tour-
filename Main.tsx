import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {theme} from './theme';
import {sceneDur, sceneStarts} from './timing';
import {BgMesh, Grade, Grain, Vignette} from './components/Backdrop';
import {Sweep} from './components/Sweep';
import {SfxLayer} from './components/SfxLayer';
import {PreviewAudio} from './components/PreviewAudio';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Intro} from './scenes/Scene2Intro';
import {Scene3Bento} from './scenes/Scene3Bento';
import {Scene4Hub} from './scenes/Scene4Hub';
import {Scene5Cta} from './scenes/Scene5Cta';
import {Scene6Contact} from './scenes/Scene6Contact';
import {Scene7End} from './scenes/Scene7End';

const scenes: React.FC<{dur: number}>[] = [Scene1Hook, Scene2Intro, Scene3Bento, Scene4Hub, Scene5Cta, Scene6Contact, Scene7End];

export const Main: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: theme.colors.bg, fontFamily: theme.fonts.display, color: theme.colors.text}}>
    <style>{'*, *::before, *::after { box-sizing: border-box; }'}</style>
    {/* 1 — background mesh */}
    <BgMesh />
    {/* 2/3 — assets + graphics/type, one Sequence per scene */}
    {scenes.map((Scene, i) => (
      <Sequence key={i} from={sceneStarts[i]} durationInFrames={sceneDur(i)}>
        <Scene dur={sceneDur(i)} />
      </Sequence>
    ))}
    {/* scene-boundary light sweeps */}
    {sceneStarts.slice(1).map((s, i) => (
      <Sequence key={`sw-${i}`} from={Math.max(0, s - 2)} durationInFrames={18}>
        <Sweep />
      </Sequence>
    ))}
    {/* 4 — grade, 5 — grain + vignette */}
    <Grade />
    <Grain />
    <Vignette />
    <SfxLayer />
    <PreviewAudio />
  </AbsoluteFill>
);
