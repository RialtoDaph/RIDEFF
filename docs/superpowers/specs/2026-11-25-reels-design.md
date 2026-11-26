# Reels: UI/UX showcase + sales video (design)

Status: approved by owner in chat, 2026-11-25. Nothing built yet.

## Intent and why
Show off the UI/UX of rideff.com and sell RIDEFF Business at the same time.
The Build page hero (about 26,000 three.js particles that morph with scroll:
Scattered, Platform, Inbound, Agents, Apps) is the centerpiece, because its story
(chaos turning into one system) is also the sales message.

## Deliverables
1. 30 s reel, 9:16, 1080x1920, 30 fps: showcase plus sales.
2. 15 s cut, same footage: tighter and more sales-driven (WhatsApp Status, paid ads).

## Decisions (owner)
- On-screen text: **English**, with **German subtitles**.
- Audio: **music only**, no voiceover. Cuts follow the beat.
- Zero paid credits (no ElevenLabs, no Higgsfield). Anything that spends credits
  needs an estimate and an explicit yes first (see CLAUDE.md).

## Storyboard (30 s)
| Time | Content |
|---|---|
| 0-3 s | Scattered particles + hook ("Your business: chaos in 6 tools?") |
| 3-12 s | Scroll morphs particles Scattered > Platform > Inbound > Agents > Apps, stage label updates live |
| 12-16 s | Slat page transition, smooth scroll, orange progress bar |
| 16-21 s | Shop and dashboard mockups (real assets in `public/images`) |
| 21-25 s | Nana: chat and call UI |
| 25-30 s | CTA "15-min call, free" + rideff.com + logo |

## Approaches considered
- **A. Programmatic capture (chosen):** Playwright drives the real site with
  deterministic, frame-by-frame scroll, then ffmpeg composes. Real animations,
  free, repeatable, easy to re-render after a copy change.
- B. Screen-record by hand: cheaper to start, but scroll is jittery and
  WebGL frame drops are baked in. Rejected.
- C. AI-generated video: costs credits and would not show the real UI.
  Rejected (also defeats the "show my UI" goal).

## Constraints
- Headless Chromium has no GPU: WebGL renders in software. Slower, same quality.
  Render per frame, then assemble.
- Mobile viewport gives only 9,000 particles. Capture at desktop width
  (full 26,000) and reframe/crop to 9:16.
- Output lives outside the site source (`reels/`, git-ignored large files);
  the site itself is not modified.
- Placeholder content (`[...]`) must not appear in any frame.

## Non-goals / anti-goals
- No changes to the website's UI or copy.
- No voiceover, no AI-generated media.
- Failure even if it "works": particles look sparse or stuttery, or a
  placeholder or unconfirmed price figure is visible.

## Left to the builder (marked as my calls)
- **Music:** no track exists in the repo. Default: a simple beat synthesized
  with ffmpeg (free, no licensing issue). If the owner supplies a licensed
  track, swap it in; cut points follow its BPM.
- Hook price figures ("3,000-8,000 EUR") are still "typical ranges" in
  TODO.md. Default hook has **no price figure**; use one only if the owner confirms.
- Exact fonts/label styling: reuse site tokens (orange `#FF6A00`, dark `#14080A`).

## Build notes (as built)
- Capture viewport is 810x1440 css px at 4/3 scale (= 1080x1920): width in 760..900 keeps the full 26000 particles
  and uses the site's larger centred particle layout. Frames come from a Playwright virtual clock.
- Music is a synthesized 120 BPM beat (every shot boundary of both cuts is on a beat).
- The CTA backdrop is the dark particle hero (stage "Apps"), dimmed and blurred; bottom overlays sit on a dark scrim.
- Run it: see `scripts/reels/README.md`.
