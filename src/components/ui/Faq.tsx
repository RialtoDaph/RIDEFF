/** Native <details> accordion with the orange "+" marker. Shared by both modes. */
export function Faq({ items, tone = 'light' }: { items: [string, string][]; tone?: 'light' | 'dark' }) {
  const line = tone === 'dark' ? 'border-line-d3' : 'border-stone-250';
  return (
    <div className={`flex flex-col border-t ${line}`}>
      {items.map(([q, a]) => (
        <details key={q} className={`group border-b ${line} py-5`}>
          <summary className="cursor-pointer text-[19px] font-semibold tracking-[-0.01em] list-none flex justify-between gap-4 [&::-webkit-details-marker]:hidden min-h-[28px]">
            <span>{q}</span>
            <span className="text-orange-500" aria-hidden="true">
              +
            </span>
          </summary>
          <p className={`mt-3 mb-0 text-[15px] leading-[1.55] max-w-[720px] ${tone === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>{a}</p>
        </details>
      ))}
    </div>
  );
}
