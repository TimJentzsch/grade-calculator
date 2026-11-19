import { describe, expect, test } from 'vitest';
import { type NotenspiegelEntry, NotenspiegelParseError, parseNotenspiegel } from './parse';
import { type FixtureRow, notenspiegelItems } from './test-fixtures';

const area = (name: string, grade: string, credits: string): FixtureRow => ({
  name,
  grade,
  credits,
  bold: true,
});
const exam = (name: string, grade: string, annotation: string, credits: string): FixtureRow => ({
  name,
  grade,
  annotation,
  credits,
  date: '20.02.2018',
  semester: '19W',
});

/** A short Notenspiegel with nested areas, an eliminated grade, a failed attempt and wrapped names. */
const rows: FixtureRow[] = [
  area('Informatik', '2,0', '42,00'),
  area('Modulbereich Mathematik', '2,7', '14,00'),
  area('Diskrete Strukturen', '2,7', '6,00'),
  exam('Diskrete Strukturen', '2,7', 'BE', '6,00'),
  area('Analysis für Informatik', 'B', '8,00'),
  exam('Analysis für Informatiker', '5,0', 'NB', '0,00'),
  exam('Analysis für Informatiker', 'B', 'G', '8,00'),
  area('Module im Wahlpflichtbereich', '1,3', '6,00'),
  area('Wahlpflichtbereich Theoretische Informatik', '1,3', '6,00'),
  area('Model Checking', '1,3', '6,00'),
  exam('Model Checking', '1,3', 'BE', '6,00'),
  area('Anwendungsfach', '2,8', '22,00'),
  area('Anwendungsfach Biologie', '2,8', '22,00'),
  area('Biologie für Studierende der Informatik und Mathematik', '2,8', '12,00'),
  exam(
    'Einführung in die Biologie für Informatiker und Mathematiker,\nTeil 2',
    '1,7',
    'BE',
    '6,00',
  ),
  exam(
    'Einführung in die Biologie für Informatiker und Mathematiker,\nTeil 1',
    '4,0',
    'BE',
    '6,00',
  ),
  area('Praktikum Biologie für Studierende der Informatik', 'B', '10,00'),
  exam('Praktikum Tierphysiologie', 'B', 'BE', '10,00'),
];

const thesisRows: FixtureRow[] = [
  { ...area('Bachelorarbeit', '1,3', '12,00'), semester: '20S' },
  exam('Kolloquium', '1,0', 'BE', '3,00'),
];

/** The names of the entry and its descendants, indented by depth. */
function outline(entry: NotenspiegelEntry, depth = 0): string[] {
  return [
    `${'  '.repeat(depth)}${entry.name}`,
    ...entry.children.flatMap((child) => outline(child, depth + 1)),
  ];
}

