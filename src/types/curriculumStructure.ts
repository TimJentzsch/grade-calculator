import type { Evaluation } from './evaluation';

export interface EliminationSettings {
	/** The maximum number of entities that can be eliminated. */
	maxCount: number;

	/** The maximum number of credit points that can be eliminated. */
	maxCp: number;
}

export interface Module {
	/** The name of the module. */
	name: string;

	/** The credit points awarded for the module. */
	cp: number;

	/** The evaluation of the module. */
	evaluation: Evaluation;
}

export interface ModuleArea {
	/** The name of the module area. */
	name: string;

	/** The modules included in this module area. */
	modules: Module[];

	/** The settings for eliminating grades in this module area. */
	eliminationSettings: EliminationSettings;
}

export interface Curriculum {
	/** The name of the curriciulum. */
	name: string;

	/** The module areas in this curriculum. */
	moduleAreas: ModuleArea[];

	/** The settings for eliminating grades in this curriculum. */
	eliminationSettings: EliminationSettings;
}
