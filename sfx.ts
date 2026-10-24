// SFX events — every frame derives from beats.ts (SRT). SFX land 2-3 frames BEFORE the visual.
import {T, S} from './beats';

export type SfxName = 'pop' | 'click' | 'whoosh' | 'chime' | 'thud';
export type SfxEvent = {at: number; name: SfxName; vol: number; rate?: number};

const pre = 2;
const ev = (at: number, name: SfxName, vol: number, rate = 1): SfxEvent => ({at: Math.max(0, at - pre), name, vol, rate});

export const sfxEvents: SfxEvent[] = [
  // Scene 1 — hook
  ev(T.s1.chipBusiness, 'pop', 0.3, 1.0),
  ev(T.s1.chipPersonal, 'pop', 0.28, 1.08),
  ev(T.s1.headline, 'whoosh', 0.28, 1.0),
  ev(T.s1.headline + 3, 'thud', 0.3, 1.0),
  ev(S[1], 'whoosh', 0.24, 1.05),
];

// Scene 2 — reveals
sfxEvents.push(
  ev(S[1] + 14, 'pop', 0.3, 0.96), // editor window
  ev(T.s2.developer + 6, 'chime', 0.26, 1.0), // highlight sweep
  ev(T.s2.chipModern, 'pop', 0.28, 1.0),
  ev(T.s2.chipFast, 'pop', 0.28, 1.1),
  // Scene 3
  ev(S[2], 'whoosh', 0.24, 0.95),
  ev(T.s3.tileSpeed, 'pop', 0.3, 1.0),
  ev(T.s3.tileResp, 'pop', 0.3, 1.06),
  ev(T.s3.tilePortfolio, 'pop', 0.3, 1.12),
  // Scene 4
  ev(S[3], 'whoosh', 0.24, 1.0),
  ev(T.s4.hub, 'pop', 0.3, 0.94),
  ev(T.s4.spokePortfolio, 'pop', 0.26, 1.0),
  ev(T.s4.spokeEcom, 'pop', 0.26, 1.07),
  ev(T.s4.spokeAll, 'pop', 0.26, 1.14),
  ev(T.s4.phaseB, 'whoosh', 0.22, 1.1),
  ev(T.s4.labelWork, 'pop', 0.28, 1.0),
  ev(T.s4.labelOwn, 'pop', 0.28, 1.08),
  // Scene 5
  ev(S[4], 'whoosh', 0.24, 0.98),
  ev(T.s5.card, 'pop', 0.3, 1.0),
  ev(T.s5.click, 'click', 0.34, 1.0),
  ev(T.s5.click + 3, 'chime', 0.24, 1.0),
  // Scene 6
  ev(S[5], 'whoosh', 0.24, 1.04),
  ev(T.s6.chat, 'pop', 0.28, 0.96),
  ev(T.s6.social, 'pop', 0.28, 1.0),
  ev(T.s6.whatsapp, 'pop', 0.28, 1.08),
  // Scene 7
  ev(S[6], 'whoosh', 0.24, 1.0),
  ev(T.s7.main + 4, 'thud', 0.26, 1.0),
  ev(T.s7.thanks, 'chime', 0.26, 1.0),
);
