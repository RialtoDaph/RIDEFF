import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Journal posts: content/journal/*.mdx (file name = URL slug), German only for now.
 * Front matter:
 *   title, date (YYYY-MM-DD), excerpt,
 *   category: understand | build | run | notes   (the Journal filter tags)
 *   cover: /images/… (optional)
 */
export const CATEGORIES = ['understand', 'build', 'run', 'notes'] as const;
export type Category = (typeof CATEGORIES)[number];
export type PostMeta = { slug: string; title: string; date: string; category: Category; excerpt: string; cover: string; minutes: number };

const DIR = path.join(process.cwd(), 'content/journal');

function read(file: string) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const category = (CATEGORIES as readonly string[]).includes(data.category) ? (data.category as Category) : 'notes';
  const meta: PostMeta = {
    slug: file.replace(/\.mdx$/, ''),
    title: String(data.title),
    date: String(data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date),
    category,
    excerpt: String(data.excerpt ?? ''),
    cover: String(data.cover ?? '/images/rialto-about.jpg'),
    minutes: Math.max(1, Math.round(words / 200)),
  };
  return { meta, content };
}

export function getPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => read(f).meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  const file = `${slug}.mdx`;
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(path.join(DIR, file))) return null;
  return read(file);
}

export const formatDate = (iso: string, locale = 'de') =>
  new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
