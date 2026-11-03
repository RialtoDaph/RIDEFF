'use client';

import { useSyncExternalStore } from 'react';

/**
 * Owner-only shortcut to the private RIDEFF Report (claude.ai artifact) where the
 * owner leaves feedback. Hidden for visitors: it appears only in a browser where
 * the owner opened any page with `?report=on` once (remembered in localStorage);
 * `?report=off` hides it again. The report itself is private, so the link is
 * useless to anyone else even if they found it.
 */
const REPORT_URL = 'https://claude.ai/artifact/44G2XpY9G9X9Pj5shcoeFE';
const KEY = 'rideff-report';

function isOn(): boolean {
  try {
    const p = new URLSearchParams(window.location.search).get('report');
    if (p === 'on') localStorage.setItem(KEY, '1');
    if (p === 'off') localStorage.removeItem(KEY);
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

const subscribe = () => () => {};

export default function ReportButton() {
  const on = useSyncExternalStore(subscribe, isOn, () => false);

  if (!on) return null;

  return (
    <a
      className="nana-report"
      href={REPORT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="RIDEFF Report"
      title="RIDEFF Report"
      style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: '#FF6A00',
        color: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 12px 30px rgba(10,10,10,.2)',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 3.5h6v2.5H9z" />
        <path d="m9 12 2 2 4-4" />
        <path d="M9 17h6" />
      </svg>
    </a>
  );
}
