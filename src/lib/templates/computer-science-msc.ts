import type { CurriculumObject } from '../model/curriculum.svelte';

/**
 * The Computer Science M.Sc. at RWTH Aachen, PO 2023.
 *
 * Electives (58–66 CP, at least 12 CP in three areas, one of them Theoretical Computer Science)
 * and the application area (10–18 CP) are chosen freely, so their modules are added by the user.
 * Only the minimum credits are required per area, the rest follows from the 120 CP in total.
 *
 * If all modules are completed within the standard period of study, one module with at most
 * 15 CP may be eliminated, but not the focus colloquium (§ 8 (5)).
 */
const computerScienceMsc: CurriculumObject = {
  name: 'Computer Science M.Sc. (PO 2023)',
  eliminationLimit: 1,
  eliminationCPLimit: 15,
  requiredCredits: 120,
  moduleAreas: [
    { name: 'Theoretical Computer Science', requiredCredits: 12, modules: [] },
    { name: 'Graphics and Interaction', modules: [] },
    { name: 'Hardware/Software Systems', modules: [] },
    { name: 'AI & Data', modules: [] },
    { name: 'Software Development Methods and Tools', modules: [] },
    { name: 'Application Area', requiredCredits: 10, modules: [] },
    {
      name: 'Seminar and Lab',
      modules: [
        { name: 'Seminar Computer Science', credits: 4 },
        { name: 'Lab Computer Science', credits: 7 },
      ],
    },
    {
      name: 'Focus Colloquium',
      eliminationLimit: 0,
      modules: [
        // Counts four times its credits in the final grade (§ 8 (4))
        { name: 'Focus Colloquium (Schwerpunktkolloquium)', credits: 3, weight: 4 },
      ],
    },
    {
      name: 'Master Thesis',
      eliminationLimit: 0,
      modules: [{ name: 'Master Thesis (MT)', credits: 30 }],
    },
  ],
};

export default computerScienceMsc;
