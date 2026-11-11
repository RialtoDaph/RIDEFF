import { MamiCase } from '@/components/work/CasePage';
import { sitePage } from '@/lib/page';

const p = sitePage('/work/mami-patisserie', ['Case'], MamiCase);
export const generateMetadata = p.generateMetadata;
export default p.Page;
