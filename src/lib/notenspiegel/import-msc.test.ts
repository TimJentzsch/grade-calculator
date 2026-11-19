import { describe, expect, test } from 'vitest';
import { getBestEliminationIndicesDp } from '../elimination-dp';
import { applyElimination, toEliminationCurriculum } from '../elimination';
import { truncateGrade } from '../grade';
import Curriculum from '../model/curriculum.svelte';
import { importNotenspiegel } from './import';
import { parseNotenspiegel } from './parse';
import { type FixtureRow, notenspiegelItems } from './test-fixtures';

/** A module with one exam: name, grade ("B" for passed), annotation of the exam, credits. */
type ModuleSpec = [name: string, grade: string, annotation: string, credits: number];

const cp = (credits: number) => `${credits},00`;
const sum = (modules: ModuleSpec[]) => modules.reduce((total, module) => total + module[3], 0);

function moduleRows([name, grade, annotation, credits]: ModuleSpec): FixtureRow[] {
  return [
    { name, grade, credits: cp(credits), bold: true },
    { name, grade, annotation, credits: cp(credits), semester: '25W' },
  ];
}

function areaRows(name: string, modules: ModuleSpec[]): FixtureRow[] {
  return [
    { name, grade: '2,0', credits: cp(sum(modules)), bold: true },
    ...modules.flatMap(moduleRows),
  ];
}

interface Options {
  /** Eliminated modules of the theory area, shown with "B" and "G". */
  eliminated?: string[];
  /** Further modules of the application area. */
  application?: ModuleSpec[];
  colloquium?: boolean;
}

/** A made-up Notenspiegel of the M.Sc. PO 2023, shaped like a real one of a current student. */
function mscRows({
  eliminated = [],
  application = [],
  colloquium = false,
}: Options = {}): FixtureRow[] {
  const theory: ModuleSpec[] = [
    ['Effiziente Algorithmen', '2,0', 'BE', 6],
    ['Komplexitätstheorie', '2,7', 'BE', 6],
  ].map(([name, grade, annotation, credits]) =>
    eliminated.includes(name as string)
      ? ([name, 'B', 'G', credits] as ModuleSpec)
      : ([name, grade, annotation, credits] as ModuleSpec),
  );
  const areas: [string, ModuleSpec[]][] = [
    ['Theoretische Informatik', theory],
    ['Grafik und Interaktion', [['Computer Vision', '1,3', 'BE', 6]]],
    [
      'Hardware/Software-Systeme',
      [
        ['Embedded Systems', '1,7', 'BE', 6],
        ['Verteilte Systeme', '2,3', 'BE', 8],
      ],
    ],
    [
      'KI & Daten',
      [
        ['Machine Learning', '1,0', 'BE', 6],
        ['Data Mining', '1,7', 'BE', 6],
      ],
    ],
    [
      'Software-Entwicklungsmethoden und -werkzeuge',
      [
        ['Software-Architektur', '2,0', 'BE', 6],
        ['Software-Qualitätssicherung', '1,3', 'BE', 8],
      ],
    ],
  ];
  const applicationModules: ModuleSpec[] = [['Mikroökonomie', '2,7', 'BE', 6], ...application];
  const others: ModuleSpec[] = [
    ['Seminar Informatik', '1,7', 'BE', 4],
    ['Praktikum', '1,3', 'BE', 7],
    ...(colloquium ? [['Schwerpunkt-Kolloquium', '1,0', 'BE', 3] as ModuleSpec] : []),
  ];

  const electives = areas.reduce((total, [, modules]) => total + sum(modules), 0);
  const total = electives + sum(applicationModules) + sum(others);

  return [
    { name: 'Informatik', grade: '1,8', credits: cp(total), bold: true },
    { name: 'Wahlpflichtbereiche', grade: '1,8', credits: cp(electives), bold: true },
    ...areas.flatMap(([name, modules]) => areaRows(name, modules)),
    { name: 'Anwendungsbereich', grade: '2,7', credits: cp(sum(applicationModules)), bold: true },
    ...areaRows('Volkswirtschaftslehre', applicationModules),
    ...areaRows('Praktikum, Seminare, Schwerpunkt-Kolloquium', others),
    { name: 'Modulbaustein Wissenschaftliche Integrität', grade: 'B', credits: cp(0), bold: true },
    ...moduleRows(['Modulbaustein Wissenschaftliche Integrität', 'B', 'BE', 0]),
  ];
}

function load(rows: FixtureRow[], options: { totalGrade?: string; thesis?: FixtureRow[] } = {}) {
  const notenspiegel = parseNotenspiegel(
    notenspiegelItems({
      studyId: '1234 56 789 (2023)',
      degree: 'Master of Science RWTH Aachen University',
      rows,
      thesisRows: options.thesis,
      totalGrade: options.totalGrade,
    }),
  );
  const result = importNotenspiegel(notenspiegel);
  const curriculum = Curriculum.fromObject(result.curriculum);
  const area = (name: string) => curriculum.moduleAreas.find((a) => a.name === name);
  const modules = (name: string) =>
    area(name)?.modules.map((module) => [module.name, module.gradeText, module.credits]);
  return { ...result, curriculum, area, modules };
}

