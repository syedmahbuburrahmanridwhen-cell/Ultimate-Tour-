// Every on-screen beat, in ABSOLUTE frames, all derived from the SRT via timing.ts.
import {at, sceneStarts} from './timing';

export const S = sceneStarts;

export const T = {
  // Scene 1 — hook (cue 0)
  s1: {
    chipBusiness: at(0, 0, 'business'),
    chipPersonal: at(0, 0, 'personal brand'),
    headline: at(0, 0, 'professional'),
    question: at(0, 0, 'খুঁজছেন'),
  },
  // Scene 2 — intro (cue 1)
  s2: {
    fullStack: at(1, 1, 'full stack'),
    builder: at(1, 1, 'website builder'),
    developer: at(1, 1, 'developer'),
    chipModern: at(1, 1, 'আধুনিক'),
    chipFast: at(1, 1, 'super fast'),
  },
  // Scene 3 — features bento (cue 2)
  s3: {
    tileSpeed: S[2] + 3,
    tileResp: at(2, 2, 'একশ'),
    tilePortfolio: at(2, 2, 'Portfolio'),
  },
  // Scene 4 — hub & spoke (cue 3)
  s4: {
    hub: S[3] + 3,
    spokePortfolio: S[3] + 6,
    spokeEcom: Math.max(at(3, 3, 'e-commerce'), S[3] + 16),
    spokeAll: Math.max(at(3, 3, 'সব ধরনের'), S[3] + 30),
    phaseB: at(3, 3, 'আমার কাজ'),
    labelWork: at(3, 3, 'আমার কাজ') + 12,
    labelOwn: at(3, 3, 'নিজের তৈরি') + 4,
  },
  // Scene 5 — CTA 1 (cue 4)
  s5: {
    headline: S[4] + 3,
    card: at(4, 4, 'description'),
    click: at(4, 4, 'click'),
  },
  // Scene 6 — contact (cue 5)
  s6: {
    headline: S[5] + 3,
    chat: S[5] + 8,
    social: at(5, 5, 'social media'),
    whatsapp: at(5, 5, 'WhatsApp'),
    reply: at(5, 5, 'এখনই'),
  },
  // Scene 7 — end (cue 6)
  s7: {
    main: S[6] + 3,
    thanks: at(6, 6, 'ধন্যবাদ'),
  },
};
