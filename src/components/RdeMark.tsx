/**
 * Animated RIDEFF mark from the prototype: a glow pulse (rdeGlow) and a light
 * sweep (rdeShine) clipped to the mark's shape. Decorative; pair it with text.
 */
export function RdeMark({ height = 20 }: { height?: number }) {
  const mask = 'url(/brand/mark.png) no-repeat left top / auto 100%';
  return (
    <span className="block animate-rde-glow" style={{ height }} aria-hidden="true">
      <span
        className="relative block overflow-hidden"
        style={{ height, WebkitMask: mask, mask }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static mark, also used as mask */}
        <img src="/brand/mark.png" alt="" width={height * 2} height={height} className="block w-auto" style={{ height }} />
        <span className="absolute top-0 left-0 h-full w-[60%] animate-rde-shine bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]" />
      </span>
    </span>
  );
}
