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

  get completedGradedModules() {
    return this.completedModules.filter((module) => module.isGraded);
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

  get isGraded() {
    return this.gradedModules.length > 0;
  }

  get gradeCompleted() {
    return this.completedGradedModules.length === this.gradedModules.length;
  }

  get gradePartiallyCompleted() {
    return this.gradeCompleted || this.completedGradedModules.length > 0;
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

  get gradeText() {
    if (!this.gradePartiallyCompleted) {
      return 'TBD';
    }

    if (!this.isGraded) {
      return 'B';
    }

    return this.grade.toFixed(2);
  }

  get weightedGrade() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    return this.grade * this.weightedCredits;
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
