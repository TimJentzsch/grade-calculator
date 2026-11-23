import { describe, expect, test } from 'vitest';
import { truncateGrade } from '../grade';
import Curriculum from '../model/curriculum.svelte';
import { importNotenspiegel, UnsupportedProgramError } from './import';
import { type Notenspiegel, parseNotenspiegel } from './parse';
import { type FixtureOptions, type FixtureRow, notenspiegelItems } from './test-fixtures';

/** A module with one exam: name, grade ("B" for passed), annotation of the exam, credits. */
type ModuleSpec = [name: string, grade: string, annotation: string, credits: number];

const cp = (credits: number) => `${credits},00`;

function moduleRows([name, grade, annotation, credits]: ModuleSpec): FixtureRow[] {
  return [
    { name, grade, credits: cp(credits), bold: true },
    { name, grade, annotation, credits: cp(credits), semester: '19W' },
  ];
}

function areaRows(name: string, grade: string, modules: ModuleSpec[]): FixtureRow[] {
  const credits = modules.reduce((total, module) => total + module[3], 0);
  return [{ name, grade, credits: cp(credits), bold: true }, ...modules.flatMap(moduleRows)];
}

/** A complete Notenspiegel of the PO 2018 with made-up grades and four eliminated modules. */
function completeRows(): FixtureRow[] {
  return [
    { name: 'Informatik', grade: '2,1', credits: cp(180), bold: true },
    ...areaRows('Modulbereich Praktische Informatik', '2,0', [
      ['Programmierung', '1,7', 'BE', 8],
      ['Datenstrukturen und Algorithmen', 'B', 'G', 8],
      ['Datenbanken und Informationssysteme', '2,3', 'BE', 6],
      ['Softwaretechnik', '2,0', 'BE', 6],
    ]),
    ...areaRows('Modulbereich Technische Informatik', '2,5', [
      ['Einführung in die Technische Informatik', '2,7', 'BE', 6],
      ['Systemprogrammierung', 'B', 'BE', 8],
      ['Betriebssysteme und Systemsoftware', 'B', 'G', 6],
      ['Datenkommunikation und Sicherheit', '2,3', 'BE', 6],
    ]),
    ...areaRows('Modulbereich Theoretische Informatik', '2,3', [
      ['Formale Systeme, Automaten, Prozesse', 'B', 'G', 6],
      ['Berechenbarkeit und Komplexität', '2,0', 'BE', 7],
      ['Mathematische Logik I', '2,7', 'BE', 7],
    ]),
    ...areaRows('Modulbereich Mathematik', '3,0', [
      ['Diskrete Strukturen', '3,0', 'BE', 6],
      ['Analysis für Informatik', 'B', 'G', 8],
      ['Lineare Algebra', '2,7', 'BE', 6],
      ['Einführung in die angewandte Stochastik', '3,3', 'BE', 6],
    ]),
    { name: 'Modulbereich Sonstige Leistungen', grade: '1,5', credits: cp(19), bold: true },
    ...moduleRows(['Mentoring Informatik', 'B', 'BE', 1]),
    ...moduleRows([
      'Einführung in das wissenschaftliche Arbeiten\n(Proseminar Informatik)',
      '1,7',
      'BE',
      3,
    ]),
    ...moduleRows(['Software-Projektpraktikum', '1,3', 'BE', 6]),
    ...moduleRows(['Seminar Informatik', '1,7', 'BE', 5]),
    { name: 'Nicht-technisches Wahlfach', grade: 'B', credits: cp(4), bold: true },
    ...moduleRows(['Nicht-technisches Wahlfach Mentoring', 'B', 'BE', 4]),
    { name: 'Module im Wahlpflichtbereich', grade: '1,8', credits: cp(24), bold: true },
    ...areaRows('Wahlpflichtbereich Angewandte Informatik', '1,5', [
      ['Grundlagen der Computergraphik', '1,3', 'BE', 6],
      ['Real-time Graphics', '1,7', 'BE', 6],
    ]),
    ...areaRows('Wahlpflichtbereich Theoretische Informatik', '2,0', [
      ['Model Checking', '2,0', 'BE', 6],
      ['Logik und Spiele', '2,3', 'BE', 6],
    ]),
    { name: 'Anwendungsfach', grade: '2,3', credits: cp(22), bold: true },
    { name: 'Anwendungsfach Physik', grade: '2,3', credits: cp(22), bold: true },
    ...moduleRows(['Experimentalphysik', '2,3', 'BE', 22]),
  ];
}

