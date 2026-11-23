import { formatAverageGrade, MAX_GRADE, MIN_GRADE } from '../grade';
import Module from './module.svelte';
import ModuleArea, { MISSING_CREDITS_NAME, type ModuleAreaObject } from './module-area.svelte';

/** The serialized form of a curriculum, as used in templates and saved files. */
export interface CurriculumObject {
  name?: string;
  moduleAreas: ModuleAreaObject[];
  eliminationLimit?: number;
  eliminationCPLimit?: number;
  /** The credits that have to be reached at least, e.g. for areas whose modules are chosen freely. */
  minCredits?: number;
  /** The credits that may be reached at most. Further modules have to be additional modules. */
  maxCredits?: number;
}

function sum<T>(items: T[], value: (item: T) => number): number {
  let total = 0;
  items.forEach((item) => {
    total += value(item);
  });
  return total;
}

export default class Curriculum {
  name: string | undefined = $state();
  moduleAreas: ModuleArea[] = $state([]);
  eliminationLimit: number | undefined = $state();
  eliminationCPLimit: number | undefined = $state();
  minCredits: number | undefined = $state();
  maxCredits: number | undefined = $state();

  /**
   * Creates a new curriculum.
   * @param name - The name of the curriculum.
   * @param moduleAreas - The module areas available in the curriculum.
   * @param eliminationLimit - The maximum number of modules that can be eliminated.
   * @param eliminationCPLimit - The maximum sum of credits the eliminated modules can have.
   * @param minCredits - The credits that have to be reached at least in this curriculum.
   * @param maxCredits - The credits that may be reached at most in this curriculum.
   */
  constructor(
    name: string | undefined,
    moduleAreas: ModuleArea[],
    eliminationLimit?: number,
    eliminationCPLimit?: number,
    minCredits?: number,
    maxCredits?: number,
  ) {
    this.name = name;
    this.moduleAreas = moduleAreas;
    this.eliminationLimit = eliminationLimit;
    this.eliminationCPLimit = eliminationCPLimit;
    this.minCredits = minCredits;
    this.maxCredits = maxCredits;
  }

  get credits(): number {
    return sum(this.moduleAreas, (moduleArea) => moduleArea.credits);
  }

  /**
   * The credits that are still missing to reach the required credits of the curriculum,
   * beyond those missing in the module areas. Open modules are not missing.
   */
  get missingCredits(): number {
    const planned = sum(this.moduleAreas, (moduleArea) => moduleArea.plannedCredits);
    return Math.max(0, (this.minCredits ?? 0) - planned);
  }
  /** Whether the credits are below the minimum credits. */
  get belowMinCredits(): boolean {
    return this.minCredits !== undefined && this.credits < this.minCredits;
  }

  /** Whether the credits are above the maximum credits. */
  get aboveMaxCredits(): boolean {
    return this.maxCredits !== undefined && this.credits > this.maxCredits;
  }

  /** Determines how many credits have been eliminated in total. */
  get eliminatedCredits(): number {
    return sum(this.eliminatedModules, (module) => module.credits);
  }

  /** Determines how many modules have been eliminated in total. */
  get eliminatedModuleCount(): number {
    return this.eliminatedModules.length;
  }

  get partiallyCompletedModuleAreas(): ModuleArea[] {
    return this.moduleAreas.filter((moduleArea) => moduleArea.gradePartiallyCompleted);
  }

  get eliminationPartiallyCompletedModuleAreas(): ModuleArea[] {
    return this.moduleAreas.filter((moduleArea) => moduleArea.eliminationGradePartiallyCompleted);
  }

  get completedModuleAreas(): ModuleArea[] {
    return this.moduleAreas.filter((moduleArea) => moduleArea.gradeCompleted);
  }

  get gradedModuleAreas(): ModuleArea[] {
    return this.moduleAreas.filter((moduleArea) => moduleArea.isGraded);
  }

  get eliminationGradedModuleAreas(): ModuleArea[] {
    return this.moduleAreas.filter((moduleArea) => moduleArea.eliminationIsGraded);
  }

  get partiallyCompletedGradedModuleAreas(): ModuleArea[] {
    return this.partiallyCompletedModuleAreas.filter((moduleArea) => moduleArea.isGraded);
  }

  get eliminationPartiallyCompletedGradedModuleAreas(): ModuleArea[] {
    return this.eliminationPartiallyCompletedModuleAreas.filter(
      (moduleArea) => moduleArea.eliminationIsGraded,
    );
  }

  get completedGradedModuleAreas(): ModuleArea[] {
    return this.completedModuleAreas.filter((moduleArea) => moduleArea.isGraded);
  }

  get ungradedModuleAreas(): ModuleArea[] {
    return this.moduleAreas.filter((moduleArea) => !moduleArea.isGraded);
  }

  get partiallyCompletetUngradedModuleAreas(): ModuleArea[] {
    return this.partiallyCompletedModuleAreas.filter((moduleArea) => !moduleArea.isGraded);
  }

  get completedUngradedModuleAreas(): ModuleArea[] {
    return this.completedModuleAreas.filter((moduleArea) => !moduleArea.isGraded);
  }

