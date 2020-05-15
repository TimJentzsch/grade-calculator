export default class Module {
  constructor(name, credits, grade, weight, notGraded, passed) {
    this.name = name;
    this.credits = credits === undefined ? 0 : credits;
    if (!notGraded) {
      this.grade = grade;
    }
    this.weight = weight === undefined ? 1 : weight;
    this.isGraded = !notGraded;
    this.passed = passed;
  }

  get hasGrade() {
    return this.credits && this.isGraded && this.grade;
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

  get isEmpty() {
    return !this.name;
  }

  bestCase() {
    const clone = this.clone();
    if (this.credits && this.isGraded && !this.grade) {
      clone.grade = 1.0;
    }
    return clone;
  }

  worstCase() {
    const clone = this.clone();
    if (this.credits && this.isGraded && !this.grade) {
      clone.grade = 4.0;
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
    );
  }

  toObject() {
    return {
      name: this.name,
      credits: this.credits,
      grade: this.grade,
      weight: this.weight === 1 ? undefined : this.weight,
      notGraded: !this.isGraded ? true : undefined,
      passed: this.passed,
    };
  }

  static fromObject(obj) {
    return new Module(obj.name, obj.credits, obj.grade, obj.weight, obj.notGraded, obj.passed);
  }
}
