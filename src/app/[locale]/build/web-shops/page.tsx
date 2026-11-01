import StorefrontPage from '@/components/dc/StorefrontPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/build/web-shops', ['Storefront'], StorefrontPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
