import type { Metadata } from 'next';
import type { ComponentPropsWithoutRef } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { formatDate, getPost, getPosts } from '@/lib/journal';
import { WHATSAPP_URL } from '@/lib/site';
import { socialMeta } from '@/lib/og';
import { Messages } from '@/components/site/Messages';
import Nav from '@/components/dc/Nav';
import Footer from '@/components/dc/Footer';

/** Posts are German only for now; /en/journal/<slug> redirects (src/proxy.ts). */
export function generateStaticParams() {
  return getPosts().map((p) => ({ locale: 'de', slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<'/[locale]/journal/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const social = await socialMeta('de');
  const image = post.meta.cover ? { url: post.meta.cover, alt: post.meta.title } : social.image;
  return {
    title: `${post.meta.title} · RIDEFF Journal`,
    description: post.meta.excerpt,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: { type: 'article', siteName: 'RIDEFF', locale: 'de_DE', title: post.meta.title, description: post.meta.excerpt, publishedTime: post.meta.date, images: [image] },
    twitter: { card: 'summary_large_image', images: [image] },
  };
}

/** Not designed in the handoff; README "old spec": 680px, Geist 18/1.65, H2 32px, orange links, CTA box at the end. */
const mdx = {
  h2: (p: ComponentPropsWithoutRef<'h2'>) => <h2 className="mt-14 mb-4 text-[clamp(26px,4vw,32px)] font-semibold leading-[1.12] tracking-[-0.035em] text-ink" {...p} />,
  h3: (p: ComponentPropsWithoutRef<'h3'>) => <h3 className="mt-10 mb-3 text-[22px] font-semibold tracking-[-0.025em] text-ink" {...p} />,
  p: (p: ComponentPropsWithoutRef<'p'>) => <p className="my-5" {...p} />,
  a: (p: ComponentPropsWithoutRef<'a'>) => <a className="text-orange underline underline-offset-2 hover:text-orange-deep" {...p} />,
  ul: (p: ComponentPropsWithoutRef<'ul'>) => <ul className="my-5 list-disc pl-6 marker:text-orange" {...p} />,
  ol: (p: ComponentPropsWithoutRef<'ol'>) => <ol className="my-5 list-decimal pl-6 marker:font-mono marker:text-orange" {...p} />,
  li: (p: ComponentPropsWithoutRef<'li'>) => <li className="my-2 pl-1" {...p} />,
  blockquote: (p: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-8 border-l-2 border-orange pl-5 text-[20px] leading-[1.5] font-medium text-ink" {...p} />
  ),
  strong: (p: ComponentPropsWithoutRef<'strong'>) => <strong className="font-semibold text-ink" {...p} />,
};

export default async function JournalPost({ params }: PageProps<'/[locale]/journal/[slug]'>) {
  const { locale, slug } = await params;
  if (locale !== 'de') notFound();
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();
  const { meta, content } = post;
  const t = await getTranslations('journal');
  const tj = await getTranslations('Journal');
  const cat = { understand: tj('understand'), build: tj('build'), run: tj('run'), notes: tj('notes') }[meta.category];

  return (
    <Messages namespaces={[]}>
      <Nav active="journal" />
      <main id="main" className="px-[clamp(20px,3vw,40px)] pt-[140px] pb-[120px]">
        <article className="mx-auto max-w-[680px]">
          <Link href="/journal" className="inline-block py-2 font-mono text-[11px] tracking-[.1em] text-muted uppercase hover:text-orange">
            {t('back')}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-[11px] tracking-[.08em] uppercase text-muted">
            <span className="text-orange">{cat}</span>
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
            <span>{t('readingTime', { n: meta.minutes })}</span>
          </div>
          <h1 className="mt-5 mb-0 text-[clamp(40px,6vw,64px)] font-semibold leading-[.98] tracking-[-0.05em]">{meta.title}</h1>
          <p className="mt-6 text-[19px] leading-[1.55] text-body">{meta.excerpt}</p>
          {meta.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={meta.cover} alt="" className="mt-10 block aspect-[16/10] w-full rounded-[20px] object-cover" />
          ) : null}
          <div className="mt-10 text-[18px] leading-[1.65] text-body">
            <MDXRemote source={content} components={mdx} />
          </div>

          <aside className="mt-16 flex flex-col items-start gap-5 rounded-[24px] bg-night p-[clamp(24px,4vw,40px)] text-on-dark">
            <span className="font-mono text-[12px] text-orange">{t('ctaKicker')}</span>
            <p className="m-0 text-[clamp(30px,4.5vw,44px)] font-semibold leading-[1] tracking-[-0.045em]">{t('ctaTitle')}</p>
            <p className="m-0 max-w-[460px] text-[16px] leading-[1.55] text-muted-dark">{t('ctaText')}</p>
            <div className="flex flex-wrap gap-3">
              <a href={WHATSAPP_URL} className="rounded-full bg-orange px-6 py-[14px] text-[15px] font-semibold text-ink hover:bg-orange-soft">
                {t('ctaWhatsApp')}
              </a>
              <Link href="/contact" className="rounded-full border border-on-dark px-6 py-[14px] text-[15px] font-medium hover:border-orange hover:text-orange">
                {t('ctaBook')}
              </Link>
            </div>
          </aside>
        </article>
      </main>
      <Footer />
    </Messages>
  );
}