describe('importNotenspiegel for the M.Sc. PO 2023', () => {
  describe('a current student', () => {
    // (2.0·6 + 2.7·6 + 1.3·6 + 1.7·6 + 2.3·8 + 1.0·6 + 1.7·6 + 2.0·6 + 1.3·8 + 2.7·6 + 1.7·4
    //   + 1.3·7) / 75 = 135.3 / 75 = 1.804
    const { curriculum, modules, warnings } = load(mscRows(), { totalGrade: '1,8' });

    test('assigns the modules to their areas', () => {
      expect(curriculum.name).toBe('RWTH Computer Science M.Sc. (PO 2023)');
      expect(modules('Theoretical Computer Science')).toEqual([
        ['Effiziente Algorithmen', '2.0', 6],
        ['Komplexitätstheorie', '2.7', 6],
      ]);
      expect(modules('Hardware/Software Systems')).toEqual([
        ['Embedded Systems', '1.7', 6],
        ['Verteilte Systeme', '2.3', 8],
      ]);
      expect(modules('Seminar and Lab')).toEqual([
        ['Seminar Computer Science', '1.7', 4],
        ['Lab Computer Science', '1.3', 7],
      ]);
    });

    test('drops the elective placeholders once 58 CP are reached', () => {
      expect(modules('Graphics and Interaction')).toEqual([['Computer Vision', '1.3', 6]]);
    });

    test('keeps application placeholders up to the planned 16 CP', () => {
      expect(modules('Application Area')).toEqual([
        ['Mikroökonomie', '2.7', 6],
        ['Application Module', 'TBD', 8],
      ]);
    });

    test('leaves the colloquium and thesis open', () => {
      expect(modules('Focus Colloquium')).toEqual([
        ['Focus Colloquium (Schwerpunktkolloquium)', 'TBD', 3],
      ]);
      expect(modules('Master Thesis')).toEqual([['Master Thesis (MT)', 'TBD', 30]]);
    });

    test('calculates the grade of the Notenspiegel', () => {
      expect(warnings).toEqual([]);
      expect(truncateGrade(curriculum.eliminationGrade as number)).toBe(1.8);
    });

    test('eliminates at most one module', () => {
      const best = curriculum.clone();
      applyElimination(best, getBestEliminationIndicesDp(toEliminationCurriculum(best)));
      // One of the two 2.7 modules (6 CP): 119.1 / 69 = 1.726
      expect(best.eliminatedModuleCount).toBe(1);
      expect(truncateGrade(best.eliminationGrade as number)).toBe(1.7);
    });
  });

  describe('a finished student', () => {
    const rows = mscRows({
      eliminated: ['Komplexitätstheorie'],
      application: [['Makroökonomie', '1,7', 'BE', 6]],
      colloquium: true,
    });
    const thesis: FixtureRow[] = [
      { name: 'Masterarbeit', grade: '1,3', credits: cp(30), semester: '27S', bold: true },
    ];
    // Without Komplexitätstheorie, with Makroökonomie 1.7·6, the colloquium 1.0·3·4 and the
    // thesis 1.3·30: 180.3 / 117 = 1.541
    const { curriculum, modules, warnings } = load(rows, { totalGrade: '1,5', thesis });

    test('counts the colloquium four times', () => {
      const colloquium = curriculum.moduleAreas.find((a) => a.name === 'Focus Colloquium')
        ?.modules[0];
      expect(colloquium).toMatchObject({ grade: 1.0, weight: 4, credits: 3 });
    });

    test('reads the thesis', () => {
      expect(modules('Master Thesis')).toEqual([['Master Thesis (MT)', '1.3', 30]]);
    });

    test('keeps the eliminated module', () => {
      const eliminated = curriculum.modules.filter((module) => module.eliminated);
      expect(eliminated.map((module) => [module.name, module.gradeUnknown])).toEqual([
        ['Komplexitätstheorie', true],
      ]);
      expect(curriculum.isValidElimination).toBe(true);
    });

    test('drops the application placeholders once 10 CP are reached', () => {
      expect(modules('Application Area')).toEqual([
        ['Mikroökonomie', '2.7', 6],
        ['Makroökonomie', '1.7', 6],
      ]);
    });

    test('calculates the grade of the Notenspiegel', () => {
      expect(warnings).toEqual([]);
      expect(truncateGrade(curriculum.eliminationGrade as number)).toBe(1.5);
    });
  });

  test('warns if more than one module is eliminated', () => {
    const { warnings } = load(
      mscRows({ eliminated: ['Effiziente Algorithmen', 'Komplexitätstheorie'] }),
    );
    expect(warnings).toContain(
      'The eliminated modules exceed the elimination limits of this curriculum.',
    );
  });
});
