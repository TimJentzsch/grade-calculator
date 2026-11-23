import { formatGrade, truncateGrade } from '../grade';

/** The serialized form of a module, as used in templates and saved files. */
export interface ModuleObject {
  name?: string;
  credits?: number;
  grade?: number;
  weight?: number;
  notGraded?: boolean;
  passed?: boolean;
  eliminated?: boolean;
  additional?: boolean;
}

export default class Module {
  name: string | undefined = $state();
  credits: number = $state(0);
  grade: number | undefined = $state();
  weight: number = $state(1);
  isGraded: boolean = $state(true);
  passed: boolean | undefined = $state();
  eliminated: boolean | undefined = $state();
  additional: boolean | undefined = $state();
  /**
   * The id of the module in the curriculum definition, if the curriculum gives this module.
   * Such modules can't be changed by the user, only their results.
   */
  definitionId: string | undefined;

  /**
   * Creates a new module.
   * @param name - The name of the module.
   * @param credits - The number of credit points of this module.
   * @param grade - The grade of this module.
   * @param weight - The weighting of this module.
   * @param notGraded - The indicator if this module is not graded.
   * @param passed - The indicator if this module has been passed.
   * @param eliminated - The indicator if this module's grade has been eliminated.
   * @param additional - The indicator if this module is an additional module (Zusatzleistung),
   * which counts towards neither the credits nor the grade (RWTH ÜPO § 8 Abs. 3).
   */
  constructor(
    name?: string,
    credits?: number,
    grade?: number,
    weight?: number,
    notGraded?: boolean,
    passed?: boolean,
    eliminated?: boolean,
    additional?: boolean,
  ) {
    this.name = name;
    this.credits = credits === undefined ? 0 : credits;
    if (!notGraded) {
      this.grade = grade === undefined ? undefined : truncateGrade(grade);
    }
    this.weight = weight === undefined ? 1 : weight;
    this.isGraded = !notGraded;
    this.passed = passed;
    this.eliminated = eliminated;
    this.additional = additional;
  }

  get hasGrade(): boolean {
    return Boolean(this.credits && this.isGraded && this.grade && !this.eliminated);
  }

  get completed(): boolean {
    return Boolean(
      this.credits && ((!this.isGraded && this.passed) || this.grade || this.gradeUnknown),
    );
  }

  /**
   * Whether the module was passed and eliminated, but its grade is unknown.
   * The Notenspiegel only shows "B" for eliminated modules, so their grade is lost on import.
   * Such modules always stay eliminated.
   */
  get gradeUnknown(): boolean {
    return Boolean(this.isGraded && this.eliminated && this.passed && this.grade === undefined);
  }

  get weightedCredits(): number {
    return this.credits * this.weight;
  }

  get weightedGrade(): number {
    return (this.grade as number) * this.weightedCredits;
  }

  get gradeText(): string {
    if (!this.completed) {
      return 'TBD';
    }

    if (!this.isGraded || this.gradeUnknown) {
      return 'B';
    }

    return formatGrade(this.grade as number);
  }

  get eliminationGradeText(): string {
    if (!this.completed) {
      return 'TBD';
    }

    if (!this.isGraded || this.eliminated) {
      return 'B';
    }

    return formatGrade(this.grade as number);
  }

  /**
   * Switches between a graded and an ungraded module.
   * An entered grade counts as passed, a passed module starts with an open grade (TBD).
   */
  setGraded(isGraded: boolean) {
    if (isGraded === this.isGraded) {
      return;
    }
    if (isGraded) {
      this.passed = undefined;
    } else {
      this.passed = this.grade !== undefined || this.passed;
      this.grade = undefined;
      this.eliminated = undefined;
    }
    this.isGraded = isGraded;
  }

  /**
   * Switches between an additional module and one that counts towards the curriculum.
   * Additional modules don't count towards the grade, so they can't be eliminated.
   */
  setAdditional(additional: boolean) {
    if (additional) {
      this.eliminated = undefined;
    }
    this.additional = additional || undefined;
  }

  get isEmpty(): boolean {
    return !this.name;
  }

  bestCase(): Module {
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

  worstCase(): Module {
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

  clone(): Module {
    const clone = new Module(
      this.name,
      this.credits,
      this.grade,
      this.weight,
      !this.isGraded,
      this.passed,
      this.eliminated,
      this.additional,
    );
    clone.definitionId = this.definitionId;
    return clone;
  }

  toObject(): ModuleObject {
    return {
      name: this.name || undefined,
      credits: this.credits || undefined,
      grade: this.grade || undefined,
      weight: this.weight === 1 ? undefined : this.weight,
      notGraded: !this.isGraded || undefined,
      passed: this.passed || undefined,
      eliminated: this.eliminated || undefined,
      additional: this.additional || undefined,
    };
  }

  static fromObject(obj: ModuleObject): Module {
    return new Module(
      obj.name,
      obj.credits,
      obj.grade,
      obj.weight,
      obj.notGraded,
      obj.passed,
      obj.eliminated,
      obj.additional,
    );
  }
}
