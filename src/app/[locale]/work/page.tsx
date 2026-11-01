import WorkPage from '@/components/dc/WorkPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/work', ['Work'], WorkPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
