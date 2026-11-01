import ContactPage from '@/components/dc/ContactPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/contact', ['Contact'], ContactPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
