'use client';

import { usePathname } from '@/i18n/navigation';
import Nana from '@/components/dc/Nana';

/** Nana chip sets exist for these pages; everything else uses "home". */
function pageKey(pathname: string) {
  if (pathname.startsWith('/pricing')) return 'pricing';
  if (pathname.startsWith('/work')) return 'work';
  if (pathname.startsWith('/life')) return 'life';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'home';
}

/** Nana lives in the layout, so a running call survives page changes. */
export function NanaMount() {
  const pathname = usePathname();
  if (pathname.startsWith('/demo')) return null;
  return <Nana page={pageKey(pathname)} />;
}
