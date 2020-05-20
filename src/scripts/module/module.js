export default class Module {
  /**
   * Creates a new module.
   * @param {string} name - The name of the module.
   * @param {number} credits - The number of credit points of this module.
   * @param {number} grade - The grade of this module.
   * @param {number} weight - The weighting of this module.
   * @param {boolean} notGraded - The indicator if this module is not graded.
   * @param {boolean} passed - The indicator if this module has been passed.
   * @param {boolean} eliminated - The indicator if this module's grade has been eliminated.
   */
  constructor(name, credits, grade, weight, notGraded, passed, canNotBeEliminated, eliminated) {
    this.name = name;
    this.credits = credits === undefined ? 0 : credits;
    if (!notGraded) {
      this.grade = grade;
    }
    this.weight = weight === undefined ? 1 : weight;
    this.isGraded = !notGraded;
    this.passed = passed;
    this.eliminated = eliminated;
  }

  get hasGrade() {
    return this.credits && this.isGraded && this.grade && !this.eliminated;
  }

  get completed() {
    return this.credits && ((!this.isGraded && this.passed) || this.grade);
  }

  get weightedCredits() {
    return this.credits * this.weight;
  }

  get weightedGrade() {
    return this.grade * this.weightedCredits;
  }

  get gradeText() {
    if (!this.completed) {
      return 'TBD';
    }

    if (!this.isGraded) {
      return 'B';
    }

    return this.grade.toFixed(1);
  }

  get eliminationGradeText() {
    if (!this.completed) {
      return 'TBD';
    }

    if (!this.isGraded || this.eliminated) {
      return 'B';
    }

    return this.grade.toFixed(1);
  }

  get isEmpty() {
    return !this.name;
  }

  bestCase() {
    const clone = this.clone();
    if (!clone.completed) {
      if (clone.isGraded) {
        clone.grade = 1.0;
      } else {
        clone.passed = true;
      }
    }
    return clone;
  }

  worstCase() {
    const clone = this.clone();
    if (!clone.completed) {
      if (clone.isGraded) {
        clone.grade = 4.0;
      } else {
        clone.passed = true;
      }
    }
    return clone;
  }

  clone() {
    return new Module(
      this.name,
      this.credits,
      this.grade,
      this.weight,
      !this.isGraded,
      this.passed,
      !this.canBeEliminated,
      this.eliminated,
    );
  }

  toObject() {
    return {
      name: this.name || undefined,
      credits: this.credits || undefined,
      grade: this.grade || undefined,
      weight: this.weight === 1 ? undefined : this.weight,
      notGraded: !this.isGraded || undefined,
      passed: this.passed || undefined,
      canNotBeEliminated: !this.canBeEliminated || undefined,
      eliminated: this.eliminated || undefined,
    };
  }

  static fromObject(obj) {
    return new Module(obj.name, obj.credits, obj.grade, obj.weight, obj.notGraded, obj.passed);
  }
}
