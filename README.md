# Website Builder Promo — Remotion (Midnight Indigo)

1. `npm install`
2. `npx remotion studio`   (কম্পোজিশন: **Main**, 1920×1080, 30fps, ≈35.8s)
3. `npx remotion render src/index.ts Main out/video.mp4`

- ভয়েসওভার সিঙ্ক দেখতে MP3 রাখুন: `public/voiceover.mp3` (Studio-তে বাজবে; রেন্ডারে চাইলে `src/config.ts`-এ `voiceoverInRender: true`)।
- সব সময় `public/script.srt` থেকে আসে: পরিবর্তন করলে `npm run cues`, তারপর `src/beats.ts`-এর phrase মিলিয়ে নিন।
- রং/ফন্ট/ইজিং: `src/theme.ts`। SFX: `public/sfx/*.wav` (আবার বানাতে `npm run sfx`)।
- ফন্ট Hind Siliguri `@remotion/google-fonts` থেকে লোড হয় (প্রথমবার ইন্টারনেট লাগে)।
