import { getTranslations } from 'next-intl/server';

/**
 * 120vh breather between 02 and 03. The statement stays centred while the gap
 * scrolls past; the first line fades out and the orange second line fades in
 * (opacities driven by ScrollBackdrop).
 */
export async function FlowGap() {
  const t = await getTranslations('life.flowGap');
  const line = '[grid-area:1/1] text-[clamp(34px,5.5vw,56px)] font-bold tracking-[-0.045em] leading-[1.05] text-balance max-w-[900px]';
  return (
    <div id="p-flowgap" className="relative h-[120vh]">
      <div data-flow-stick="" className="absolute left-0 right-0 top-0 grid place-items-center text-center px-5 md:px-14">
        <p data-flow-ink="" className={`${line} m-0 text-ink`}>{t('line1')}</p>
        <p data-flow-ink2="" className={`${line} m-0 text-[#E25C00] opacity-0`}>{t('line2')}</p>
      </div>
    </div>
  );
}
