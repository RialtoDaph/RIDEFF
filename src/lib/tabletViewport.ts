/**
 * Tablets held upright (iPad portrait and similar, narrower than 1024px but
 * not phones) get a 1024px layout viewport, so they show the desktop layout
 * scaled to fit instead of the phone layout. Phones (shorter screen side below
 * 700px), landscape tablets and desktops keep width=device-width.
 * Re-applied on rotation and whenever a viewport meta tag is added or
 * re-rendered (Next.js can stream a second one). Self-contained so it can be
 * inlined as a <head> script; safe to call more than once.
 */
export function tabletViewport() {
  try {
    const w = window as unknown as { __rideffVp?: boolean };
    if (w.__rideffVp) return;
    w.__rideffVp = true;
    const portrait = matchMedia('(orientation: portrait)');
    const fit = () => {
      const short = Math.min(screen.width, screen.height);
      const width = portrait.matches ? short : Math.max(screen.width, screen.height);
      const content = short >= 700 && width < 1024 ? 'width=1024' : 'width=device-width, initial-scale=1';
      document.querySelectorAll<HTMLMetaElement>('meta[name="viewport"]').forEach((m) => {
        if (m.content !== content) m.content = content;
      });
    };
    fit();
    portrait.addEventListener('change', fit);
    new MutationObserver((records) => {
      for (const r of records) {
        if (r.target.nodeName === 'META') return fit();
        for (const n of Array.from(r.addedNodes)) {
          if (n.nodeName === 'META' || (n instanceof Element && n.querySelector('meta'))) return fit();
        }
      }
    }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['content'] });
  } catch {}
}

/** Inline <head> version, runs before first paint. */
export const TABLET_VIEWPORT_SCRIPT = `(${tabletViewport.toString()})()`;
