import PricingPage from '@/components/dc/PricingPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/pricing', ['Pricing'], PricingPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
