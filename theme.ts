// theme.ts — Midnight Indigo. Single source of truth: colors, fonts, easing, springs.
import {Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/HindSiliguri';

const {fontFamily} = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
});

export const theme = {
  colors: {
    bg: '#0B0F1E',
    bgAlt: '#121833',
    panel: '#0E1430',
    hero: '#6C5CE7', // THE hero color — one element per frame
    heroLight: '#8E82FF', // tint of hero for text on dark
    accent: '#00D1FF',
    text: '#F4F6FF',
    textDim: 'rgba(244,246,255,0.62)',
    textFaint: 'rgba(244,246,255,0.28)',
    surface: 'rgba(255,255,255,0.06)',
    surfaceStrong: 'rgba(255,255,255,0.11)',
    border: 'rgba(255,255,255,0.14)',
    gloss: 'rgba(255,255,255,0.09)',
    heroGlow: 'rgba(108,92,231,0.45)',
    heroGlowSoft: 'rgba(108,92,231,0.22)',
    accentGlow: 'rgba(0,209,255,0.35)',
    accentSoft: 'rgba(0,209,255,0.18)',
    shade: 'rgba(0,0,0,0.35)',
  },
  gradient: {
    hero: 'linear-gradient(100deg, #8E82FF 0%, #00D1FF 100%)',
    thumb: 'linear-gradient(135deg, rgba(0,209,255,0.38), rgba(0,209,255,0.08))',
  },
  fonts: {
    display: `"${fontFamily}", "Noto Sans Bengali", "Kohinoor Bangla", "Nirmala UI", sans-serif`,
    mono: 'ui-monospace, Menlo, Consolas, monospace',
  },
  radius: {sm: 14, md: 28, lg: 40, pill: 999},
  shadow: {
    card: '0 30px 70px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10)',
    glowHero: '0 0 60px rgba(108,92,231,0.45), 0 0 120px rgba(108,92,231,0.22)',
    glowAccent: '0 0 40px rgba(0,209,255,0.35)',
  },
  weight: {body: 500, strong: 600, display: 700},
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: {damping: 14, stiffness: 160, mass: 0.6},
    smooth: {damping: 20, stiffness: 90, mass: 1},
    bouncy: {damping: 11, stiffness: 170, mass: 0.7},
  },
} as const;
