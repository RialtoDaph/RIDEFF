import UnderstandPage from '@/components/dc/UnderstandPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/understand', ['Understand'], UnderstandPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
