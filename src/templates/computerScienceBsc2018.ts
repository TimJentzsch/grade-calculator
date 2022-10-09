import type { Curriculum } from '$types/curriculumStructure';

export const computerScienceBsc2018: Curriculum = {
	name: 'Computer Science B.Sc. (2018)',
	eliminationSettings: {
		maxCp: 30,
	},
	moduleAreas: [
		// Applied Computer Science
		{
			name: 'Applied Computer Science',
			eliminationSettings: {
				maxCount: 1,
			},
			modules: [
				{
					name: 'Programming (Progra)',
					cp: 8,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Data Structures and Algorithms (DsAl)',
					cp: 8,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Databases and Information Systems (DbIs)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Software Engineering (SWT)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
			],
		},
		// Computer Engineering
		{
			name: 'Computer Engineering',
			eliminationSettings: {
				maxCount: 1,
			},
			modules: [
				{
					name: 'System Programming (PSP)',
					cp: 8,
					evaluation: {
						type: 'passing',
					},
				},
				{
					name: 'Introduction to Computer Engineering (TI)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Operating Systems and System Software (BuS)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Data Communication and Security (DatKom)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
			],
		},
		// Theoretical Computer Science
		{
			name: 'Theoretical Computer Science',
			eliminationSettings: {
				maxCount: 1,
			},
			modules: [
				{
					name: 'Formal Systems, Automata, Processes (FoSAP)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Computability and Complexity (BuK)',
					cp: 7,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Mathematical Logic I (MaLo)',
					cp: 7,
					evaluation: {
						type: 'grade',
					},
				},
			],
		},
		// Mathematics
		{
			name: 'Mathematics',
			eliminationSettings: {
				maxCount: 1,
			},
			modules: [
				{
					name: 'Discrete Structures (DS)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Calculus for Computer Science (AfI)',
					cp: 8,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Linear Algebra (LA)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Introduction to Applied Stochastics (Stocha)',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
			],
		},
		// Other Achievements
		{
			name: 'Other Achievements',
			eliminationSettings: {
				maxCount: 1,
			},
			modules: [
				{
					name: 'Mentoring in Informatics',
					cp: 1,
					evaluation: {
						type: 'passing',
					},
				},
				{
					name: 'Non-Technical Elective Module (NTW)',
					cp: 4,
					evaluation: {
						type: 'passing',
					},
				},
				{
					name: 'Software Project Lab (SPP)',
					cp: 6,
					evaluation: {
						type: 'grade',
						weight: 0.0,
					},
				},
				{
					name: 'Proseminar Computer Science',
					cp: 3,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Seminar Computer Science',
					cp: 5,
					evaluation: {
						type: 'grade',
					},
				},
			],
		},
		// Elective Modules
		{
			name: 'Elective Modules',
			eliminationSettings: {
				maxCount: 1,
			},
			modules: [
				{
					name: 'Elective Module',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Elective Module',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Elective Module',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Elective Module',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
			],
		},
		// Application Subject
		{
			name: 'Application Subject',
			eliminationSettings: {
				maxCount: 1,
			},
			modules: [
				{
					name: 'Application Module',
					cp: 8,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Application Module',
					cp: 8,
					evaluation: {
						type: 'grade',
					},
				},
				{
					name: 'Application Module',
					cp: 6,
					evaluation: {
						type: 'grade',
					},
				},
			],
		},
		// Bachelor Thesis
		{
			name: 'Bachelor Thesis',
			eliminationSettings: {
				maxCount: 0,
			},
			modules: [
				{
					name: 'Bachelor Thesis',
					cp: 15,
					evaluation: {
						type: 'grade',
						weight: 1.5,
					},
				},
			],
		},
	],
};
