// SRT -> src/cues.ts  (usage: node scripts/build-cues.mjs public/script.srt src/cues.ts)
import fs from 'node:fs';
const [, , inFile = 'public/script.srt', outFile = 'src/cues.ts'] = process.argv;
const raw = fs.readFileSync(inFile, 'utf8').replace(/\r/g, '').trim();
const ts = (s) => {
  const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  return ((+m[1] * 60 + +m[2]) * 60 + +m[3]) * 1000 + +m[4];
};
const cues = raw.split(/\n\s*\n/).map((b) => {
  const lines = b.split('\n').filter(Boolean);
  const [a, z] = lines[1].split('-->');
  return { start: ts(a), end: ts(z), text: lines.slice(2).join(' ').replace(/\s+/g, ' ').trim() };
});
const body = cues
  .map((c) => `  {start: ${c.start}, end: ${c.end}, text: ${JSON.stringify(c.text)}},`)
  .join('\n');
fs.writeFileSync(
  outFile,
  `// AUTO-GENERATED from public/script.srt by scripts/build-cues.mjs. Do not edit by hand.\nexport type Cue = {start: number; end: number; text: string};\nexport const cues: Cue[] = [\n${body}\n];\n`,
);
console.log(`${cues.length} cues -> ${outFile}`);
