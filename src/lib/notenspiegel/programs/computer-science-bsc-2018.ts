import type { CurriculumObject } from '../../model/curriculum.svelte.ts';
import computerScienceBsc from '../../templates/computer-science-bsc.ts';
import { applyEntry, findEntry, type ProgramImporter, modulesOf, thesisGrade } from '../entries.ts';

/** The German and English names of the modules in the Notenspiegel, by template module name. */
const MODULE_NAMES: Record<string, string[]> = {
  'Programming (Progra)': ['Programmierung', 'Programming Concepts'],
  'Data Structures and Algorithms (DsAl)': [
    'Datenstrukturen und Algorithmen',
    'Data Structures and Algorithms',
  ],
  'Databases and Information Systems (DbIs)': [
    'Datenbanken und Informationssysteme',
    'Databases and Information Systems',
  ],
  'Software Engineering (SWT)': ['Softwaretechnik', 'Software Engineering'],
  'System Programming (PSP)': ['Systemprogrammierung', 'System Programming'],
  'Introduction to Computer Engineering (TI)': [
    'Einführung in die Technische Informatik',
    'Introduction to Computer Engineering',
  ],
  'Operating Systems and System Software (BuS)': [
    'Betriebssysteme und Systemsoftware',
    'Operating Systems and System Software',
  ],
  'Data Communication and Security (DatKom)': [
    'Datenkommunikation und Sicherheit',
    'Data Communication and Security',
  ],
  'Formal Systems, Automata, Processes (FoSAP)': [
    'Formale Systeme, Automaten, Prozesse',
    'Formal Systems, Automata, Processes',
  ],
  'Computability and Complexity (BuK)': [
    'Berechenbarkeit und Komplexität',
    'Computability and Complexity',
  ],
  'Mathematical Logic I (MaLo)': ['Mathematische Logik I', 'Mathematical Logic I'],
  'Discrete Structures (DS)': ['Diskrete Strukturen', 'Discrete Structures'],
  'Calculus for Computer Science (AfI)': [
    'Analysis für Informatik',
    'Calculus for Computer Science',
  ],
  'Linear Algebra (LA)': ['Lineare Algebra', 'Linear Algebra'],
  'Introduction to Applied Stochastics (Stocha)': [
    'Einführung in die angewandte Stochastik',
    'Introduction to Applied Stochastics',
  ],
  'Mentoring in Informatics': ['Mentoring Informatik', 'Mentoring in Informatics'],
  'Non-Technical Elective Module (NTW)': [
    'Nicht-technisches Wahlfach',
    'Non-Technical Elective Module',
  ],
  'Software Project Lab (SPP)': ['Software-Projektpraktikum', 'Software Project Lab'],
  'Proseminar Computer Science': [
    'Einführung in das wissenschaftliche Arbeiten (Proseminar Informatik)',
    'Introduction to Scientific Working (Proseminar Computer Science)',
  ],
  'Seminar Computer Science': ['Seminar Informatik', 'Seminar Computer Science'],
};

const ELECTIVES_AREA = 'Elective Modules';
const ELECTIVES_NAMES = ['Module im Wahlpflichtbereich', 'Elective Modules'];
const APPLICATION_AREA = 'Application Subject';
const APPLICATION_NAMES = ['Anwendungsfach', 'Application Subject'];
const THESIS_AREA = 'Bachelor Thesis';

/** Informatik / Computer Science B.Sc. at RWTH Aachen, PO 2018. */
const computerScienceBsc2018: ProgramImporter = {
  name: 'Computer Science B.Sc. (PO 2018)',

  matches(notenspiegel) {
    return (
      ['informatik', 'computer science'].includes(notenspiegel.program.toLowerCase()) &&
      notenspiegel.degree.startsWith('Bachelor') &&
      notenspiegel.poYear === 2018
    );
  },

  toCurriculum(notenspiegel, use) {
    const curriculum: CurriculumObject = structuredClone(computerScienceBsc);

    for (const area of curriculum.moduleAreas) {
      if (area.name === ELECTIVES_AREA) {
        const electivesArea = findEntry(notenspiegel.root, ELECTIVES_NAMES);
        const electives = electivesArea ? modulesOf(electivesArea) : [];
        // Fill the open slots of the template, and add modules if there are more
        electives.forEach((entry, index) => {
          use(entry);
          area.modules[index] = applyEntry(
            { ...area.modules[index], name: entry.name, credits: entry.credits },
            entry,
          );
        });
      } else if (area.name === APPLICATION_AREA) {
        // The application subject is one module of the template, e.g. "Anwendungsfach Biologie"
        const entry = findEntry(notenspiegel.root, APPLICATION_NAMES);
        if (entry) {
          use(entry);
          const subject = entry.children.length === 1 ? entry.children[0] : entry;
          area.modules[0] = applyEntry({ ...area.modules[0], name: subject.name }, entry);
        }
      } else if (area.name === THESIS_AREA) {
        if (notenspiegel.thesis) {
          use(notenspiegel.thesis);
          area.modules[0] = { ...area.modules[0], grade: thesisGrade(notenspiegel.thesis) };
        }
      } else {
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
    }

    return curriculum;
  },
};

export default computerScienceBsc2018;
