/**
 * Handoff images are up to 2880px / 3 MB PNGs. opt() routes them through the
 * Next.js image optimizer (resized, WebP/AVIF on Vercel). Works anywhere a URL
 * goes: <img src>, ImageSlot, CSS url(). 1920 is one of Next's default sizes.
 */
export function opt(src: string, w: 640 | 1080 | 1920 = 1920): string {
  if (!src || !src.startsWith('/images/') || src.endsWith('.svg')) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
}
