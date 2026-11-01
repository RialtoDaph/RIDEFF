import WorkbenchPage from '@/components/dc/WorkbenchPage';
import { sitePage } from '@/lib/page';

const p = sitePage('/build/team-apps', ['Workbench'], WorkbenchPage);
export const generateMetadata = p.generateMetadata;
export default p.Page;
