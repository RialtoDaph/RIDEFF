import { TicCase } from '@/components/work/CasePage';
import { sitePage } from '@/lib/page';

const p = sitePage('/work/tic-originals', ['Case'], TicCase);
export const generateMetadata = p.generateMetadata;
export default p.Page;
