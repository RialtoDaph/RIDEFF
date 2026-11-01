import LegalPage from '@/components/dc/LegalPage';
import { sitePage } from '@/lib/page';

/** German only (RIDEFF Rechtliches.dc.html → #datenschutz). /en/datenschutz redirects here. */
function Section() {
  return <LegalPage section="datenschutz" />;
}

const p = sitePage('/datenschutz', [], Section, { germanOnly: true });
export const generateMetadata = p.generateMetadata;
export default p.Page;
