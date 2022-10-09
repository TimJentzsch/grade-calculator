import type { Curriculum, ModuleArea } from '$types/curriculumStructure';

export interface EliminationCounts {
	/** The number of eliminated CPs. */
	cpCount: number;

	/** The number of eliminated modules. */
	moduleCount: number;
}

const INITIAL_ELIMINATION_COUNTS: EliminationCounts = {
	cpCount: 0,
	moduleCount: 0,
};

/** Count the eliminated CPs and modules in the given curriculum. */
export function curriculumEliminationCounts(curriciulum: Curriculum): EliminationCounts {
	return curriciulum.moduleAreas.reduce((prev, cur) => {
		const moduleAreaCounts = moduleAreaEliminationCounts(cur);

		return {
			cpCount: prev.cpCount + moduleAreaCounts.cpCount,
			moduleCount: prev.moduleCount + moduleAreaCounts.moduleCount,
		};
	}, INITIAL_ELIMINATION_COUNTS);
}

/** Count the eliminated CPs and modules in the given module area. */
export function moduleAreaEliminationCounts(moduleArea: ModuleArea): EliminationCounts {
	return moduleArea.modules.reduce((prev, cur) => {
		if (cur.evaluation.type === 'grade' && cur.evaluation.isEliminated === true) {
			return {
				cpCount: prev.cpCount + cur.cp,
				moduleCount: prev.moduleCount + 1,
			};
		} else {
			return prev;
		}
	}, INITIAL_ELIMINATION_COUNTS);
}
