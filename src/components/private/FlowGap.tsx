import { getTranslations } from 'next-intl/server';

/**
 * 120vh breather (Life: between 02 and 03; Business: between 04 and 05). The statement stays centred while the gap
 * scrolls past; the first line fades out and the orange second line fades in
 * (opacities driven by ScrollBackdrop).
 */
export async function FlowGap({
  id = 'p-flowgap',
  ns = 'life.flowGap',
  inkClassName = 'text-ink',
  ink2ClassName = 'text-[#E25C00]',
}: {
  id?: string;
  ns?: 'life.flowGap' | 'biz.flowGap';
  inkClassName?: string;
  ink2ClassName?: string;
}) {
  const t = await getTranslations(ns);
  const line = '[grid-area:1/1] text-[clamp(34px,5.5vw,56px)] font-bold tracking-[-0.045em] leading-[1.05] text-balance max-w-[900px]';
  return (
    <div id={id} className="relative h-[120vh]">
      <div data-flow-stick="" className="absolute left-0 right-0 top-0 grid place-items-center text-center px-5 md:px-14">
        <p data-flow-ink="" className={`${line} m-0 ${inkClassName}`}>{t('line1')}</p>
        <p data-flow-ink2="" className={`${line} m-0 ${ink2ClassName} opacity-0`}>{t('line2')}</p>
      </div>
    </div>
  );
}
