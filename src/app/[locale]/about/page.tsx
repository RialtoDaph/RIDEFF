import AboutPage from '@/components/dc/AboutPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/about', ['About'], AboutPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
