# Reels

Two vertical (1080x1920, 30 fps) reels made from the real site: a 30 s showcase + sales cut and a 15 s
cut from the same footage. Text is English with German subtitles; the audio is a synthesized beat.
Design: `docs/superpowers/specs/2026-11-25-reels-design.md`.

## Build

```bash
npm ci && npm run build        # production build (the capture runs against `next start`)
node scripts/reels/build-reels.cjs
```

Output (git-ignored): `reels/out/rideff-reel-30s.mp4` and `reels/out/rideff-reel-15s.mp4`.
The capture takes several minutes (about 900 frames of software-rendered WebGL).
After changing only text, music or the edit, skip it: `node scripts/reels/build-reels.cjs --reuse`.

Playwright is expected to be installed globally (`require('playwright')`); it is not a project dependency.

## Files

| File | Role |
|---|---|
| `timeline.cjs` | Shot list, frame counts, short-cut list, scroll easing |
| `serve.cjs`, `capture.cjs` | Runs `next start` (without ElevenLabs keys) and records frames with a virtual clock |
| `copy.cjs`, `overlay.cjs` | On-screen text (EN + DE subtitle) and its transparent PNG overlays |
| `music.cjs` | Beat synthesized with ffmpeg, 120 BPM so every cut lands on a beat |
| `compose.cjs`, `build-reels.cjs` | ffmpeg edit and the single entry point |

## Notes

- No credits are spent. The server is started without `ELEVENLABS_*` / `NANA_*` variables, so Nana answers from
  its built-in mock, and the browser blocks every request to `elevenlabs.io`.
- A licensed track can replace the beat: write it to `reels/out/music-full.wav` / `music-short.wav` and run with `--reuse`
  (cuts follow the 120 BPM grid, so pick a track at 120 BPM or accept off-beat cuts).
- Tests: `node --test scripts/reels/*.test.cjs` (the capture tests need the production build and take several minutes).
