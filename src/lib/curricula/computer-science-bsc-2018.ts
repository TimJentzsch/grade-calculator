import type { CurriculumDefinition } from './definition.ts';

/**
 * The Computer Science B.Sc. at RWTH Aachen, PO 2018.
 *
 * Electives (24 CP) and the application subject (22 CP) are chosen freely, so their modules are
 * added by the user (§ 5 (2)). If more electives are taken than required, they count in the
 * order the exams were taken (§ 10 (4)); the others have to be marked as additional modules.
 * The rule that at least one elective has to be from Theoretical Computer Science can't be
 * expressed.
 *
 * If all modules are completed within the standard period of study, one module per area with
 * at most 30 CP in total may be eliminated, but not the bachelor thesis (§ 10 (5)).
 */
const computerScienceBsc2018: CurriculumDefinition = {
  id: 'rwth-computer-science-bsc-2018',
  name: 'Computer Science B.Sc. (PO 2018)',
  eliminationCPLimit: 30,
  minCredits: 180,
  maxCredits: 180,
  moduleAreas: [
    {
      id: 'applied',
      name: 'Applied Computer Science',
      eliminationLimit: 1,
      modules: [
        { id: 'progra', name: 'Programming (Progra)', credits: 8 },
        { id: 'dsal', name: 'Data Structures and Algorithms (DsAl)', credits: 8 },
        { id: 'dbis', name: 'Databases and Information Systems (DbIs)', credits: 6 },
        { id: 'swt', name: 'Software Engineering (SWT)', credits: 6 },
      ],
    },
    {
      id: 'computer-engineering',
      name: 'Computer Engineering',
      eliminationLimit: 1,
      modules: [
        { id: 'psp', name: 'System Programming (PSP)', credits: 8, notGraded: true },
        { id: 'ti', name: 'Introduction to Computer Engineering (TI)', credits: 6 },
        { id: 'bus', name: 'Operating Systems and System Software (BuS)', credits: 6 },
        { id: 'datkom', name: 'Data Communication and Security (DatKom)', credits: 6 },
      ],
    },
    {
      id: 'theoretical',
      name: 'Theoretical Computer Science',
      eliminationLimit: 1,
      modules: [
        { id: 'fosap', name: 'Formal Systems, Automata, Processes (FoSAP)', credits: 6 },
        { id: 'buk', name: 'Computability and Complexity (BuK)', credits: 7 },
        { id: 'malo', name: 'Mathematical Logic I (MaLo)', credits: 7 },
      ],
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      eliminationLimit: 1,
      modules: [
        { id: 'ds', name: 'Discrete Structures (DS)', credits: 6 },
        { id: 'afi', name: 'Calculus for Computer Science (AfI)', credits: 8 },
        { id: 'la', name: 'Linear Algebra (LA)', credits: 6 },
        { id: 'stocha', name: 'Introduction to Applied Stochastics (Stocha)', credits: 6 },
      ],
    },
    {
      id: 'other',
      name: 'Other Achievements',
      eliminationLimit: 1,
      modules: [
        { id: 'mentoring', name: 'Mentoring in Informatics', credits: 1, notGraded: true },
        { id: 'ntw', name: 'Non-Technical Elective Module (NTW)', credits: 4, notGraded: true },
        // § 10 (4) excludes the SPP from the final grade, but the ZPA counts it:
        // real Notenspiegels only match their final grade when it counts
        { id: 'spp', name: 'Software Project Lab (SPP)', credits: 6 },
        { id: 'proseminar', name: 'Proseminar Computer Science', credits: 3 },
        { id: 'seminar', name: 'Seminar Computer Science', credits: 5 },
      ],
    },
    {
      id: 'electives',
      name: 'Elective Modules',
      eliminationLimit: 1,
      minCredits: 24,
      maxCredits: 24,
      openChoice: true,
      modules: [],
    },
    {
      id: 'application-subject',
      name: 'Application Subject',
      eliminationLimit: 1,
      minCredits: 22,
      maxCredits: 22,
      openChoice: true,
      modules: [],
    },
    {
      id: 'thesis',
      name: 'Bachelor Thesis',
      eliminationLimit: 0,
      modules: [{ id: 'thesis', name: 'Bachelor Thesis (BT)', credits: 15, weight: 1.5 }],
    },
  ],
};

export default computerScienceBsc2018;
