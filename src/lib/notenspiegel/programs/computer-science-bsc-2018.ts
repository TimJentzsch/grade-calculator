import computerScienceBsc2018Curriculum from '../../curricula/computer-science-bsc-2018.ts';
import { emptyStudy } from '../../study.ts';
import {
  addModules,
  addResult,
  applyEntry,
  findEntry,
  modulesOf,
  type ProgramImporter,
  thesisGrade,
} from '../entries.ts';

/** The German and English names of the modules in the Notenspiegel, by module id. */
const MODULE_NAMES: Record<string, string[]> = {
  progra: ['Programmierung', 'Programming Concepts'],
  dsal: ['Datenstrukturen und Algorithmen', 'Data Structures and Algorithms'],
  dbis: ['Datenbanken und Informationssysteme', 'Databases and Information Systems'],
  swt: ['Softwaretechnik', 'Software Engineering'],
  psp: ['Systemprogrammierung', 'System Programming'],
  ti: ['Einführung in die Technische Informatik', 'Introduction to Computer Engineering'],
  bus: ['Betriebssysteme und Systemsoftware', 'Operating Systems and System Software'],
  datkom: ['Datenkommunikation und Sicherheit', 'Data Communication and Security'],
  fosap: ['Formale Systeme, Automaten, Prozesse', 'Formal Systems, Automata, Processes'],
  buk: ['Berechenbarkeit und Komplexität', 'Computability and Complexity'],
  malo: ['Mathematische Logik I', 'Mathematical Logic I'],
  ds: ['Diskrete Strukturen', 'Discrete Structures'],
  afi: ['Analysis für Informatik', 'Calculus for Computer Science'],
  la: ['Lineare Algebra', 'Linear Algebra'],
  stocha: ['Einführung in die angewandte Stochastik', 'Introduction to Applied Stochastics'],
  mentoring: ['Mentoring Informatik', 'Mentoring in Informatics'],
  ntw: ['Nicht-technisches Wahlfach', 'Non-Technical Elective Module'],
  spp: ['Software-Projektpraktikum', 'Software Project Lab'],
  proseminar: [
    'Einführung in das wissenschaftliche Arbeiten (Proseminar Informatik)',
    'Introduction to Scientific Working (Proseminar Computer Science)',
  ],
  seminar: ['Seminar Informatik', 'Seminar Computer Science'],
};

const ELECTIVES_AREA = 'electives';
const ELECTIVES_NAMES = ['Module im Wahlpflichtbereich', 'Elective Modules'];
const APPLICATION_AREA = 'application-subject';
const APPLICATION_NAMES = ['Anwendungsfach', 'Application Subject'];
const THESIS = 'thesis';

/** Informatik / Computer Science B.Sc. at RWTH Aachen, PO 2018. */
const computerScienceBsc2018: ProgramImporter = {
  curriculum: computerScienceBsc2018Curriculum,

  matches(notenspiegel) {
    return (
      ['informatik', 'computer science'].includes(notenspiegel.program.toLowerCase()) &&
      notenspiegel.degree.startsWith('Bachelor') &&
      notenspiegel.poYear === 2018
    );
  },

  toStudy(notenspiegel, use) {
    const study = emptyStudy(this.curriculum);

    const electivesArea = findEntry(notenspiegel.root, ELECTIVES_NAMES);
    addModules(study, ELECTIVES_AREA, electivesArea ? modulesOf(electivesArea) : [], use);

    // The application subject counts as one module, e.g. "Anwendungsfach Biologie"
    const application = findEntry(notenspiegel.root, APPLICATION_NAMES);
    if (application) {
      use(application);
      const subject = application.children.length === 1 ? application.children[0] : application;
      study.chosenModules[APPLICATION_AREA] = [
        applyEntry({ name: subject.name, credits: application.credits }, application),
      ];
    }

    if (notenspiegel.thesis) {
      use(notenspiegel.thesis);
      const grade = thesisGrade(notenspiegel.thesis);
      if (grade !== undefined) {
        study.results[THESIS] = { grade };
      }
    }

    for (const area of this.curriculum.moduleAreas) {
      for (const module of area.modules) {
        const names = MODULE_NAMES[module.id] as string[] | undefined;
        const entry = names ? findEntry(notenspiegel.root, names) : undefined;
        if (entry) {
          addResult(study, module, entry, use);
        }
      }
    }

    return study;
  },
};

export default computerScienceBsc2018;
