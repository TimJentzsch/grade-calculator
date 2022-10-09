export interface GradeEvaluation {
	type: 'grade';

	/** The grade the student has been awarded. */
	grade?: number;

	/**
	 * The weight of the grade when calculating the average.
	 *
	 * Defaults to `1.0`.
	 */
	weight?: number;

	/**
	 * Has the student eliminated the grade?
	 *
	 * In this case, it won't be counted towards the average.
	 *
	 * Defaults to `false`.
	 */
	isEliminated?: boolean;
}

export interface PassingEvaluation {
	type: 'passing';

	/**
	 * Has the student passed the module?
	 *
	 * Defaults to `false`.
	 */
	hasPassed?: boolean;
}

export type Evaluation = GradeEvaluation | PassingEvaluation;
