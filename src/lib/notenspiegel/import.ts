import { formatGrade, truncateGrade } from '../grade.ts';
import Curriculum, { type CurriculumObject } from '../model/curriculum.svelte.ts';
import { allEntries, modulesOf, type ProgramImporter } from './entries.ts';
import type { Notenspiegel, NotenspiegelEntry } from './parse.ts';
import computerScienceBsc2018 from './programs/computer-science-bsc-2018.ts';

/** The curriculum filled with the grades of a Notenspiegel. */
export interface ImportResult {
  curriculum: CurriculumObject;
  /** Problems the user should check, e.g. modules that could not be assigned. */
  warnings: string[];
}

const importers: ProgramImporter[] = [computerScienceBsc2018];

/** Thrown if there is no importer for the course of study of the Notenspiegel. */
export class UnsupportedProgramError extends Error {
  constructor(notenspiegel: Notenspiegel) {
    const po = notenspiegel.poYear ? ` (PO ${notenspiegel.poYear})` : '';
    super(
      `${notenspiegel.program || 'This course of study'}${po} is not supported yet. ` +
        `Supported: ${importers.map((importer) => importer.name).join(', ')}.`,
    );
    this.name = 'UnsupportedProgramError';
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

  const warnings: string[] = [];

  const unassigned = modulesOf(notenspiegel.root).filter(
    (entry) => entry !== notenspiegel.root && !used.has(entry) && entry.credits > 0,
  );
  for (const entry of unassigned) {
    warnings.push(`"${entry.name}" (${entry.credits} CP) could not be assigned to a module.`);
  }

  const curriculum = Curriculum.fromObject(curriculumObject);
  if (!curriculum.isValidElimination) {
    warnings.push('The eliminated modules exceed the elimination limits of this curriculum.');
  }

  const grade = curriculum.eliminationGrade;
  if (
    grade !== undefined &&
    notenspiegel.totalGrade !== undefined &&
    truncateGrade(grade) !== notenspiegel.totalGrade
  ) {
    warnings.push(
      `The calculated grade ${formatGrade(grade)} differs from the grade ` +
        `${formatGrade(notenspiegel.totalGrade)} in the Notenspiegel.`,
    );
  }

  return { curriculum: curriculumObject, warnings };
}
