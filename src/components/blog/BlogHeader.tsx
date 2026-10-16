import { Link } from '@/i18n/navigation';
import { RdeMark } from '../RdeMark';

/** Light header of the blog pages. */
export function BlogHeader() {
  return (
    <div className="site-x">
      <header className="flex items-center justify-between gap-6 py-6 border-b border-stone-350">
        <Link href="/" locale="de" className="flex items-center gap-[10px] min-h-[44px]" aria-label="RIDEFF">
          <RdeMark />
          <span className="font-bold text-[17px] tracking-[0.02em]">RIDEFF</span>
        </Link>
        <Link href="/blog" locale="de" className="font-mono text-[12px] tracking-[0.12em] text-zinc-600 hover:text-orange-500 py-3">
          BLOG
        </Link>
      </header>
    </div>
  );
}
