import type { CurriculumObject } from '../model/curriculum.svelte';

/** Six credits are the most common size of an elective module. */
const elective = { name: 'Elective Module', credits: 6 };

/**
 * The Computer Science M.Sc. at RWTH Aachen, PO 2023.
 *
 * Electives (58–66 CP, at least 12 CP in three areas, one of them Theoretical Computer Science)
 * and the application area (10–18 CP) are chosen freely, so the template has placeholders for the
 * 60 and 16 CP of the study plan.
 *
 * If all modules are completed within the standard period of study, one module with at most
 * 15 CP may be eliminated, but not the focus colloquium (§ 8 (5)).
 */
const computerScienceMsc: CurriculumObject = {
  name: 'RWTH Computer Science M.Sc. (PO 2023)',
  eliminationLimit: 1,
  eliminationCPLimit: 15,
  moduleAreas: [
    { name: 'Theoretical Computer Science', modules: [elective, elective] },
    { name: 'Graphics and Interaction', modules: [elective, elective] },
    { name: 'Hardware/Software Systems', modules: [elective, elective] },
    { name: 'AI & Data', modules: [elective, elective] },
    { name: 'Software Development Methods and Tools', modules: [elective, elective] },
    {
      name: 'Application Area',
      modules: [
        { name: 'Application Module', credits: 8 },
        { name: 'Application Module', credits: 8 },
      ],
    },
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
