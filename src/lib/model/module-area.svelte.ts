import { formatAverageGrade, MAX_GRADE, MIN_GRADE } from '../grade';
import Module from './module.svelte';

/** The name of the module that stands for missing credits in the best and worst case. */
export const MISSING_CREDITS_NAME = 'Missing credits';

function sum<T>(items: T[], value: (item: T) => number): number {
  let total = 0;
  items.forEach((item) => {
    total += value(item);
  });
  return total;
}

export default class ModuleArea {
  /** The id of the area in the curriculum definition. */
  id: string | undefined;
  /** Whether the student chooses the modules of this area, e.g. electives. */
  openChoice = false;
  name: string | undefined = $state();
  modules: Module[] = $state([]);
  eliminationLimit: number | undefined = $state();
  eliminationCPLimit: number | undefined = $state();
  minCredits: number | undefined = $state();
  maxCredits: number | undefined = $state();

  /**
   * Creates a new module area.
   * @param name - The name of the module area.
   * @param modules - The modules available in this module area.
   * @param eliminationLimit - The maximum number of modules that can be eliminated.
   * @param eliminationCPLimit - The maximum sum of credits the eliminated modules can have.
   * @param minCredits - The credits that have to be reached at least in this module area.
   * @param maxCredits - The credits that may be reached at most in this module area.
   */
  constructor(
    name: string | undefined,
    modules: Module[],
    eliminationLimit?: number,
    eliminationCPLimit?: number,
    minCredits?: number,
    maxCredits?: number,
  ) {
    this.name = name;
    this.modules = modules;
    this.eliminationLimit = eliminationLimit;
    this.eliminationCPLimit = eliminationCPLimit;
    this.minCredits = minCredits;
    this.maxCredits = maxCredits;
  }

  /** The modules that count towards the curriculum, i.e. all except the additional modules. */
  get countedModules(): Module[] {
    return this.modules.filter((module) => !module.additional);
  }

  get credits(): number {
    return sum(this.countedModules, (module) => module.credits);
  }

  /** The credits that are still missing to reach the required credits, without open modules. */
  get missingCredits(): number {
    return Math.max(0, (this.minCredits ?? 0) - this.credits);
  }
  /** Whether the credits are below the minimum credits. */
  get belowMinCredits(): boolean {
    return this.minCredits !== undefined && this.credits < this.minCredits;
  }

  /** Whether the credits are above the maximum credits. */
  get aboveMaxCredits(): boolean {
    return this.maxCredits !== undefined && this.credits > this.maxCredits;
  }

  /** The credits this module area will have in the end, at least the required credits. */
  get plannedCredits(): number {
    return this.credits + this.missingCredits;
  }

  /** The total amount of eliminated credit points. */
  get eliminatedCredits(): number {
    return sum(this.eliminatedModules, (module) => module.credits);
  }

  /** The total number of eliminated modules. */
  get eliminatedModuleCount(): number {
    return this.eliminatedModules.length;
  }

  get completedModules(): Module[] {
    return this.countedModules.filter((module) => module.completed);
  }

  get gradedModules(): Module[] {
    return this.countedModules.filter((module) => module.isGraded && module.weight !== 0);
  }

  get eliminationGradedModules(): Module[] {
    return this.gradedModules.filter((module) => !module.eliminated);
  }

  get completedGradedModules(): Module[] {
    return this.completedModules.filter((module) => module.isGraded && module.weight !== 0);
  }

  /** The completed graded modules whose grade is known, see `Module.gradeUnknown`. */
  get knownGradeModules(): Module[] {
    return this.completedGradedModules.filter((module) => !module.gradeUnknown);
  }

  get eliminationCompletedGradedModules(): Module[] {
    return this.completedGradedModules.filter((module) => !module.eliminated);
  }

  get ungradedModules(): Module[] {
    return this.countedModules.filter((module) => !module.isGraded || module.weight === 0);
  }

  get completedUngradedModules(): Module[] {
    return this.completedModules.filter((module) => !module.isGraded || module.weight === 0);
  }

  /** The eliminated modules. */
  get eliminatedModules(): Module[] {
    return this.gradedModules.filter((module) => module.eliminated);
  }

  get weightedCredits(): number | undefined {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    return sum(this.knownGradeModules, (module) => module.weightedCredits);
  }

