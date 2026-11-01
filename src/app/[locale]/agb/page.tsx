import LegalPage from '@/components/dc/LegalPage';
import { sitePage } from '@/lib/page';

/** German only (RIDEFF Rechtliches.dc.html → #agb). /en/agb redirects here. */
function Section() {
  return <LegalPage section="agb" />;
}

const p = sitePage('/agb', [], Section, { germanOnly: true });
export const generateMetadata = p.generateMetadata;
export default p.Page;
