import type { TextItem } from './pdf-text.ts';

/** A row of a generated Notenspiegel table. Wrapped names contain a `\n`. */
export interface FixtureRow {
  name: string;
  grade?: string;
  annotation?: string;
  credits: string;
  date?: string;
  semester?: string;
  /** Areas and modules are bold, exams are not. */
  bold?: boolean;
}

export interface FixtureOptions {
  language?: 'de' | 'en';
  program?: string;
  degree?: string;
  studyId?: string;
  rows: FixtureRow[];
  thesisRows?: FixtureRow[];
  thesisTopic?: string;
  totalCredits?: string;
  totalGrade?: string;
  /** The number of rows after which a new page starts. */
  rowsPerPage?: number;
}

const LABELS = {
  de: {
    title: 'Notenspiegel',
    name: ['Nachname:', 'Vorname:'],
    program: 'Studiengang:',
    degree: '(angestrebter) Abschluss:',
    studyId: 'Studien-ID:',
    matriculation: 'Matrikelnummer:',
    table: ['Module/Fächer', 'Note', 'Vm', 'Ang', 'CP', 'Datum', 'Sem'],
    thesis: 'Abschlussarbeit',
    topic: 'Thema:',
    totalCredits: 'Gesamtcredits:',
    totalGrade: 'Gesamtnote:',
  },
  en: {
    title: 'Certification Examinations',
    name: ['Family Name:', 'First Name:'],
    program: 'Course of Study:',
    degree: '(Intended) Degree:',
    studyId: 'Study-ID:',
    matriculation: 'Student ID Number:',
    table: ['Modules/Courses', 'Grade', 'An', 'Rec', 'CP', 'Date', 'Sem'],
    thesis: 'Final thesis',
    topic: 'Topic:',
    totalCredits: 'Overall Credits:',
    totalGrade: 'Overall Grade:',
  },
};

/** The centers of the value columns, as in the PDFs exported by RWTH Online. */
const CENTERS = {
  grade: 350,
  annotation: 384,
  recognized: 415,
  credits: 450,
  date: 506,
  semester: 557,
};
const HEADER_X = [60, 339, 376, 405, 444, 490, 546];
const NAME_X = 60;
const LABEL_X = [57, 332];

function width(text: string): number {
  // About the average width of a letter of Arial at 10 pt
  return text.length * 4.4;
}

/**
 * Generates the text items of a Notenspiegel PDF as exported by RWTH Online,
 * with the same layout: personal data, the table split over pages, the thesis table and totals.
 * Header lines are split into single letters, like the PDF does for small text.
 */
export function notenspiegelItems(options: FixtureOptions): TextItem[] {
  const language = options.language ?? 'de';
  const labels = LABELS[language];
  const items: TextItem[] = [];
  let page = 0;
  let y = 800;

  const text = (x: number, itemY: number, value: string, bold = false) => {
    items.push({ page, x, y: itemY, width: width(value), text: value, bold });
  };
  const centered = (center: number, itemY: number, value: string, bold = false) => {
    text(center - width(value) / 2, itemY, value, bold);
  };
  const labeled = (label: string, value: string, column: number) => {
    text(LABEL_X[column], y, label);
    text(LABEL_X[column], y - 10, value, true);
  };
  const tableHeader = (title: string) => {
    labels.table.forEach((header, index) =>
      text(HEADER_X[index], y, index === 0 ? title : header, true),
    );
    y -= 19;
  };
  const newPage = () => {
    text(57, 30, labels.title);
    text(558, 30, `${page + 1} / 3`);
    page += 1;
    y = 824;
    // A header with personal data, split into letters
    [...'Mustermann, Erika'].forEach((letter, index) => text(57 + index * 4, y, letter));
    text(302, y, '123456');
    y = 797;
  };

  text(57, y, labels.title, true);
  y -= 30;
  labeled(labels.name[0], 'Mustermann', 0);
  labeled(labels.name[1], 'Erika', 1);
  y -= 34;
  labeled(labels.matriculation, '123456', 0);
  labeled(labels.studyId, options.studyId ?? '1234 56 789 (2018)', 1);
  y -= 34;
  labeled(labels.program, options.program ?? 'Informatik', 0);
  labeled(labels.degree, options.degree ?? 'Bachelor of Science RWTH Aachen University', 1);
  y -= 44;

  const writeRows = (rows: FixtureRow[], title: string, topic?: string) => {
    tableHeader(title);
    rows.forEach((row, index) => {
      if (index > 0 && index % (options.rowsPerPage ?? 1000) === 0) {
        newPage();
        tableHeader(title);
      }
      const bold = row.bold ?? false;
      const [firstLine, ...wrapped] = row.name.split('\n');
      text(NAME_X, y, firstLine, bold);
      const cells = {
        grade: row.grade,
        annotation: row.annotation,
        recognized: 'N',
        credits: row.credits,
        date: row.date,
        semester: row.semester,
      };
      for (const [column, value] of Object.entries(cells)) {
        if (value) {
          centered(CENTERS[column as keyof typeof CENTERS], y, value, bold);
        }
      }
      for (const line of wrapped) {
        y -= 10;
        text(NAME_X, y, line, bold);
      }
      y -= 17;
      if (index === 0 && topic) {
        text(NAME_X, y, `${labels.topic} ${topic}`);
        y -= 17;
      }
    });
  };

  writeRows(options.rows, labels.table[0]);
  if (options.thesisRows) {
    y -= 15;
    writeRows(options.thesisRows, labels.thesis, options.thesisTopic);
  }

  y -= 15;
  if (options.totalCredits) {
    text(57, y, `${labels.totalCredits} ${options.totalCredits}`, true);
  }
  if (options.totalGrade) {
    text(57, y - 10, `${labels.totalGrade} ${options.totalGrade}`, true);
  }
  text(57, y - 40, 'Erläuterungen: G/GA/GL = Note gestrichen');

  return items;
}
