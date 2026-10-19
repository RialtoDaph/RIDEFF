import type { ReactNode } from 'react';

/** "01 DAS PROBLEM" eyebrow plus section H2. The number anchors the flow line. */
export function SectionHead({
  num,
  label,
  title,
  tone = 'light',
  className = '',
  titleClassName = '',
  id,
}: {
  num: string;
  label: string;
  title: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
  titleClassName?: string;
  id?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 max-w-[760px] ${className}`}>
      <div
        className={`font-mono text-[12px] tracking-[0.12em] flex gap-[10px] ${tone === 'dark' ? 'text-zinc-450' : 'text-muted'}`}
      >
        <span data-sec-num="" className="text-orange-500">
          {num}
        </span>
        <span>{label}</span>
      </div>
      <h2
        id={id}
        className={`text-[clamp(36px,6vw,52px)] font-bold tracking-[-0.045em] leading-none m-0 text-balance ${titleClassName}`}
      >
        {title}
      </h2>
    </div>
  );
}

