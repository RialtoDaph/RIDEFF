'use client';

import dynamic from 'next/dynamic';

/** /demo is client-only (mock data, no SSR): RIDEFF Business Demo.dc.html. */
const BusinessDemo = dynamic(() => import('@/components/dc/BusinessDemo'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '100vh', background: '#F4F4F2' }} aria-busy="true" />,
});

export function DemoClient() {
  return <BusinessDemo />;
}
