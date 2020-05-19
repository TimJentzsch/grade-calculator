import ModuleArea from '../module_area/module_area.js';
import { merge } from '../util.js';

export default class Curriculum {
  constructor(name, moduleAreas, eliminationLimit) {
    this.name = name;
    this.moduleAreas = moduleAreas;
    this.eliminationLimit = eliminationLimit;
  }

  get credits() {
    let credits = 0;

    this.moduleAreas.forEach((moduleArea) => {
      credits += moduleArea.credits;
    });

    return credits;
  }

  get eliminatedCredits() {
    let credits = 0;

    this.eliminatedModules.forEach((module) => {
      credits += module.credits;
    });

    return credits;
  }

  get partiallyCompletedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => moduleArea.gradePartiallyCompleted);
  }

  get eliminationPartiallyCompletedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => moduleArea.eliminationGradePartiallyCompleted);
  }

  get completedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => moduleArea.gradeCompleted);
  }

  get gradedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => moduleArea.isGraded);
  }

  get eliminationGradedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => moduleArea.eliminationIsGraded);
  }

  get partiallyCompletedGradedModuleAreas() {
    return this.partiallyCompletedModuleAreas.filter((moduleArea) => moduleArea.isGraded);
  }

  get eliminationPartiallyCompletedGradedModuleAreas() {
    return this.eliminationPartiallyCompletedModuleAreas.filter(
      (moduleArea) => moduleArea.eliminationIsGraded,
    );
  }

  get completedGradedModuleAreas() {
    return this.completedModuleAreas.filter((moduleArea) => moduleArea.isGraded);
  }

  get ungradedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => !moduleArea.isGraded);
  }

  get partiallyCompletetUngradedModuleAreas() {
    return this.partiallyCompletedModuleAreas.filter((moduleArea) => !moduleArea.isGraded);
  }

  get completedUngradedModuleAreas() {
    return this.completedModuleAreas.filter((moduleArea) => !moduleArea.isGraded);
  }

  get modules() {
    const moduleArrays = this.moduleAreas.map((moduleArea) => moduleArea.modules);
    return merge(moduleArrays);
  }

  get gradedModules() {
    const moduleArrays = this.moduleAreas.map((moduleArea) => moduleArea.gradedModules);
    return merge(moduleArrays);
  }

  get eliminatedModules() {
    return this.gradedModules.filter((module) => module.eliminated);
  }

  get weightedCredits() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    let weightedCredits = 0;

    this.partiallyCompletedGradedModuleAreas.forEach((moduleArea) => {
      weightedCredits += moduleArea.weightedCredits;
    });

    return weightedCredits;
  }

  get eliminationWeightedCredits() {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    let weightedCredits = 0;

    this.eliminationPartiallyCompletedGradedModuleAreas.forEach((moduleArea) => {
      weightedCredits += moduleArea.eliminationWeightedCredits;
    });

    return weightedCredits;
  }

  get isGraded() {
    return this.gradedModuleAreas.length > 0;
  }

  get eliminationIsGraded() {
    return this.eliminationGradedModuleAreas.length > 0;
  }

  get gradeCompleted() {
    if (this.isGraded) {
      return this.completedGradedModuleAreas.length === this.gradedModuleAreas.length;
    }
    return this.completedModuleAreas.length === this.moduleAreas.length;
  }

  get gradePartiallyCompleted() {
    if (this.isGraded) {
      return this.partiallyCompletedGradedModuleAreas.length > 0;
    }
    return this.partiallyCompletedModuleAreas.length > 0;
  }

  get eliminationGradePartiallyCompleted() {
    if (this.eliminationIsGraded) {
      return this.eliminationPartiallyCompletedGradedModuleAreas.length > 0;
    }
    return this.partiallyCompletedModuleAreas.length > 0;
  }

  get grade() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    let weightedGrade = 0;

    this.partiallyCompletedGradedModuleAreas.forEach((moduleArea) => {
      weightedGrade += moduleArea.weightedGrade;
    });

    return weightedGrade / this.weightedCredits;
  }

  get eliminationGrade() {
    if (!this.eliminationIsGraded || !this.eliminationGradePartiallyCompleted) {
      return undefined;
    }

    let weightedGrade = 0;

    this.eliminationPartiallyCompletedGradedModuleAreas.forEach((moduleArea) => {
      weightedGrade += moduleArea.eliminationWeightedGrade;
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

  toObject() {
    return {
      name: this.name,
      moduleAreas: this.moduleAreas.map((moduleArea) => moduleArea.toObject()),
    };
  }

  static fromObject(obj) {
    const curriculum = new Curriculum(
      obj.name,
      obj.moduleAreas.map((moduleAreaObj) => ModuleArea.fromObject(moduleAreaObj)),
    );

    return curriculum;
  }

  resetElimination() {
    this.gradedModules.forEach((module) => {
      const newModule = module;
      newModule.eliminated = undefined;
    });
  }

  applyOptimalElimination() {
    const optimalElimination = this.optimalElimination();

    // Copy results
    for (let i = 0; i < this.gradedModules.length; i += 1) {
      this.gradedModules[i].eliminated = optimalElimination.gradedModules[i].eliminated;
    }
  }

  optimalElimination() {
    const clone = this.clone();
    clone.resetElimination();

    return clone.optimalEliminationRec(0);
  }

  optimalEliminationRec(index) {
    if (index >= this.gradedModules.length) {
      // All modules have been tested
      return this;
    }

    // Test with the next module not eliminated
    const noCurriculum = this.clone();
    noCurriculum.gradedModules[index].eliminated = true;
    const noResult = noCurriculum.optimalEliminationRec(index + 1);

    // Test with the next module eliminated
    const yesCurriculum = this.clone();
    yesCurriculum.gradedModules[index].eliminated = true;

    // Only consider this option if the eliminated credits are still valid and there are still graded modules
    if (
      yesCurriculum.eliminatedCredits > yesCurriculum.eliminationLimit ||
      !yesCurriculum.eliminationIsGraded
    ) {
      return noResult;
    }

    const yesResult = yesCurriculum.optimalEliminationRec(index + 1);

    // Select the better option
    if (noResult.eliminationGrade >= yesResult.eliminationGrade) {
      return noResult;
    }

    return yesResult;
  }

  addModuleArea(moduleArea) {
    this.moduleAreas.push(moduleArea);
  }

  bestCase() {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.bestCase()),
    );
  }

  worstCase() {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.worstCase()),
    );
  }

  clone() {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.clone()),
      this.eliminationLimit,
    );
  }
}
