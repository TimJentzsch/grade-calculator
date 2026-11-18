import type Module from './module.svelte';
import ModuleArea, { type ModuleAreaObject } from './module-area.svelte';

/** The serialized form of a curriculum, as used in templates and saved files. */
export interface CurriculumObject {
  name?: string;
  moduleAreas: ModuleAreaObject[];
  eliminationLimit?: number;
  eliminationCPLimit?: number;
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

  /**
   * Creates a new curriculum.
   * @param name - The name of the curriculum.
   * @param moduleAreas - The module areas available in the curriculum.
   * @param eliminationLimit - The maximum number of modules that can be eliminated.
   * @param eliminationCPLimit - The maximum sum of credits the eliminated modules can have.
   */
  constructor(
    name: string | undefined,
    moduleAreas: ModuleArea[],
    eliminationLimit?: number,
    eliminationCPLimit?: number,
  ) {
    this.name = name;
    this.moduleAreas = moduleAreas;
    this.eliminationLimit = eliminationLimit;
    this.eliminationCPLimit = eliminationCPLimit;
  }

  get credits(): number {
    return sum(this.moduleAreas, (moduleArea) => moduleArea.credits);
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

    return (this.grade as number).toFixed(2);
  }

  get eliminationGradeText(): string {
    if (!this.eliminationGradePartiallyCompleted) {
      return 'TBD';
    }

    if (!this.eliminationIsGraded) {
      return 'B';
    }

    return (this.eliminationGrade as number).toFixed(2);
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
    };
  }

  static fromObject(obj: CurriculumObject): Curriculum {
    return new Curriculum(
      obj.name,
      obj.moduleAreas.map((moduleAreaObj) => ModuleArea.fromObject(moduleAreaObj)),
      obj.eliminationLimit,
      obj.eliminationCPLimit,
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

  bestCase(): Curriculum {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.bestCase()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  worstCase(): Curriculum {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.worstCase()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  clone(): Curriculum {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.clone()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }
}
