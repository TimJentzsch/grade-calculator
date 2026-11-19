import type { CurriculumObject } from '../model/curriculum.svelte';
import computerScienceBsc from './computer-science-bsc';
import computerScienceMsc from './computer-science-msc';

const templates: CurriculumObject[] = [computerScienceBsc, computerScienceMsc];

export { computerScienceBsc, computerScienceMsc };
export default templates;
