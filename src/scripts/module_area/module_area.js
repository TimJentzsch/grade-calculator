import Module from '../module/module.js';

export default class ModuleArea {
  /**
   * Creates a new module area.
   * @param {string} name - The name of the module area.
   * @param {Module[]} modules - The modules available in this module area.
   * @param {number} eliminationLimit - The maximum number of modules that can be eliminated.
   * @param {number} eliminationCPLimit - The maximum sum of credits the eliminated modules can have.
   */
  constructor(name, modules, eliminationLimit, eliminationCPLimit) {
    this.name = name;
    this.modules = modules;
    this.eliminationLimit = eliminationLimit;
    this.eliminationCPLimit = eliminationCPLimit;
  }

  get credits() {
    let credits = 0;
    this.modules.forEach((module) => {
      credits += module.credits;
    });
    return credits;
  }

  /** The total amount of eliminated credit points. */
  get eliminatedCredits() {
    let credits = 0;

    this.eliminatedModules.forEach((module) => {
      credits += module.credits;
    });

    return credits;
  }

  /** The total number of eliminated modules. */
  get eliminatedModuleCount() {
    return this.eliminatedModules.length;
  }

  get completedModules() {
    return this.modules.filter((module) => module.completed);
  }

  get gradedModules() {
    return this.modules.filter((module) => module.isGraded);
  }

  get eliminationGradedModules() {
    return this.gradedModules.filter((module) => !module.eliminated);
  }

  get completedGradedModules() {
    return this.completedModules.filter((module) => module.isGraded);
  }

  get eliminationCompletedGradedModules() {
    return this.completedGradedModules.filter((module) => !module.eliminated);
  }

  get ungradedModules() {
    return this.modules.filter((module) => !module.isGraded);
  }

  get completedUngradedModules() {
    return this.completedModules.filter((module) => !module.isGraded);
  }

  /** The eliminated modules. */
  get eliminatedModules() {
    return this.gradedModules.filter((module) => module.eliminated);
  }

  get weightedCredits() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    let weightedCredits = 0;

    this.completedGradedModules.forEach((module) => {
      weightedCredits += module.weightedCredits;
    });

    return weightedCredits;
  }

  get eliminationWeightedCredits() {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    let weightedCredits = 0;

    this.eliminationCompletedGradedModules.forEach((module) => {
      weightedCredits += module.weightedCredits;
    });

    return weightedCredits;
  }

  get isGraded() {
    return this.gradedModules.length > 0;
  }

  get eliminationIsGraded() {
    return this.eliminationGradedModules.length > 0;
  }

  get gradeCompleted() {
    if (this.isGraded) {
      return this.completedGradedModules.length === this.gradedModules.length;
    }
    return this.completedModules.length === this.modules.length;
  }

  get gradePartiallyCompleted() {
    if (this.isGraded) {
      return this.completedGradedModules.length > 0;
    }
    return this.completedModules.length > 0;
  }

  get eliminationGradePartiallyCompleted() {
    if (this.eliminationIsGraded) {
      return this.eliminationCompletedGradedModules.length > 0;
    }
    return this.completedModules.length > 0;
  }

  get grade() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }
    let weightedGrade = 0;
    this.completedGradedModules.forEach((module) => {
      weightedGrade += module.weightedGrade;
    });
    return weightedGrade / this.weightedCredits;
  }

  get eliminationGrade() {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }
    let weightedGrade = 0;
    this.eliminationCompletedGradedModules.forEach((module) => {
      weightedGrade += module.weightedGrade;
    });
    return weightedGrade / this.eliminationWeightedCredits;
  }

  get gradeText() {
    if (!this.gradePartiallyCompleted) {
      return 'TBD';
    }

    if (!this.isGraded) {
      return 'B';
    }

    return this.grade.toFixed(2);
  }

  get eliminationGradeText() {
    if (!this.eliminationGradePartiallyCompleted) {
      return 'TBD';
    }

    if (!this.eliminationIsGraded) {
      return 'B';
    }

    return this.eliminationGrade.toFixed(2);
  }

  get weightedGrade() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    return this.grade * this.weightedCredits;
  }

  get eliminationWeightedGrade() {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    return this.eliminationGrade * this.eliminationWeightedCredits;
  }

  get isEmpty() {
    return !this.name && this.modules.length === 0;
  }

  addModule(module) {
    this.modules.push(module);
  }

  bestCase() {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.bestCase()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  worstCase() {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.worstCase()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  clone() {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.clone()),
      this.eliminationLimit,
      this.eliminationCPLimit,
    );
  }

  toObject() {
    return {
      name: this.name,
      modules: this.modules.map((module) => module.toObject()),
      eliminationLimit: this.eliminationLimit,
      eliminationCPLimit: this.eliminationCPLimit,
    };
  }

  static fromObject(obj) {
    return new ModuleArea(
      obj.name,
      obj.modules.map((moduleObj) => Module.fromObject(moduleObj)),
      obj.eliminationLimit,
      obj.eliminationCPLimit,
    );
  }
}
