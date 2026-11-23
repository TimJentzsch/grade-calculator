import type { CurriculumDefinition } from './definition.ts';

/**
 * The Computer Science M.Sc. at RWTH Aachen, PO 2023.
 *
 * Electives (58–66 CP, at least 12 CP in three areas, one of them Theoretical Computer Science)
 * and the application area (10–18 CP) are chosen freely, so their modules are added by the user
 * (§ 4 (2)). The 58–66 CP span all five elective areas, which the per-area limits can't express,
 * and neither can the 12 CP in two further areas. They follow from the 120 CP in total instead.
 * Credits beyond the limits have to be marked as additional modules (ÜPO § 8).
 *
 * If all modules are completed within the standard period of study, one module with at most
 * 15 CP may be eliminated, but not the focus colloquium (§ 8 (5)).
 */
const computerScienceMsc2023: CurriculumDefinition = {
  id: 'rwth-computer-science-msc-2023',
  name: 'Computer Science M.Sc. (PO 2023)',
  eliminationLimit: 1,
  eliminationCPLimit: 15,
  minCredits: 120,
  maxCredits: 120,
  moduleAreas: [
    {
      id: 'theoretical',
      name: 'Theoretical Computer Science',
      minCredits: 12,
      openChoice: true,
      modules: [],
    },
    { id: 'graphics', name: 'Graphics and Interaction', openChoice: true, modules: [] },
    { id: 'hardware-software', name: 'Hardware/Software Systems', openChoice: true, modules: [] },
    { id: 'ai-data', name: 'AI & Data', openChoice: true, modules: [] },
    {
      id: 'software-development',
      name: 'Software Development Methods and Tools',
      openChoice: true,
      modules: [],
    },
    {
      id: 'application-area',
      name: 'Application Area',
      minCredits: 10,
      maxCredits: 18,
      openChoice: true,
      modules: [],
    },
    {
      id: 'seminar-lab',
      name: 'Seminar and Lab',
      modules: [
        { id: 'seminar', name: 'Seminar Computer Science', credits: 4 },
        { id: 'lab', name: 'Lab Computer Science', credits: 7 },
      ],
    },
    {
      id: 'focus-colloquium',
      name: 'Focus Colloquium',
      eliminationLimit: 0,
      modules: [
        // Counts four times its credits in the final grade (§ 8 (4))
        {
          id: 'focus-colloquium',
          name: 'Focus Colloquium (Schwerpunktkolloquium)',
          credits: 3,
          weight: 4,
        },
      ],
    },
    {
      id: 'thesis',
      name: 'Master Thesis',
      eliminationLimit: 0,
      modules: [{ id: 'thesis', name: 'Master Thesis (MT)', credits: 30 }],
    },
  ],
};

export default computerScienceMsc2023;
