import { MAX_GRADE, MIN_GRADE, truncateGrade } from '../grade.ts';
import type { CurriculumDefinition, ModuleDefinition } from '../curricula/definition.ts';
import type { ModuleObject } from '../model/module.svelte.ts';
import type { ChosenModule, ModuleResult, StudyObject } from '../study.ts';
import type { Notenspiegel, NotenspiegelEntry } from './parse.ts';

/** Converts a Notenspiegel of a specific course of study and examination regulations. */
export interface ProgramImporter {
  /** The built-in curriculum of the course of study, e.g. "Computer Science B.Sc. (PO 2018)". */
  curriculum: CurriculumDefinition;
  matches(notenspiegel: Notenspiegel): boolean;
  /**
   * Collects the results of the Notenspiegel for the curriculum.
   * @param notenspiegel The parsed Notenspiegel.
   * @param use Marks an entry as assigned, so it isn't reported as unassigned.
   */
  toStudy(notenspiegel: Notenspiegel, use: (entry: NotenspiegelEntry) => void): StudyObject;
}

/** Annotations of an exam whose grade was eliminated ("Note gestrichen"). */
const ELIMINATED_ANNOTATIONS = new Set(['G', 'GA', 'GL']);

/** Normalizes a name for comparisons, ignoring case and whitespace. */
export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** All entries of the tree, depth first. */
export function allEntries(entry: NotenspiegelEntry): NotenspiegelEntry[] {
  return [entry, ...entry.children.flatMap(allEntries)];
}

/** Finds the first area or module with one of the given names. */
export function findEntry(root: NotenspiegelEntry, names: string[]): NotenspiegelEntry | undefined {
  const normalized = names.map(normalizeName);
  return allEntries(root).find(
    (entry) => !entry.isExam && normalized.includes(normalizeName(entry.name)),
  );
}

/** Whether the entry is a module, i.e. it contains exams or nothing at all. */
export function isModule(entry: NotenspiegelEntry): boolean {
  return !entry.isExam && entry.children.every((child) => child.isExam);
}

/** The modules contained in the entry, in order. */
export function modulesOf(entry: NotenspiegelEntry): NotenspiegelEntry[] {
  return allEntries(entry).filter(isModule);
}

/** Whether the grade is a passing grade. */
export function isPassingGrade(grade: NotenspiegelEntry['grade']): grade is number {
  return typeof grade === 'number' && grade >= MIN_GRADE && grade <= MAX_GRADE;
}

/**
 * Applies the result of a module of the Notenspiegel to a module of the curriculum.
 * Eliminated modules only show "B" in the Notenspiegel, so their grade is unknown.
 */
export function applyEntry(module: ModuleObject, entry: NotenspiegelEntry): ModuleObject {
  const eliminated = allEntries(entry).some(
    (child) => child.isExam && ELIMINATED_ANNOTATIONS.has(child.annotation ?? ''),
  );
  const passed = isPassingGrade(entry.grade) || entry.grade === 'B';

  if (module.notGraded) {
    return { ...module, passed: passed || undefined };
  }

  return {
    ...module,
    grade: isPassingGrade(entry.grade) ? entry.grade : undefined,
    passed: (passed && eliminated) || undefined,
    eliminated: (passed && eliminated) || undefined,
  };
}

/**
 * The grade of the thesis module: the credit-weighted average of the thesis and the colloquium,
 * truncated to one decimal place. Only known once both are passed.
 * Without a separate colloquium, it's the grade of the thesis.
 */
export function thesisGrade(thesis: NotenspiegelEntry | undefined): number | undefined {
  if (thesis?.children.length === 0) {
    return isPassingGrade(thesis.grade) ? thesis.grade : undefined;
  }
  const parts = thesis ? [thesis, ...thesis.children] : [];
  if (parts.length < 2 || !parts.every((part) => isPassingGrade(part.grade))) {
    return undefined;
  }
  const credits = parts.reduce((total, part) => total + part.credits, 0);
  const weighted = parts.reduce((total, part) => total + (part.grade as number) * part.credits, 0);
  return truncateGrade(weighted / credits);
}

/**
 * Stores the result of a module of the Notenspiegel for a module given by the curriculum.
 * @param study The study to add the result to.
 * @param module The module of the curriculum.
 * @param entry The module of the Notenspiegel.
 * @param use Marks an entry as assigned.
 */
export function addResult(
  study: StudyObject,
  module: ModuleDefinition,
  entry: NotenspiegelEntry,
  use: (entry: NotenspiegelEntry) => void,
): void {
  use(entry);
  const { grade, passed, eliminated } = applyEntry({ notGraded: module.notGraded }, entry);
  const result: ModuleResult = {};
  if (grade !== undefined) result.grade = grade;
  if (passed) result.passed = passed;
  if (eliminated) result.eliminated = eliminated;
  study.results[module.id] = result;
}

/**
 * Adds modules of the Notenspiegel to an area whose modules are chosen freely, e.g. electives.
 * @param study The study to add the modules to.
 * @param areaId The id of the area in the curriculum.
 * @param entries The modules of the Notenspiegel.
 * @param use Marks an entry as assigned.
 */
export function addModules(
  study: StudyObject,
  areaId: string,
  entries: NotenspiegelEntry[],
  use: (entry: NotenspiegelEntry) => void,
): void {
  const chosen: ChosenModule[] = (study.chosenModules[areaId] ??= []);
  for (const entry of entries) {
    use(entry);
    chosen.push(applyEntry({ name: entry.name, credits: entry.credits }, entry));
  }
}