const thesisRows: FixtureRow[] = [
  { name: 'Bachelorarbeit', grade: '1,7', credits: cp(12), semester: '20S', bold: true },
  { name: 'Kolloquium', grade: '1,0', annotation: 'BE', credits: cp(3), semester: '20S' },
];

function parse(options: Partial<FixtureOptions> = {}): Notenspiegel {
  return parseNotenspiegel(
    notenspiegelItems({
      rows: completeRows(),
      thesisRows,
      totalCredits: '180,00 / 180,00',
      ...options,
    }),
  );
}

/** The curriculum grade (truncated) and the modules by name. */
function load(notenspiegel: Notenspiegel) {
  const result = importNotenspiegel(notenspiegel);
  const curriculum = Curriculum.fromObject(result.curriculum);
  const modules = new Map(curriculum.modules.map((module) => [module.name, module]));
  return { ...result, curriculum, modules };
}

describe('importNotenspiegel', () => {
  const { curriculum, modules, warnings } = load(parse());
  const grade = truncateGrade(curriculum.eliminationGrade as number);

  test('fills all modules of the PO 2018', () => {
    expect(curriculum.name).toBe('Computer Science B.Sc. (PO 2018)');
    expect(curriculum.modules.every((module) => module.completed)).toBe(true);
    expect(modules.get('Programming (Progra)')?.grade).toBe(1.7);
    expect(modules.get('Mathematical Logic I (MaLo)')?.grade).toBe(2.7);
    expect(modules.get('Proseminar Computer Science')?.grade).toBe(1.7);
    expect(modules.get('Software Project Lab (SPP)')?.grade).toBe(1.3);
  });

  test('marks ungraded modules as passed', () => {
    for (const name of [
      'System Programming (PSP)',
      'Mentoring in Informatics',
      'Non-Technical Elective Module (NTW)',
    ]) {
      expect(modules.get(name)).toMatchObject({ isGraded: false, passed: true });
    }
  });

  test('keeps eliminated modules eliminated, with an unknown grade', () => {
    const eliminated = curriculum.modules.filter((module) => module.eliminated);
    expect(eliminated.map((module) => module.name)).toEqual([
      'Data Structures and Algorithms (DsAl)',
      'Operating Systems and System Software (BuS)',
      'Formal Systems, Automata, Processes (FoSAP)',
      'Calculus for Computer Science (AfI)',
    ]);
    expect(eliminated.every((module) => module.gradeUnknown)).toBe(true);
    expect(curriculum.isValidElimination).toBe(true);
  });

  test('fills the electives in order', () => {
    const electives = curriculum.moduleAreas.find((area) => area.name === 'Elective Modules');
    expect(electives?.modules.map((module) => [module.name, module.grade, module.credits])).toEqual(
      [
        ['Grundlagen der Computergraphik', 1.3, 6],
        ['Real-time Graphics', 1.7, 6],
        ['Model Checking', 2.0, 6],
        ['Logik und Spiele', 2.3, 6],
      ],
    );
  });

  test('names the application module after the subject', () => {
    expect(modules.get('Anwendungsfach Physik')).toMatchObject({ grade: 2.3, credits: 22 });
  });

  test('averages the thesis and the colloquium', () => {
    // (1.7 · 12 + 1.0 · 3) / 15 = 1.56
    expect(modules.get('Bachelor Thesis (BT)')).toMatchObject({ grade: 1.5, credits: 15 });
  });

  test('warns if the grade differs from the Notenspiegel', () => {
    expect(warnings).toEqual([]);
    const other = truncateGrade(grade + 0.3);
    const result = load(parse({ totalGrade: String(other).replace('.', ',') }));
    expect(result.warnings).toEqual([
      { kind: 'grade-mismatch', calculated: grade, official: other },
    ]);
  });

  test('accepts a matching grade in the Notenspiegel', () => {
    const result = load(parse({ totalGrade: grade.toFixed(1).replace('.', ',') }));
    expect(result.warnings).toEqual([]);
  });

  test('reads English exports', () => {
    const english = load(
      parseNotenspiegel(
        notenspiegelItems({
          language: 'en',
          program: 'Computer Science',
          rows: [
            { name: 'Computer Science', grade: '2.0', credits: '6.00', bold: true },
            { name: 'Module area Mathematics', grade: '2.0', credits: '6.00', bold: true },
            { name: 'Linear Algebra', grade: '2.0', credits: '6.00', bold: true },
            { name: 'Linear Algebra', grade: '2.0', annotation: 'BE', credits: '6.00' },
          ],
        }),
      ),
    );
    expect(english.modules.get('Linear Algebra (LA)')?.grade).toBe(2.0);
    expect(english.warnings).toEqual([]);
  });

  test('leaves failed and registered modules open', () => {
    const partial = load(
      parse({
        rows: [
          { name: 'Informatik', grade: '2,0', credits: cp(6), bold: true },
          { name: 'Modulbereich Mathematik', grade: '2,0', credits: cp(6), bold: true },
          ...moduleRows(['Diskrete Strukturen', '2,0', 'BE', 6]),
          { name: 'Lineare Algebra', credits: cp(0), bold: true },
          { name: 'Lineare Algebra', grade: '5,0', annotation: 'NB', credits: cp(0) },
          { name: 'Lineare Algebra', annotation: 'AN', credits: cp(0) },
        ],
        thesisRows: undefined,
      }),
    );

    expect(partial.modules.get('Discrete Structures (DS)')?.grade).toBe(2.0);
    expect(partial.modules.get('Linear Algebra (LA)')).toMatchObject({
      grade: undefined,
      completed: false,
      eliminated: undefined,
    });
    expect(partial.modules.get('Bachelor Thesis (BT)')?.completed).toBe(false);
    expect(partial.warnings).toEqual([]);
  });

  test('warns about modules that could not be assigned', () => {
    const rows = completeRows();
    rows.push(...moduleRows(['Zusatzmodul', '1,0', 'BE', 5]));
    expect(load(parse({ rows })).warnings).toContainEqual({
      kind: 'unassigned',
      name: 'Zusatzmodul',
      credits: 5,
    });
  });

  test('warns if the eliminations exceed the limits', () => {
    const rows = completeRows().map((row) =>
      row.name === 'Programmierung'
        ? { ...row, grade: 'B', annotation: row.annotation && 'G' }
        : row,
    );
    expect(load(parse({ rows })).warnings).toContainEqual({ kind: 'elimination-limits' });
  });

  test('rejects other courses of study and examination regulations', () => {
    expect(() => importNotenspiegel(parse({ studyId: '1234 56 789 (2022)' }))).toThrow(
      UnsupportedProgramError,
    );
    expect(() => importNotenspiegel(parse({ program: 'Mathematik' }))).toThrow(
      'Mathematik (PO 2018) is not supported yet. ' +
        'Supported: Computer Science B.Sc. (PO 2018), Computer Science M.Sc. (PO 2023).',
    );
    expect(() =>
      importNotenspiegel(parse({ degree: 'Master of Science RWTH Aachen University' })),
    ).toThrow(UnsupportedProgramError);
  });
});
