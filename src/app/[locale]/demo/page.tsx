import { DemoClient } from '@/components/site/DemoClient';
import { sitePage } from '@/lib/page';

/** Business demo with mock data: client-only, not indexed, no Nana. */
const p = sitePage('/demo', ['Demo'], DemoClient, { noindex: true });
export const generateMetadata = p.generateMetadata;
export default p.Page;
