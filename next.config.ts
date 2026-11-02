import type { NextConfig } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** Nana's photo avatar: public/images/nana.{jpg,png,webp} if present at build time (else the orange circle). */
const nanaAvatar = ['jpg', 'jpeg', 'png', 'webp'].map((e) => `/images/nana.${e}`).find((p) => fs.existsSync(path.join(process.cwd(), 'public', p))) ?? '';

/** Same check as isConfigured() in src/lib/newsletter.ts: the Journal shows the sign-up form only when it can work. */
const e = process.env;
const provider = (e.NEWSLETTER_PROVIDER ?? '').trim().toLowerCase();
const newsletterOn =
  (e.NEWSLETTER_SECRET ?? '').length >= 32 &&
  !!e.NEWSLETTER_FROM &&
  ((provider === 'resend' && !!e.RESEND_API_KEY && !!e.RESEND_AUDIENCE_ID) || (provider === 'brevo' && !!e.BREVO_API_KEY && !!e.BREVO_LIST_ID));

/**
 * Content-Security-Policy, report-only for now: violations show in the browser
 * console without blocking anything. Switch the header name to
 * Content-Security-Policy once Nana (chat + call), analytics and all pages run
 * clean (TODO.md → Technical follow-ups).
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' data: blob:",
  // Nana: ElevenLabs API/WebSocket and LiveKit WebRTC (US and EU residency).
  "connect-src 'self' https://*.elevenlabs.io wss://*.elevenlabs.io https://*.livekit.cloud wss://*.livekit.cloud",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_NANA_AVATAR: nanaAvatar, NEXT_PUBLIC_NEWSLETTER_ON: newsletterOn ? '1' : '' },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Microphone only for Nana's voice call on this origin.
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), payment=(), usb=(), microphone=(self)' },
          { key: 'Content-Security-Policy-Report-Only', value: csp },
        ],
      },
    ];
  },
  // Dev only: lets a phone on the same Wi-Fi open the dev server (http://<Mac IP>:3000).
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
};

export default withNextIntl(nextConfig);
