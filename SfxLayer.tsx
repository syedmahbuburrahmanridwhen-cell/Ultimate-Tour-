import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {config} from '../config';
import {sfxEvents} from '../sfx';

export const SfxLayer: React.FC = () => {
  if (!config.sfxEnabled) return null;
  return (
    <>
      {sfxEvents.map((e, i) => (
        <Sequence key={`${e.name}-${e.at}-${i}`} from={e.at} durationInFrames={30} layout="none">
          <Audio src={staticFile(`sfx/${e.name}.wav`)} volume={e.vol} playbackRate={e.rate ?? 1} />
        </Sequence>
      ))}
    </>
  );
};