  get modules(): Module[] {
    return this.moduleAreas.flatMap((moduleArea) => moduleArea.modules);
  }

  get gradedModules(): Module[] {
    return this.moduleAreas.flatMap((moduleArea) => moduleArea.gradedModules);
  }

  /** The eliminated modules. */
  get eliminatedModules(): Module[] {
    return this.gradedModules.filter((module) => module.eliminated);
  }

  get weightedCredits(): number | undefined {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    return sum(
      this.partiallyCompletedGradedModuleAreas,
      (moduleArea) => moduleArea.weightedCredits as number,
    );
  }

  get eliminationWeightedCredits(): number | undefined {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    return sum(
      this.eliminationPartiallyCompletedGradedModuleAreas,
      (moduleArea) => moduleArea.eliminationWeightedCredits as number,
    );
  }

  get isGraded(): boolean {
    return this.gradedModuleAreas.length > 0;
  }

  get eliminationIsGraded(): boolean {
    return this.eliminationGradedModuleAreas.length > 0;
  }

  get gradeCompleted(): boolean {
    if (this.isGraded) {
      return this.completedGradedModuleAreas.length === this.gradedModuleAreas.length;
    }
    return this.completedModuleAreas.length === this.moduleAreas.length;
  }

  get gradePartiallyCompleted(): boolean {
    if (this.isGraded) {
      return this.partiallyCompletedGradedModuleAreas.length > 0;
    }
    return this.partiallyCompletedModuleAreas.length > 0;
  }

  get eliminationGradePartiallyCompleted(): boolean {
    if (this.eliminationIsGraded) {
      return this.eliminationPartiallyCompletedGradedModuleAreas.length > 0;
    }
    return this.partiallyCompletedModuleAreas.length > 0;
  }

  get grade(): number | undefined {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    const weightedGrade = sum(
      this.partiallyCompletedGradedModuleAreas,
      (moduleArea) => moduleArea.weightedGrade as number,
    );

    return weightedGrade / (this.weightedCredits as number);
  }

  get eliminationGrade(): number | undefined {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    const weightedGrade = sum(
      this.eliminationPartiallyCompletedGradedModuleAreas,
      (moduleArea) => moduleArea.eliminationWeightedGrade as number,
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

  get isValidElimination(): boolean {
    for (const moduleArea of this.moduleAreas) {
      if (!moduleArea.isValidElimination) {
        return false;
      }
    }

    const validCount = this.eliminationLimit
      ? this.eliminatedModuleCount <= this.eliminationLimit
      : true;

    if (!validCount) return false;

    const validCP = this.eliminationCPLimit
      ? this.eliminatedCredits <= this.eliminationCPLimit
      : true;

    if (!validCP) return false;

    return true;
  }

  toObject(): CurriculumObject {
    return {
      name: this.name,
      moduleAreas: this.moduleAreas.map((moduleArea) => moduleArea.toObject()),
      eliminationLimit: this.eliminationLimit,
      eliminationCPLimit: this.eliminationCPLimit,
      minCredits: this.minCredits,
      maxCredits: this.maxCredits,
    };
  }

  static fromObject(obj: CurriculumObject): Curriculum {
    return new Curriculum(
      obj.name,
      obj.moduleAreas.map((moduleAreaObj) => ModuleArea.fromObject(moduleAreaObj)),
      obj.eliminationLimit,
      obj.eliminationCPLimit,
      obj.minCredits,
      obj.maxCredits,
    );
  }

  resetElimination(): void {
    this.gradedModules.forEach((module) => {
      const newModule = module;
      newModule.eliminated = undefined;
    });
  }

  addModuleArea(moduleArea: ModuleArea): void {
    this.moduleAreas.push(moduleArea);
  }

  /**
   * Completes the curriculum with the given grade for all open modules and missing credits.
   * Credits missing beyond those of the module areas are added as a module area of their own.
   */
  private completedWith(grade: number, complete: (area: ModuleArea) => ModuleArea): Curriculum {
    const moduleAreas = this.moduleAreas.map(complete);
    if (this.missingCredits > 0) {
      moduleAreas.push(
        new ModuleArea(MISSING_CREDITS_NAME, [
          new Module(MISSING_CREDITS_NAME, this.missingCredits, grade),
        ]),
      );
    }
    return new Curriculum(
      this.name,
      moduleAreas,
      this.eliminationLimit,
      this.eliminationCPLimit,
      this.minCredits,
      this.maxCredits,
    );
  }

  /** The curriculum with the best grade for all open modules and missing credits. */
  bestCase(): Curriculum {
    return this.completedWith(MIN_GRADE, (moduleArea) => moduleArea.bestCase());
  }

  /** The curriculum with the worst passing grade for all open modules and missing credits. */
  worstCase(): Curriculum {
    return this.completedWith(MAX_GRADE, (moduleArea) => moduleArea.worstCase());
  }

  clone(): Curriculum {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.clone()),
      this.eliminationLimit,
      this.eliminationCPLimit,
      this.minCredits,
      this.maxCredits,
    );
  }
}
