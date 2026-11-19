import type { CurriculumObject } from '../../model/curriculum.svelte.ts';
import type { ModuleAreaObject } from '../../model/module-area.svelte.ts';
import computerScienceMsc from '../../templates/computer-science-msc.ts';
import {
  addModules,
  applyEntry,
  findEntry,
  modulesOf,
  type ProgramImporter,
  thesisGrade,
} from '../entries.ts';
import type { NotenspiegelEntry } from '../parse.ts';

/**
 * The German and English names of the elective areas in the Notenspiegel, by template area name.
 * The English names are not confirmed by an English export yet.
 */
const ELECTIVE_AREAS: Record<string, string[]> = {
  'Theoretical Computer Science': ['Theoretische Informatik', 'Theoretical Computer Science'],
  'Graphics and Interaction': ['Grafik und Interaktion', 'Graphics and Interaction'],
  'Hardware/Software Systems': ['Hardware/Software-Systeme', 'Hardware/Software Systems'],
  'AI & Data': ['KI & Daten', 'AI & Data', 'AI and Data'],
  'Software Development Methods and Tools': [
    'Software-Entwicklungsmethoden und -werkzeuge',
    'Software Development Methods and Tools',
  ],
};
const APPLICATION_AREA = 'Application Area';
const APPLICATION_NAMES = ['Anwendungsbereich', 'Application Area'];

/** The names of the single modules in the Notenspiegel, by template module name. */
const MODULE_NAMES: Record<string, string[]> = {
  'Seminar Computer Science': ['Seminar Informatik', 'Seminar Computer Science'],
  'Lab Computer Science': ['Praktikum', 'Praktikum Informatik', 'Lab', 'Practical Course'],
  'Focus Colloquium (Schwerpunktkolloquium)': [
    'Schwerpunkt-Kolloquium',
    'Schwerpunktkolloquium',
    'Focus Colloquium',
  ],
};
const THESIS_AREA = 'Master Thesis';

/** The modules with credits in an area of the Notenspiegel, without e.g. "Modulbausteine". */
function modulesWithCredits(area: NotenspiegelEntry | undefined): NotenspiegelEntry[] {
  return area ? modulesOf(area).filter((entry) => entry.credits > 0) : [];
}

/** Informatik / Computer Science M.Sc. at RWTH Aachen, PO 2023. */
const computerScienceMsc2023: ProgramImporter = {
  name: 'Computer Science M.Sc. (PO 2023)',

  matches(notenspiegel) {
    return (
      ['informatik', 'computer science'].includes(notenspiegel.program.toLowerCase()) &&
      notenspiegel.degree.startsWith('Master') &&
      notenspiegel.poYear === 2023
    );
  },

  toCurriculum(notenspiegel, use) {
    const curriculum: CurriculumObject = structuredClone(computerScienceMsc);
    const areaNamed = (name: string) =>
      curriculum.moduleAreas.find((area) => area.name === name) as ModuleAreaObject;

    for (const [name, names] of Object.entries(ELECTIVE_AREAS)) {
      addModules(areaNamed(name), modulesWithCredits(findEntry(notenspiegel.root, names)), use);
    }
    addModules(
      areaNamed(APPLICATION_AREA),
      modulesWithCredits(findEntry(notenspiegel.root, APPLICATION_NAMES)),
      use,
    );

    for (const area of curriculum.moduleAreas) {
      area.modules = area.modules.map((module) => {
        const names = module.name ? MODULE_NAMES[module.name] : undefined;
        const entry = names ? findEntry(notenspiegel.root, names) : undefined;
        if (!entry) {
          return module;
        }
        use(entry);
        return applyEntry(module, entry);
      });
    }

    if (notenspiegel.thesis) {
      use(notenspiegel.thesis);
      const thesisArea = areaNamed(THESIS_AREA);
      thesisArea.modules[0] = {
        ...thesisArea.modules[0],
        grade: thesisGrade(notenspiegel.thesis),
      };
    }

    return curriculum;
  },
};

export default computerScienceMsc2023;
