import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { formatDate, getPosts } from '@/lib/blog';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { TagLabel } from '@/components/blog/TagLabel';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = { title: 'Blog · RIDEFF', alternates: { canonical: '/blog' } };

/** Blog list (German only for now). */
export default async function BlogIndex({ params }: PageProps<'/[locale]/blog'>) {
  const { locale } = await params;
  if (locale !== 'de') notFound();
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = getPosts();

  return (
    <div data-light-page="" className="bg-stone-100 text-ink min-h-screen flex flex-col">
      <BlogHeader />
      <main id="main" className="site-x flex-1 py-[88px] flex flex-col gap-12">
        <h1 className="text-[clamp(44px,8vw,80px)] font-bold tracking-[-0.055em] leading-[0.96] m-0">{t('title')}</h1>
        <ul className="m-0 p-0 list-none flex flex-col border-t border-stone-200">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-stone-200">
              <Link href={`/blog/${p.slug}`} locale="de" className="group grid gap-3 md:grid-cols-[200px_minmax(0,1fr)] py-8">
                <div className="flex md:flex-col gap-3 md:gap-2 items-center md:items-start font-mono text-[12px] tracking-[0.06em] text-zinc-500">
                  <TagLabel tag={p.tag} label={t(`tags.${p.tag}`)} />
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span>{t('readingTime', { n: p.minutes })}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[clamp(26px,3.5vw,36px)] font-bold tracking-[-0.035em] leading-[1.1] m-0 group-hover:text-orange-500 transition-colors text-balance">
                    {p.title}
                  </h2>
                  {p.excerpt && <p className="text-[17px] leading-[1.55] text-zinc-600 m-0 max-w-[680px]">{p.excerpt}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer mode="business" onHome={false} />
    </div>
  );
}