  get eliminationWeightedCredits(): number | undefined {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    return sum(this.eliminationCompletedGradedModules, (module) => module.weightedCredits);
  }

  get isGraded(): boolean {
    return this.gradedModules.length > 0;
  }

  get eliminationIsGraded(): boolean {
    return this.eliminationGradedModules.length > 0;
  }

  get gradeCompleted(): boolean {
    if (this.isGraded) {
      return this.completedGradedModules.length === this.gradedModules.length;
    }
    return this.completedModules.length === this.countedModules.length;
  }

  get gradePartiallyCompleted(): boolean {
    if (this.isGraded) {
      return this.knownGradeModules.length > 0;
    }
    return this.completedModules.length > 0;
  }

  get eliminationGradePartiallyCompleted(): boolean {
    if (this.eliminationIsGraded) {
      return this.eliminationCompletedGradedModules.length > 0;
    }
    return this.completedModules.length > 0;
  }

  get grade(): number | undefined {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }
    const weightedGrade = sum(this.knownGradeModules, (module) => module.weightedGrade);
    return weightedGrade / (this.weightedCredits as number);
  }

  get eliminationGrade(): number | undefined {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }
    const weightedGrade = sum(
      this.eliminationCompletedGradedModules,
      (module) => module.weightedGrade,
    );
    return weightedGrade / (this.eliminationWeightedCredits as number);
  }

  get gradeText(): string {
    if (!this.gradePartiallyCompleted) {
      return 'TBD';
    }

    if (!this.isGraded) {
      return 'B';
    }

    return formatAverageGrade(this.grade as number);
  }

  get eliminationGradeText(): string {
    if (!this.eliminationGradePartiallyCompleted) {
      return 'TBD';
    }

    if (!this.eliminationIsGraded) {
      return 'B';
    }

    return formatAverageGrade(this.eliminationGrade as number);
  }

  get weightedGrade(): number | undefined {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    return (this.grade as number) * (this.weightedCredits as number);
  }

  get eliminationWeightedGrade(): number | undefined {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    return (this.eliminationGrade as number) * (this.eliminationWeightedCredits as number);
  }

  get isEmpty(): boolean {
    return !this.name && this.modules.length === 0;
  }

  get hasValidEliminationCount(): boolean {
    return this.eliminationLimit !== undefined
      ? this.eliminatedModuleCount <= this.eliminationLimit
      : true;
  }

  get hasValidEliminationCP(): boolean {
    return this.eliminationCPLimit !== undefined
      ? this.eliminatedCredits <= this.eliminationCPLimit
      : true;
  }

  get isValidElimination(): boolean {
    return this.hasValidEliminationCount && this.hasValidEliminationCP;
  }

  /** Copies the references to the curriculum definition to the given area. */
  private withRefs(area: ModuleArea): ModuleArea {
    area.id = this.id;
    area.openChoice = this.openChoice;
    return area;
  }

  addModule(module: Module): void {
    this.modules.push(module);
  }

  /**
   * Completes the module area with the given grade for all open modules and missing credits.
   * Missing credits are assumed to be graded, as a module with that grade.
   */
  private completedWith(grade: number, complete: (module: Module) => Module): ModuleArea {
    const modules = this.modules.map(complete);
    if (this.missingCredits > 0) {
      modules.push(new Module(MISSING_CREDITS_NAME, this.missingCredits, grade));
    }
    return this.withRefs(
      new ModuleArea(
        this.name,
        modules,
        this.eliminationLimit,
        this.eliminationCPLimit,
        this.minCredits,
        this.maxCredits,
      ),
    );
  }

  /** The module area with the best grade for all open modules and missing credits. */
  bestCase(): ModuleArea {
    return this.completedWith(MIN_GRADE, (module) => module.bestCase());
  }

  /** The module area with the worst passing grade for all open modules and missing credits. */
  worstCase(): ModuleArea {
    return this.completedWith(MAX_GRADE, (module) => module.worstCase());
  }

  clone(): ModuleArea {
    return this.withRefs(
      new ModuleArea(
        this.name,
        this.modules.map((module) => module.clone()),
        this.eliminationLimit,
        this.eliminationCPLimit,
        this.minCredits,
        this.maxCredits,
      ),
    );
  }
}
