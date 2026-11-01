import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intl = createMiddleware(routing);

const redirect = (req: NextRequest, pathname: string, status = 308) => {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, status);
};

export default function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const seg = pathname.split('/')[1] ?? '';

  // The Indonesian locale was dropped: /id/… → /en/…
  if (seg === 'id') return redirect(req, `/en${pathname.slice(3)}`);

  const en = seg === 'en';
  const rest = en ? pathname.slice(3) || '/' : pathname;

  // Old one-page site: /?for=private was RIDEFF Life.
  if (rest === '/' && searchParams.get('for') === 'private') {
    const url = req.nextUrl.clone();
    url.pathname = en ? '/en/life' : '/life';
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  // Old blog → Journal (posts are German only for now).
  if (rest === '/blog' || rest.startsWith('/blog/')) return redirect(req, rest.replace(/^\/blog/, '/journal'));
  if (en && rest.startsWith('/journal/')) return redirect(req, rest);

  // Legal pages are German only.
  if (en && ['/impressum', '/datenschutz', '/agb'].includes(rest)) return redirect(req, rest);

  return intl(req);
}

export const config = {
  // Skip API routes, Next internals, Vercel internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
