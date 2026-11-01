import LifePage from '@/components/dc/LifePage';
import { sitePage } from '@/lib/page';

const p = sitePage('/life', ['Life'], LifePage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
