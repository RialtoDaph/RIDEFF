import LegalPage from '@/components/dc/LegalPage';
import { sitePage } from '@/lib/page';

/** German only (RIDEFF Rechtliches.dc.html → #impressum). /en/impressum redirects here. */
function Section() {
  return <LegalPage section="impressum" />;
}

const p = sitePage('/impressum', [], Section, { germanOnly: true });
export const generateMetadata = p.generateMetadata;
export default p.Page;
