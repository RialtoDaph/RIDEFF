import RunPage from '@/components/dc/RunPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/run', ['Run'], RunPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
