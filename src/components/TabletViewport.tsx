'use client';

import { useEffect } from 'react';
import { tabletViewport } from '@/lib/tabletViewport';

/** Fallback for pages where the inline <head> script did not run (e.g. the 404 shell). */
export function TabletViewport() {
  useEffect(tabletViewport, []);
  return null;
}
