import Module from '../module/module.js';

export default class ModuleArea {
  constructor(name, modules) {
    this.name = name;
    this.modules = modules;
  }

  get credits() {
    let credits = 0;
    this.modules.forEach((module) => {
      credits += module.credits;
    });
    return credits;
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
    );
  }

  worstCase() {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.worstCase()),
    );
  }

  clone() {
    return new ModuleArea(
      this.name,
      this.modules.map((module) => module.clone()),
    );
  }

  toObject() {
    return {
      name: this.name,
      modules: this.modules.map((module) => module.toObject()),
    };
  }

  static fromObject(obj) {
    return new ModuleArea(
      obj.name,
      obj.modules.map((moduleObj) => Module.fromObject(moduleObj)),
    );
  }
}
