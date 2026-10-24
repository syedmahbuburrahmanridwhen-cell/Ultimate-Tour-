import React, {useEffect, useState} from 'react';
import * as Remotion from 'remotion';
import {Audio, continueRender, delayRender, staticFile} from 'remotion';
import {config} from '../config';

// Studio detection that cannot crash if a Remotion version renames the helper.
const detectStudio = (): boolean => {
  try {
    const getEnv = (Remotion as unknown as Record<string, unknown>)['getRemotionEnvironment'];
    if (typeof getEnv === 'function') {
      const env = (getEnv as () => {isStudio?: boolean})();
      if (typeof env?.isStudio === 'boolean') return env.isStudio;
    }
  } catch {
    // fall through
  }
  return typeof window !== 'undefined' && Boolean((window as unknown as {remotion_isStudio?: boolean}).remotion_isStudio);
};

/**
 * Plays public/voiceover.mp3 if it exists (silently skipped otherwise).
 * On in Studio preview; off in renders unless config.voiceoverInRender is true.
 */
export const PreviewAudio: React.FC = () => {
  const active = config.voiceoverEnabled && (detectStudio() || config.voiceoverInRender);
  const [exists, setExists] = useState(false);
  const [handle] = useState<number | null>(() => (active ? delayRender('voiceover-check') : null));

  useEffect(() => {
    if (!active || handle === null) return;
    let cancelled = false;
    fetch(staticFile('voiceover.mp3'), {method: 'HEAD'})
      .then((r) => {
        const ct = r.headers.get('content-type') || '';
        if (!cancelled) setExists(r.ok && !ct.includes('text/html'));
      })
      .catch(() => undefined)
      .finally(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
  }, [active, handle]);

  if (!active || !exists) return null;
  return <Audio src={staticFile('voiceover.mp3')} volume={1} />;
};
