export const INTRO_KEY = 'rideff-intro';

/**
 * Runs in <head> before first paint: marks <html data-intro="1"> on a first
 * visit per session on desktop (≥768px), unless reduced motion is preferred.
 * The intro overlay is hidden by CSS unless that flag is set, so it never flashes.
 */
export const INTRO_DECIDE_SCRIPT = `try{if(matchMedia('(min-width: 768px)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('${INTRO_KEY}'))document.documentElement.dataset.intro='1'}catch(e){}`;
