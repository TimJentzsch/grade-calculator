import ModuleArea from '../module_area/module_area.js';

export default class Curriculum {
  constructor(name, moduleAreas) {
    this.name = name;
    this.moduleAreas = moduleAreas;
  }

  get credits() {
    let credits = 0;
    for (const moduleArea of this.moduleAreas) {
      credits += moduleArea.credits;
    }
    return credits;
  }

  get partiallyCompletedModuleAreas() {
    return this.moduleAreas.filter(
      (moduleArea) => moduleArea.gradePartiallyCompleted
    );
  }

  get completedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => moduleArea.gradeCompleted);
  }

  get gradedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => moduleArea.isGraded);
  }

  get partiallyCompletedGradedModuleAreas() {
    return this.partiallyCompletedModuleAreas.filter(
      (moduleArea) => moduleArea.isGraded
    );
  }

  get completedGradedModuleAreas() {
    return this.completedModuleAreas.filter(
      (moduleArea) => moduleArea.isGraded
    );
  }

  get ungradedModuleAreas() {
    return this.moduleAreas.filter((moduleArea) => !moduleArea.isGraded);
  }

  get partiallyCompletetUngradedModuleAreas() {
    return this.partiallyCompletedModuleAreas.filter(
      (moduleArea) => !moduleArea.isGraded
    );
  }

  get completedUngradedModuleAreas() {
    return this.completedModuleAreas.filter(
      (moduleArea) => !moduleArea.isGraded
    );
  }

  get weightedCredits() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }

    let weightedCredits = 0;
    for (const moduleArea of this.partiallyCompletedGradedModuleAreas) {
      weightedCredits += moduleArea.weightedCredits;
    }
    return weightedCredits;
  }

  get isGraded() {
    return this.gradedModuleAreas.length > 0;
  }

  get gradeCompleted() {
    return (
      this.completedGradedModuleAreas.length === this.gradedModuleAreas.length
    );
  }

  get gradePartiallyCompleted() {
    return (
      this.gradeCompleted || this.partiallyCompletedGradedModuleAreas.length > 0
    );
  }

  get grade() {
    if (!this.isGraded || !this.gradePartiallyCompleted) {
      return undefined;
    }
    let weightedGrade = 0;
    for (const moduleArea of this.partiallyCompletedGradedModuleAreas) {
      weightedGrade += moduleArea.weightedGrade;
    }
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

  toObject() {
    return {
      name: this.name,
      moduleAreas: this.moduleAreas.map((moduleArea) => moduleArea.toObject()),
    };
  }

  static fromObject(obj) {
    const curriculum = new Curriculum(
      obj.name,
      obj.moduleAreas.map((moduleAreaObj) =>
        ModuleArea.fromObject(moduleAreaObj)
      )
    );

    return curriculum;
  }

  addModuleArea(moduleArea) {
    this.moduleAreas.push(moduleArea);
  }

  bestCase() {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.bestCase())
    );
  }

  worstCase() {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.worstCase())
    );
  }

  clone() {
    return new Curriculum(
      this.name,
      this.moduleAreas.map((moduleArea) => moduleArea.clone())
    );
  }
}
