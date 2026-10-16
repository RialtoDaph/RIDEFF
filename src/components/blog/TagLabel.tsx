import type { PostTag } from '@/lib/blog';

export function TagLabel({ tag, label }: { tag: PostTag; label: string }) {
  return (
    <span
      className={`font-mono text-[11px] tracking-[0.1em] py-[3px] px-2 rounded-tag ${tag === 'life' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-ink text-white'}`}
    >
      {label}
    </span>
  );
}
