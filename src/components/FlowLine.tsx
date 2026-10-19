/**
 * Scroll-driven connector line (positions and fill are set by ScrollBackdrop).
 * One node per numbered section; the orange fill follows the eased scroll probe.
 * Desktop only; decorative.
 */
export function FlowLine() {
  return (
    <div
      data-flow-line=""
      aria-hidden="true"
      className="hidden lg:block absolute top-0 w-0 h-0 pointer-events-none z-[5] opacity-0 transition-opacity duration-400"
      style={{ left: 'max(28px, calc((100% - 1280px) / 2 + 28px))' }}
    >
      <div className="absolute -left-px top-0 bottom-0 w-[2px] bg-[linear-gradient(rgba(140,140,140,0),rgba(140,140,140,0.35)_160px)]" />
      <div
        data-flow-fill=""
        className="absolute -left-px top-0 w-[2px] h-0 bg-[linear-gradient(rgba(255,106,0,0),#FF6A00_160px)] shadow-[0_0_10px_rgba(255,106,0,0.55)]"
      />
      <div
        data-flow-head=""
        className="absolute -left-[5px] -top-[5px] w-[10px] h-[10px] rounded-full bg-orange-500 shadow-[0_0_0_4px_rgba(255,106,0,0.18),0_0_16px_rgba(255,106,0,0.8)]"
      />
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          data-fn={i}
          className="absolute -left-[6px] top-0 w-3 h-3 rounded-full bg-ink-2 border-2 border-[rgba(140,140,140,0.55)] transition-[background,border-color,box-shadow] duration-300"
        >
          <div className="absolute left-[10px] top-[3px] h-[2px] w-0 bg-[rgba(140,140,140,0.35)] transition-[background] duration-300" />
        </div>
      ))}
    </div>
  );
}
