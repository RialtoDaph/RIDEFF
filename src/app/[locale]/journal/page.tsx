import JournalPage from '@/components/dc/JournalPage';
import { getPosts, formatDate } from '@/lib/journal';
import { getLocale } from 'next-intl/server';
import { sitePage } from '@/lib/page';

/** Real posts from content/journal (German only for now) are listed in both locales. */
async function Journal() {
  const locale = await getLocale();
  const posts = getPosts().map((p) => ({ ...p, dateLabel: formatDate(p.date, locale) }));
  return <JournalPage posts={posts} />;
}

const p = sitePage('/journal', ['Journal', 'journal', 'newsletter'], Journal);
export const generateMetadata = p.generateMetadata;
export default p.Page;
