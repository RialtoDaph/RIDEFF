import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * Blog posts live in content/blog/*.mdx with front matter:
 *   title, date (YYYY-MM-DD), tag (business | life), excerpt
 * German only for now; the file name is the URL slug.
 */
export type PostTag = 'business' | 'life';
export type PostMeta = { slug: string; title: string; date: string; tag: PostTag; excerpt: string; minutes: number };

const DIR = path.join(process.cwd(), 'content/blog');

function read(file: string) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  const meta: PostMeta = {
    slug: file.replace(/\.mdx$/, ''),
    title: String(data.title),
    date: String(data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date),
    tag: data.tag === 'life' ? 'life' : 'business',
    excerpt: String(data.excerpt ?? ''),
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

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
