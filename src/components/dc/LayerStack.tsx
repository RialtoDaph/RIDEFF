'use client';
import type { CSSProperties, ReactNode } from 'react';
import '@/styles/dc-visuals.css';

/**
 * The six platform layers as a labelled stack of real cards (Build "Sechs Ebenen. Als eins
 * gebaut." and Run "Sechs Ebenen. Jede Nacht geprüft."). Flat on phones, tilted in 3D from
 * tablet up; all sizing comes from the content, nothing is cropped. Styles: dc-visuals.css.
 */
export type StackLayer = {
  /** "01" … "06" */
  n: string;
  name: string;
  /** One plain line: what this layer is. */
  meaning: string;
  color: string;
  on: boolean;
  /** Run: this layer's nightly check has passed. */
  done?: boolean;
  /** Build: concrete example, shown while the layer is active. */
  detail?: string;
  /** Run: check result ("Seiten 0,8 s"). */
  status?: string;
  statusColor?: string;
  go?: () => void;
};

const ICONS: ReactNode[] = [
  // Apps: phone in front of a window
  <path key="0" d="M3 5.5h12v9H3zM3 8h12M13 10.5h7v9h-7zM15.5 17.5h2" />,
  // AI agents: spark
  <path key="1" d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9zM18.5 16.5v4M16.5 18.5h4" />,
  // Automations: loop
  <path key="2" d="M4 11a8 8 0 0 1 14-5l2 2M20 4v4h-4M20 13a8 8 0 0 1-14 5l-2-2M4 20v-4h4" />,
  // Data core: database
  <path key="3" d="M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />,
  // Entry points: inbox
  <path key="4" d="M12 3v9M8.5 8.5L12 12l3.5-3.5M3 13h5l1.5 3h5l1.5-3h5v7H3z" />,
  // Integrations: plug
  <path key="5" d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />,
];

export default function LayerStack({
  layers,
  detailLabel,
  flow,
  flowLabel,
  footer,
  flowing = false,
}: {
  layers: StackLayer[];
  detailLabel?: string;
  /** Build: the three stops of the data flow, top to bottom. */
  flow?: string[];
  flowLabel?: string;
  footer?: ReactNode;
  /** Show the pulse travelling down the connector. */
  flowing?: boolean;
}) {
  return (
    <div className="ls">
      <div className="ls-scene">
        <div className="ls-stack">
          <span className="ls-rail" aria-hidden="true">
            {flowing ? <i /> : null}
          </span>
          {layers.map((l, i) => {
            const style = { '--c': l.color, '--sc': l.statusColor } as CSSProperties;
            const body = (
              <>
                <span className="ls-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[i % ICONS.length]}
                  </svg>
                </span>
                <span className="ls-main">
                  <span className="ls-name">
                    <em>{l.n}</em>
                    {l.name}
                  </span>
                  <span className="ls-mean">{l.meaning}</span>
                </span>
                {l.status ? (
                  <span className="ls-status">
                    <i />
                    {l.status}
                  </span>
                ) : null}
                {l.detail ? (
                  <span className="ls-detail">
                    <span>
                      <span className="ls-ex">
                        {detailLabel ? <b>{detailLabel}</b> : null}
                        {l.detail}
                      </span>
                    </span>
                  </span>
                ) : null}
                {l.on && l.status ? <span className="ls-sweep" aria-hidden="true" /> : null}
              </>
            );
            return l.go ? (
              <button key={i} type="button" className="ls-card" data-on={l.on} aria-pressed={l.on} style={style} onClick={l.go}>
                {body}
              </button>
            ) : (
              <div key={i} className="ls-card" data-on={l.on} data-done={!!l.done} style={style}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
      {flow?.length ? (
        <div className="ls-flow">
          {flowLabel}
          {flow.map((f, i) => (
            <span key={i}>{f}</span>
          )).flatMap((el, i) => (i ? [<b key={'a' + i} aria-hidden="true">{'→'}</b>, el] : [el]))}
        </div>
      ) : null}
      {footer ? <div className="ls-foot">{footer}</div> : null}
    </div>
  );
}
