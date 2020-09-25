const computerScienceBsc = {
  name: 'RWTH Computer Science B.Sc.',
  eliminationCPLimit: 30,
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
          weight: 0,
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
      modules: [
        {
          name: 'Elective Module',
          credits: 6,
        },
        {
          name: 'Elective Module',
          credits: 6,
        },
        {
          name: 'Elective Module',
          credits: 6,
        },
        {
          name: 'Elective Module',
          credits: 6,
        },
      ],
    },
    {
      name: 'Application Subject',
      eliminationLimit: 1,
      modules: [
        {
          name: 'Application Module',
          credits: 22,
        },
      ],
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
