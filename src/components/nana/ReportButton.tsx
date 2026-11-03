'use client';

/**
 * Shortcut to the owner's private RIDEFF Report (claude.ai artifact) where the
 * owner leaves feedback. Shown to everyone while the site is pre-launch.
 * TODO(before launch): remove this button (see TODO.md). The report itself is
 * private and asks for a claude.ai sign-in, so it is useless to anyone else.
 */
const REPORT_URL = 'https://claude.ai/artifact/44G2XpY9G9X9Pj5shcoeFE';

export default function ReportButton() {
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
