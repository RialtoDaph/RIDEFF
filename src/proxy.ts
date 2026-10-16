import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing, locales } from '@/i18n/routing';

const intl = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const seg = pathname.split('/')[1] ?? '';
  const prefixed = (locales as readonly string[]).includes(seg);
  const locale = prefixed ? seg : routing.defaultLocale;
  const rest = prefixed ? pathname.slice(seg.length + 1) || '/' : pathname;
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  // The PRIVATE page is served from an internal route; its public URL is /?for=private.
  if (rest === '/life' || rest.startsWith('/life/')) {
    const url = req.nextUrl.clone();
    url.pathname = prefix || '/';
    url.search = '?for=private';
    return NextResponse.redirect(url, 308);
  }

  // Legal pages are German only.
  if (prefixed && locale !== routing.defaultLocale && ['/impressum', '/datenschutz', '/agb'].includes(rest)) {
    const url = req.nextUrl.clone();
    url.pathname = rest;
    return NextResponse.redirect(url, 308);
  }

  // The Business demo exists in DE and EN only.
  if (locale === 'id' && (rest === '/demo' || rest.startsWith('/demo/'))) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${rest}`;
    return NextResponse.redirect(url, 307);
  }

  // "/de/…" is handled (redirected to "/…") by next-intl first.
  if (rest === '/' && !(prefixed && locale === routing.defaultLocale)) {
    const isPrivate = searchParams.get('for') === 'private';

    // Business has no Indonesian version in the prototype; it falls back to English.
    if (!isPrivate && locale === 'id') {
      const url = req.nextUrl.clone();
      url.pathname = '/en';
      return NextResponse.redirect(url, 307);
    }

    if (isPrivate) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/life`;
      return NextResponse.rewrite(url);
    }
  }

  return intl(req);
}

export const config = {
  // Skip API routes, Next internals, Vercel internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