describe('parseNotenspiegel', () => {
  const notenspiegel = parseNotenspiegel(
    notenspiegelItems({
      rows,
      thesisRows,
      thesisTopic: 'Ein sehr interessantes Thema',
      totalCredits: '180,00 / 180,00',
      totalGrade: '2,0',
    }),
  );

  test('reads the course of study and examination regulations', () => {
    expect(notenspiegel.language).toBe('de');
    expect(notenspiegel.program).toBe('Informatik');
    expect(notenspiegel.degree).toBe('Bachelor of Science RWTH Aachen University');
    expect(notenspiegel.poYear).toBe(2018);
  });

  test('does not read personal data', () => {
    expect(JSON.stringify(notenspiegel)).not.toMatch(/Mustermann|Erika|123456/);
  });

  test('reads the totals', () => {
    expect(notenspiegel.totalCredits).toBe(180);
    expect(notenspiegel.totalGrade).toBe(2.0);
  });

  test('nests the rows by their credits', () => {
    expect(outline(notenspiegel.root)).toEqual([
      'Informatik',
      '  Modulbereich Mathematik',
      '    Diskrete Strukturen',
      '      Diskrete Strukturen',
      '    Analysis für Informatik',
      '      Analysis für Informatiker',
      '      Analysis für Informatiker',
      '  Module im Wahlpflichtbereich',
      '    Wahlpflichtbereich Theoretische Informatik',
      '      Model Checking',
      '        Model Checking',
      '  Anwendungsfach',
      '    Anwendungsfach Biologie',
      '      Biologie für Studierende der Informatik und Mathematik',
      '        Einführung in die Biologie für Informatiker und Mathematiker, Teil 2',
      '        Einführung in die Biologie für Informatiker und Mathematiker, Teil 1',
      '      Praktikum Biologie für Studierende der Informatik',
      '        Praktikum Tierphysiologie',
    ]);
  });

  test('reads the cells of modules and exams', () => {
    const analysis = notenspiegel.root.children[0].children[1];
    expect(analysis).toMatchObject({
      name: 'Analysis für Informatik',
      grade: 'B',
      credits: 8,
      isExam: false,
    });
    expect(analysis.children).toEqual([
      {
        name: 'Analysis für Informatiker',
        grade: 5.0,
        annotation: 'NB',
        credits: 0,
        date: '2018-02-20',
        semester: '19W',
        children: [],
        isExam: true,
      },
      expect.objectContaining({ grade: 'B', annotation: 'G', credits: 8 }),
    ]);
  });

  test('reads the thesis and colloquium, but not the topic', () => {
    expect(notenspiegel.thesis).toMatchObject({
      name: 'Bachelorarbeit',
      grade: 1.3,
      credits: 12,
      semester: '20S',
      children: [{ name: 'Kolloquium', grade: 1.0, annotation: 'BE', credits: 3 }],
    });
  });

  test('continues the table on the next page and skips page headers and footers', () => {
    const paged = parseNotenspiegel(notenspiegelItems({ rows, rowsPerPage: 5 }));
    expect(outline(paged.root)).toEqual(outline(notenspiegel.root));
  });

  test('reads English exports', () => {
    const english = parseNotenspiegel(
      notenspiegelItems({
        language: 'en',
        program: 'Computer Science',
        rows: [
          area('Computer Science', '1.7', '6.00'),
          area('Module area Mathematics', '1.7', '6.00'),
          area('Linear Algebra', '1.7', '6.00'),
          { ...exam('Linear Algebra', '1.7', 'BE', '6.00'), date: '2018-08-01' },
        ],
        totalGrade: '1.7',
      }),
    );

    expect(english.language).toBe('en');
    expect(english.program).toBe('Computer Science');
    expect(english.totalGrade).toBe(1.7);
    expect(english.root.children[0].children[0].children[0]).toMatchObject({
      grade: 1.7,
      credits: 6,
      date: '2018-08-01',
    });
  });

  test('only reads the first language of bilingual exports', () => {
    const german = notenspiegelItems({ rows, totalGrade: '2,0' });
    const english = notenspiegelItems({
      language: 'en',
      rows: [area('Computer Science', '1.0', '6.00')],
      totalGrade: '1.0',
    }).map((item) => ({ ...item, page: item.page + 10 }));

    const bilingual = parseNotenspiegel([...german, ...english]);
    expect(bilingual.language).toBe('de');
    expect(bilingual.totalGrade).toBe(2.0);
    expect(outline(bilingual.root)).toEqual(outline(notenspiegel.root));
  });

  test('reads partial transcripts without thesis and totals', () => {
    const partial = parseNotenspiegel(notenspiegelItems({ rows: rows.slice(0, 4) }));
    expect(partial.thesis).toBeUndefined();
    expect(partial.totalGrade).toBeUndefined();
    expect(outline(partial.root)).toEqual([
      'Informatik',
      '  Modulbereich Mathematik',
      '    Diskrete Strukturen',
      '      Diskrete Strukturen',
    ]);
  });

  test('rejects other documents', () => {
    expect(() =>
      parseNotenspiegel([{ page: 0, x: 10, y: 10, width: 50, text: 'Invoice', bold: false }]),
    ).toThrow(NotenspiegelParseError);
  });
});
