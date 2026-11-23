import { truncateGrade } from '../grade.ts';
import Curriculum, { type CurriculumObject } from '../model/curriculum.svelte.ts';
import { allEntries, modulesOf, type ProgramImporter } from './entries.ts';
import type { Notenspiegel, NotenspiegelEntry } from './parse.ts';
import computerScienceBsc2018 from './programs/computer-science-bsc-2018.ts';
import computerScienceMsc2023 from './programs/computer-science-msc-2023.ts';

/** The curriculum filled with the grades of a Notenspiegel. */
export interface ImportResult {
  curriculum: CurriculumObject;
  /** Problems the user should check, e.g. modules that could not be assigned. */
  warnings: ImportWarning[];
}

/** A problem with an import, translated when it is shown. */
export type ImportWarning =
  /** A module of the Notenspiegel that has no place in the curriculum. */
  | { kind: 'unassigned'; name: string; credits: number }
  /** The modules eliminated in the Notenspiegel exceed the limits of the curriculum. */
  | { kind: 'elimination-limits' }
  /** The calculated grade differs from the one in the Notenspiegel. */
  | { kind: 'grade-mismatch'; calculated: number; official: number };

const importers: ProgramImporter[] = [computerScienceBsc2018, computerScienceMsc2023];

/** Thrown if there is no importer for the course of study of the Notenspiegel. */
export class UnsupportedProgramError extends Error {
  /** The course of study with its examination regulations, e.g. `Mathematik (PO 2018)`. */
  readonly program: string | undefined;
  /** The supported courses of study, e.g. `Computer Science B.Sc. (PO 2018)`. */
  readonly supported: string[];

  constructor(notenspiegel: Notenspiegel) {
    const po = notenspiegel.poYear ? ` (PO ${notenspiegel.poYear})` : '';
    const program = notenspiegel.program ? `${notenspiegel.program}${po}` : undefined;
    const supported = importers.map((importer) => importer.name);
    super(
      `${program ?? `This course of study${po}`} is not supported yet. ` +
        `Supported: ${supported.join(', ')}.`,
    );
    this.name = 'UnsupportedProgramError';
    this.program = program;
    this.supported = supported;
  }
}

/**
 * Fills the matching curriculum template with the grades of a Notenspiegel.
 * @throws {UnsupportedProgramError} If the course of study or its version is not supported.
 */
export function importNotenspiegel(notenspiegel: Notenspiegel): ImportResult {
  const importer = importers.find((candidate) => candidate.matches(notenspiegel));
  if (!importer) {
    throw new UnsupportedProgramError(notenspiegel);
  }

  const used = new Set<NotenspiegelEntry>();
  const curriculumObject = importer.toCurriculum(notenspiegel, (entry) => {
    for (const descendant of allEntries(entry)) {
      used.add(descendant);
    }
  });

  const warnings: ImportWarning[] = [];

  const unassigned = modulesOf(notenspiegel.root).filter(
    (entry) => entry !== notenspiegel.root && !used.has(entry) && entry.credits > 0,
  );
  for (const entry of unassigned) {
    warnings.push({ kind: 'unassigned', name: entry.name, credits: entry.credits });
  }

  const curriculum = Curriculum.fromObject(curriculumObject);
  if (!curriculum.isValidElimination) {
    warnings.push({ kind: 'elimination-limits' });
  }

  const grade = curriculum.eliminationGrade;
  if (
    grade !== undefined &&
    notenspiegel.totalGrade !== undefined &&
    truncateGrade(grade) !== notenspiegel.totalGrade
  ) {
    warnings.push({
      kind: 'grade-mismatch',
      calculated: truncateGrade(grade),
      official: notenspiegel.totalGrade,
    });
  }

  return { curriculum: curriculumObject, warnings };
}
