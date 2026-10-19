import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { PRIVATE_QUERY, type Mode } from '@/lib/site';

/**
 * BUSINESS / PRIVATE switch in the hero. Each side is a real link
 * (/ and /?for=private), so both pages are crawlable and shareable.
 */
export async function ModeToggle({ mode }: { mode: Mode }) {
  const t = await getTranslations('mode');
  const dark = mode === 'business';
  const item = (target: Mode) => {
    const active = target === mode;
    const base =
      'font-mono text-[12px] tracking-[0.12em] px-4 py-[9px] rounded-full transition-[background,color] duration-200 inline-flex items-center min-h-[36px]';
    const tone = active
      ? dark
        ? 'bg-white text-ink'
        : 'bg-ink text-white'
      : dark
        ? 'text-zinc-450 hover:text-white hover:bg-white/12'
        : 'text-zinc-500 hover:text-ink hover:bg-ink/6';
    return (
      <Link
        href={target === 'private' ? { pathname: '/', query: PRIVATE_QUERY } : '/'}
        scroll={false}
        aria-current={active ? 'page' : undefined}
        className={`${base} ${tone}`}
      >
        {t(target)}
      </Link>
    );
  };
  return (
    <div
      className={`inline-flex self-start gap-1 p-1 rounded-full border ${dark ? 'border-line-d4 bg-night-2' : 'border-zinc-300 bg-[#F4F4F5]'}`}
    >
      {item('business')}
      {item('private')}
    </div>
  );
}
