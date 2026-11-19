import { formatAverageGrade } from '../grade';
import Module, { type ModuleObject } from './module.svelte';

/** The serialized form of a module area, as used in templates and saved files. */
export interface ModuleAreaObject {
  name?: string;
  modules: ModuleObject[];
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

export default class ModuleArea {
  name: string | undefined = $state();
  modules: Module[] = $state([]);
  eliminationLimit: number | undefined = $state();
  eliminationCPLimit: number | undefined = $state();

  /**
   * Creates a new module area.
   * @param name - The name of the module area.
   * @param modules - The modules available in this module area.
   * @param eliminationLimit - The maximum number of modules that can be eliminated.
   * @param eliminationCPLimit - The maximum sum of credits the eliminated modules can have.
   */
  constructor(
    name: string | undefined,
    modules: Module[],
    eliminationLimit?: number,
    eliminationCPLimit?: number,
  ) {
    this.name = name;
    this.modules = modules;
    this.eliminationLimit = eliminationLimit;
    this.eliminationCPLimit = eliminationCPLimit;
  }

  get credits(): number {
    return sum(this.modules, (module) => module.credits);
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
    return this.modules.filter((module) => module.completed);
  }

  get gradedModules(): Module[] {
    return this.modules.filter((module) => module.isGraded && module.weight !== 0);
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
    return this.modules.filter((module) => !module.isGraded || module.weight === 0);
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
    return this.completedModules.length === this.modules.length;
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

  addModule(module: Module): void {
    this.modules.push(module);
  }

  bestCase(): ModuleArea {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.bestCase()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  worstCase(): ModuleArea {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.worstCase()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  clone(): ModuleArea {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.clone()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  toObject(): ModuleAreaObject {
    return {
      name: this.name,
      modules: this.modules.map((module) => module.toObject()),
      eliminationLimit: this.eliminationLimit,
      eliminationCPLimit: this.eliminationCPLimit,
    };
  }

  static fromObject(obj: ModuleAreaObject): ModuleArea {
    return new ModuleArea(
      obj.name,
      obj.modules.map((moduleObj) => Module.fromObject(moduleObj)),
      obj.eliminationLimit,
      obj.eliminationCPLimit,
    );
  }
}
