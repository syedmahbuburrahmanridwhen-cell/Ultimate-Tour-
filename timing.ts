// All timing is derived from the SRT (src/cues.ts is generated from public/script.srt).
import {cues} from './cues';

export const FPS = 30;
export const LEAD = 5; // visuals land 4-6 frames before the matching words
export const OVERLAP = 8; // outgoing scene lingers under the incoming one
export const EXIT = 10; // exit is faster than entrances

export const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);
export const cueStart = (i: number) => msToFrame(cues[i].start);
export const cueEnd = (i: number) => msToFrame(cues[i].end);
export const TOTAL = Math.ceil((cues[cues.length - 1].end / 1000) * FPS);

// Scene -> which cues it covers. Boundaries always sit on cue boundaries.
export const SCENE_CUES: number[][] = [[0], [1], [2], [3], [4], [5], [6]];

export const sceneStarts: number[] = SCENE_CUES.map((c, i) =>
  i === 0 ? 0 : Math.max(0, cueStart(c[0]) - LEAD),
);

export const sceneDur = (i: number) =>
  i < SCENE_CUES.length - 1
    ? sceneStarts[i + 1] - sceneStarts[i] + OVERLAP
    : TOTAL - sceneStarts[i];

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Absolute frame at which `phrase` is (approximately) spoken inside cue `ci`,
 * minus LEAD. There are no word timestamps in an SRT, so the position is the
 * phrase's character fraction within the cue's time range.
 */
export const at = (scene: number, ci: number, phrase: string, lead: number = LEAD): number => {
  const text = norm(cues[ci].text);
  const idx = text.indexOf(phrase);
  if (idx < 0) {
    // eslint-disable-next-line no-console
    console.warn(`[timing] phrase not found in cue ${ci}: "${phrase}"`);
  }
  const frac = Math.max(0, idx) / text.length;
  const abs = Math.round(cueStart(ci) + frac * (cueEnd(ci) - cueStart(ci))) - lead;
  return Math.max(sceneStarts[scene] + 2, abs);
};

/** `n` items spread with equal spacing over [from, to). */
export const spread = (n: number, from: number, to: number): number[] =>
  Array.from({length: n}, (_, i) => Math.round(from + ((to - from) * i) / Math.max(1, n)));
