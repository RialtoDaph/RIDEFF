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
/**
 * live: an ElevenLabs key is configured, so labels drop the prototype's
 * "preview" and errors no longer say Nana is a preview.
 */
export function NanaMount({ live }: { live: boolean }) {
  const pathname = usePathname();
  if (pathname.startsWith('/demo')) return null;
  // callSheet={false}: "Call" starts the call at once, like a phone call (no pre-call sheet).
  return <Nana page={pageKey(pathname)} live={live} callSheet={false} />;
}
