'use client';
import type { CSSProperties } from 'react';
import '@/styles/dc-visuals.css';

/**
 * Case visual on Build: interface screenshot, system screenshot and spec card.
 * Phones: three stacked cards. Tablets: the interface in one tablet frame.
 * Desktop: a laptop with the system window overlapping, tilted slightly (only
 * from 1024px and without prefers-reduced-motion). Each screen box uses the real
 * pixel ratio of its screenshot, so nothing is cropped or stretched.
 */
export default function DeviceMockup({
  srcUi,
  altUi,
  sizeUi,
  labelUi,
  srcSys,
  altSys,
  sizeSys,
  labelSys,
  spec,
  labelSpec,
  progress = 1,
}: {
  srcUi: string;
  altUi: string;
  /** Real pixel size of the screenshot: [width, height]. */
  sizeUi: [number, number];
  labelUi: string;
  srcSys: string;
  altSys: string;
  sizeSys: [number, number];
  labelSys: string;
  spec: { k: string; v: string }[];
  labelSpec: string;
  /** 0 → 1 scroll progress; drives the small desktop parallax. */
  progress?: number;
}) {
  const style = {
    '--ar-ui': `${sizeUi[0]} / ${sizeUi[1]}`,
    '--ar-sys': `${sizeSys[0]} / ${sizeSys[1]}`,
    '--p': progress.toFixed(3),
  } as CSSProperties;
  const win = (cls: string, src: string, alt: string, size: [number, number], label: string) => (
    <figure className={'dm-win ' + cls}>
      <div className="dm-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{label}</span>
      </div>
      <span className="dm-screen">
        <img src={src} alt={alt} width={size[0]} height={size[1]} loading="lazy" decoding="async" />
      </span>
    </figure>
  );
  return (
    <div className="dm" style={style}>
      {win('dm-ui', srcUi, altUi, sizeUi, labelUi)}
      {win('dm-sys', srcSys, altSys, sizeSys, labelSys)}
      <div className="dm-spec">
        <dl>
          {spec.map((x, i) => (
            <div key={i}>
              <dt>{x.k}</dt>
              <dd>{x.v}</dd>
            </div>
          ))}
        </dl>
        <small>{labelSpec}</small>
      </div>
    </div>
  );
}
