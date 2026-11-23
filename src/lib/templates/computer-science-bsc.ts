import type { CurriculumObject } from '../model/curriculum.svelte';

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
const computerScienceBsc: CurriculumObject = {
  name: 'Computer Science B.Sc. (PO 2018)',
  eliminationCPLimit: 30,
  minCredits: 180,
  maxCredits: 180,
  moduleAreas: [
    {
      name: 'Applied Computer Science',
      eliminationLimit: 1,
      modules: [
        {
          name: 'Programming (Progra)',
          credits: 8,
        },
        {
          name: 'Data Structures and Algorithms (DsAl)',
          credits: 8,
        },
        {
          name: 'Databases and Information Systems (DbIs)',
          credits: 6,
        },
        {
          name: 'Software Engineering (SWT)',
          credits: 6,
        },
      ],
    },
    {
      name: 'Computer Engineering',
      eliminationLimit: 1,
      modules: [
        {
          name: 'System Programming (PSP)',
          credits: 8,
          notGraded: true,
        },
        {
          name: 'Introduction to Computer Engineering (TI)',
          credits: 6,
        },
        {
          name: 'Operating Systems and System Software (BuS)',
          credits: 6,
        },
        {
          name: 'Data Communication and Security (DatKom)',
          credits: 6,
        },
      ],
    },
    {
      name: 'Theoretical Computer Science',
      eliminationLimit: 1,
      modules: [
        {
          name: 'Formal Systems, Automata, Processes (FoSAP)',
          credits: 6,
        },
        {
          name: 'Computability and Complexity (BuK)',
          credits: 7,
        },
        {
          name: 'Mathematical Logic I (MaLo)',
          credits: 7,
        },
      ],
    },
    {
      name: 'Mathematics',
      eliminationLimit: 1,
      modules: [
        {
          name: 'Discrete Structures (DS)',
          credits: 6,
        },
        {
          name: 'Calculus for Computer Science (AfI)',
          credits: 8,
        },
        {
          name: 'Linear Algebra (LA)',
          credits: 6,
        },
        {
          name: 'Introduction to Applied Stochastics (Stocha)',
          credits: 6,
        },
      ],
    },
    {
      name: 'Other Achievements',
      eliminationLimit: 1,
      modules: [
        {
          name: 'Mentoring in Informatics',
          credits: 1,
          notGraded: true,
        },
        {
          name: 'Non-Technical Elective Module (NTW)',
          credits: 4,
          notGraded: true,
        },
        {
          name: 'Software Project Lab (SPP)',
          credits: 6,
        },
        {
          name: 'Proseminar Computer Science',
          credits: 3,
        },
        {
          name: 'Seminar Computer Science',
          credits: 5,
        },
      ],
    },
    {
      name: 'Elective Modules',
      eliminationLimit: 1,
      minCredits: 24,
      maxCredits: 24,
      modules: [],
    },
    {
      name: 'Application Subject',
      eliminationLimit: 1,
      minCredits: 22,
      maxCredits: 22,
      modules: [],
    },
    {
      name: 'Bachelor Thesis',
      eliminationLimit: 0,
      modules: [
        {
          name: 'Bachelor Thesis (BT)',
          credits: 15,
          weight: 1.5,
        },
      ],
    },
  ],
};

export default computerScienceBsc;
