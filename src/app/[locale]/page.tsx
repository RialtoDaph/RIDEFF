import HomePage from '@/components/dc/HomePage';
import { sitePage } from '@/lib/page';

const p = sitePage('/', ['Home'], HomePage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
