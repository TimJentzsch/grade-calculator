/** Limits that apply to a curriculum or one of its module areas. */
export interface Limits {
  /** The maximum number of modules that can be eliminated. */
  eliminationLimit?: number;
  /** The maximum sum of credits the eliminated modules can have. */
  eliminationCPLimit?: number;
  /** The credits that have to be reached at least, e.g. for areas whose modules are chosen freely. */
  minCredits?: number;
  /** The credits that may be reached at most. Further modules have to be additional modules. */
  maxCredits?: number;
}

/** A module that is part of the curriculum, e.g. a compulsory module. */
export interface ModuleDefinition {
  /** Unique within the curriculum, results of the user refer to it. */
  id: string;
  name: string;
  credits: number;
  /** The weighting of the module in the grade, 1 by default. */
  weight?: number;
  notGraded?: boolean;
}

/** A module area of the curriculum. */
export interface AreaDefinition extends Limits {
  /** Unique within the curriculum, modules chosen by the user refer to it. */
  id: string;
  name: string;
  /** Whether the student chooses the modules of this area, e.g. electives. */
  openChoice?: boolean;
  /** The modules that are given by the curriculum. */
  modules: ModuleDefinition[];
}

/**
 * The rules of a course of study: its module areas, fixed modules and limits.
 * It doesn't contain anything entered by the user, see `StudyObject` for that.
 */
export interface CurriculumDefinition extends Limits {
  /** Unique among all curricula, a study refers to it. */
  id: string;
  name: string;
  moduleAreas: AreaDefinition[];
}
