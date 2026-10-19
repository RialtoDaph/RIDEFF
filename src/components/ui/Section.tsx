import type { ReactNode } from 'react';

/**
 * Section shell. The first child is the element the scroll backdrop dims when
 * the page tint does not match this section's tone.
 */
export function Section({
  id,
  children,
  className = '',
  innerClassName = '',
  labelledBy,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={className}>
      <div className={`transition-opacity duration-500 ${innerClassName}`}>{children}</div>
    </section>
  );
}
