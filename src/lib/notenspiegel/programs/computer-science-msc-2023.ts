import computerScienceMsc2023Curriculum from '../../curricula/computer-science-msc-2023.ts';
import { emptyStudy } from '../../study.ts';
import {
  addModules,
  addResult,
  findEntry,
  modulesOf,
  type ProgramImporter,
  thesisGrade,
} from '../entries.ts';
import type { NotenspiegelEntry } from '../parse.ts';

/**
 * The German and English names of the elective areas in the Notenspiegel, by area id.
 * The English names are not confirmed by an English export yet.
 */
const ELECTIVE_AREAS: Record<string, string[]> = {
  theoretical: ['Theoretische Informatik', 'Theoretical Computer Science'],
  graphics: ['Grafik und Interaktion', 'Graphics and Interaction'],
  'hardware-software': ['Hardware/Software-Systeme', 'Hardware/Software Systems'],
  'ai-data': ['KI & Daten', 'AI & Data', 'AI and Data'],
  'software-development': [
    'Software-Entwicklungsmethoden und -werkzeuge',
    'Software Development Methods and Tools',
  ],
};
const APPLICATION_AREA = 'application-area';
const APPLICATION_NAMES = ['Anwendungsbereich', 'Application Area'];

/** The names of the single modules in the Notenspiegel, by module id. */
const MODULE_NAMES: Record<string, string[]> = {
  seminar: ['Seminar Informatik', 'Seminar Computer Science'],
  lab: ['Praktikum', 'Praktikum Informatik', 'Lab', 'Practical Course'],
  'focus-colloquium': ['Schwerpunkt-Kolloquium', 'Schwerpunktkolloquium', 'Focus Colloquium'],
};
const THESIS = 'thesis';

/** The modules with credits in an area of the Notenspiegel, without e.g. "Modulbausteine". */
function modulesWithCredits(area: NotenspiegelEntry | undefined): NotenspiegelEntry[] {
  return area ? modulesOf(area).filter((entry) => entry.credits > 0) : [];
}

/** Informatik / Computer Science M.Sc. at RWTH Aachen, PO 2023. */
const computerScienceMsc2023: ProgramImporter = {
  curriculum: computerScienceMsc2023Curriculum,

  matches(notenspiegel) {
    return (
      ['informatik', 'computer science'].includes(notenspiegel.program.toLowerCase()) &&
      notenspiegel.degree.startsWith('Master') &&
      notenspiegel.poYear === 2023
    );
  },

  toStudy(notenspiegel, use) {
    const study = emptyStudy(this.curriculum);

    for (const [areaId, names] of Object.entries(ELECTIVE_AREAS)) {
      addModules(study, areaId, modulesWithCredits(findEntry(notenspiegel.root, names)), use);
    }
    addModules(
      study,
      APPLICATION_AREA,
      modulesWithCredits(findEntry(notenspiegel.root, APPLICATION_NAMES)),
      use,
    );

    for (const area of this.curriculum.moduleAreas) {
      for (const module of area.modules) {
        const names = MODULE_NAMES[module.id] as string[] | undefined;
        const entry = names ? findEntry(notenspiegel.root, names) : undefined;
        if (entry) {
          addResult(study, module, entry, use);
        }
      }
    }

    if (notenspiegel.thesis) {
      use(notenspiegel.thesis);
      const grade = thesisGrade(notenspiegel.thesis);
      if (grade !== undefined) {
        study.results[THESIS] = { grade };
      }
    }

    return study;
  },
};

export default computerScienceMsc2023;
