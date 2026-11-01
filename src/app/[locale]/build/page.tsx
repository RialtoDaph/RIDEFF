import BuildPage from '@/components/dc/BuildPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/build', ['Build'], BuildPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
