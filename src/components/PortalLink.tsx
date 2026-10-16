import { getTranslations } from 'next-intl/server';
import { PORTAL_LIVE, PORTAL_URL } from '@/lib/site';

/**
 * "Kundenportal". Until NEXT_PUBLIC_PORTAL_LIVE=true it is plain text with a
 * small "Bald verfügbar" label and cannot be clicked.
 */
export async function PortalLink({ className = '', labelClassName = '' }: { className?: string; labelClassName?: string }) {
  const t = await getTranslations('nav');
  if (PORTAL_LIVE) {
    return (
      <a href={PORTAL_URL} className={className}>
        {t('portal')}
      </a>
    );
  }
  return (
    <span className={`inline-flex items-center gap-2 cursor-default ${className}`} aria-disabled="true">
      <span>{t('portal')}</span>
      <span
        className={`font-mono text-[10px] font-normal tracking-[0.06em] px-[7px] py-[2px] rounded-full border whitespace-nowrap ${labelClassName}`}
      >
        {t('portalSoon')}
      </span>
    </span>
  );
}
