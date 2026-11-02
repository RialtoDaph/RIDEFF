import type { NextConfig } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** Nana's photo avatar: public/images/nana.{jpg,png,webp} if present at build time (else the orange circle). */
const nanaAvatar = ['jpg', 'jpeg', 'png', 'webp'].map((e) => `/images/nana.${e}`).find((p) => fs.existsSync(path.join(process.cwd(), 'public', p))) ?? '';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_NANA_AVATAR: nanaAvatar },
  // Dev only: lets a phone on the same Wi-Fi open the dev server (http://<Mac IP>:3000).
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
};

export default withNextIntl(nextConfig);
