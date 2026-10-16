import type { Metadata } from 'next';
import type { ComponentPropsWithoutRef } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { formatDate, getPost, getPosts } from '@/lib/blog';
import { signupUrl } from '@/lib/site';
import { socialMeta } from '@/lib/og';
import { BlogHeader } from '@/components/blog/BlogHeader';
import { TagLabel } from '@/components/blog/TagLabel';
import { Footer } from '@/components/Footer';

export function generateStaticParams() {
  return getPosts().map((p) => ({ locale: 'de', slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const social = await socialMeta('de');
  return {
    twitter: social.twitter,
    title: `${post.meta.title} · RIDEFF`,
    description: post.meta.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: 'article', siteName: 'RIDEFF', locale: 'de_DE', title: post.meta.title, description: post.meta.excerpt, publishedTime: post.meta.date, images: [social.image] },
  };
}

/** Article typography from the README: 680px, Geist 18/1.65, H2 32px, orange links. */
const mdx = {
  h2: (p: ComponentPropsWithoutRef<'h2'>) => <h2 className="text-ink text-[clamp(26px,4vw,32px)] font-bold tracking-[-0.035em] leading-[1.15] mt-12 mb-4" {...p} />,
  h3: (p: ComponentPropsWithoutRef<'h3'>) => <h3 className="text-ink text-[22px] font-bold tracking-[-0.025em] mt-8 mb-3" {...p} />,
  p: (p: ComponentPropsWithoutRef<'p'>) => <p className="my-5" {...p} />,
  a: (p: ComponentPropsWithoutRef<'a'>) => <a className="text-orange-500 underline underline-offset-2 hover:text-orange-700" {...p} />,
  ul: (p: ComponentPropsWithoutRef<'ul'>) => <ul className="my-5 pl-6 list-disc marker:text-orange-500" {...p} />,
  ol: (p: ComponentPropsWithoutRef<'ol'>) => <ol className="my-5 pl-6 list-decimal marker:text-orange-500 marker:font-mono" {...p} />,
  li: (p: ComponentPropsWithoutRef<'li'>) => <li className="my-2 pl-1" {...p} />,
  blockquote: (p: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="my-8 pl-5 border-l-2 border-orange-500 text-[20px] leading-[1.5] font-medium text-ink" {...p} />
  ),
  strong: (p: ComponentPropsWithoutRef<'strong'>) => <strong className="font-semibold text-ink" {...p} />,
};

export default async function BlogPost({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params;
  if (locale !== 'de') notFound();
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();
  const { meta, content } = post;
  const t = await getTranslations();
  const biz = meta.tag === 'business';

  return (
    <div data-light-page="" className="bg-stone-100 text-ink min-h-screen flex flex-col">
      <BlogHeader />
      <main id="main" className="flex-1 px-5 pt-16 pb-24">
        <article className="max-w-[680px] mx-auto">
          <Link href="/blog" locale="de" className="font-mono text-[12px] tracking-[0.06em] text-zinc-500 hover:text-orange-500 py-2 inline-block">
            {t('blog.back')}
          </Link>
          <div className="flex flex-wrap gap-3 items-center font-mono text-[12px] tracking-[0.06em] text-zinc-500 mt-8">
            <TagLabel tag={meta.tag} label={t(`blog.tags.${meta.tag}`)} />
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
            <span>{t('blog.readingTime', { n: meta.minutes })}</span>
          </div>
          <h1 className="text-[clamp(36px,6vw,52px)] font-bold tracking-[-0.045em] leading-[1.02] mt-5 mb-0 text-balance">{meta.title}</h1>
          <div className="text-[18px] leading-[1.65] text-zinc-700 mt-8">
            <MDXRemote source={content} components={mdx} />
          </div>

          {/* CTA box matching the post's tag */}
          <aside className="mt-16 p-8 rounded-card-xl bg-ink-2 text-stone-50 flex flex-col gap-5 items-start bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:56px_56px]">
            <span className="font-mono text-[12px] tracking-[0.12em] text-orange-500">{biz ? 'RIDEFF BUSINESS' : 'RIDEFF LIFE'}</span>
            <p className="text-[clamp(28px,4.5vw,36px)] font-bold tracking-[-0.04em] leading-[1.05] m-0 text-balance">
              {biz
                ? t.rich('biz.kontakt.title', { accent: (c) => <span className="text-orange-500">{c}</span> })
                : t('life.start.title')}
            </p>
            {biz ? (
              <Link href="/#kontakt" locale="de" className="font-semibold text-[15px] py-[14px] px-6 rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors">
                {t('hero.business.cta')}
              </Link>
            ) : (
              <a href={signupUrl('plus', 'de')} className="font-semibold text-[15px] py-[14px] px-6 rounded-full bg-orange-500 text-white hover:bg-orange-450 transition-colors">
                {t('hero.private.cta')}
              </a>
            )}
          </aside>
        </article>
      </main>
      <Footer mode={meta.tag === 'life' ? 'private' : 'business'} onHome={false} />
    </div>
  );
}
