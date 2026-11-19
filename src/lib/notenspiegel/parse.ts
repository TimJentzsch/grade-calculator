import type { TextItem } from './pdf-text.ts';

/** A row of the Notenspiegel table: an area, a module or an exam. */
export interface NotenspiegelEntry {
  name: string;
  /** The grade, `'B'` for passed without a grade, or `undefined` if there is none. */
  grade: number | 'B' | undefined;
  /** The annotation ("Vermerk") of an exam, e.g. `BE` for passed or `G` for an eliminated grade. */
  annotation?: string;
  credits: number;
  /** The date in ISO format, e.g. `2018-02-20`. */
  date?: string;
  /** The semester, e.g. `19W` or `18S`. */
  semester?: string;
  /**
   * The areas and modules contained in an area, or the exams of a module.
   * Exams have no children.
   */
  children: NotenspiegelEntry[];
  /** Whether this is an exam, i.e. a normal (not bold) row of the table. */
  isExam: boolean;
}

/** The contents of a Notenspiegel exported from RWTH Online. */
export interface Notenspiegel {
  /** The language of the parsed table. Bilingual exports contain both, but only the first is parsed. */
  language: 'de' | 'en';
  /** The course of study, e.g. `Informatik` or `Computer Science`. */
  program: string;
  /** The (intended) degree, e.g. `Bachelor of Science RWTH Aachen University`. */
  degree: string;
  /** The version of the examination regulations ("Prüfungsordnung"), e.g. `2018`. */
  poYear?: number;
  totalCredits?: number;
  totalGrade?: number;
  /** The first row of the table, which contains all other rows, e.g. `Informatik`. */
  root: NotenspiegelEntry;
  /** The thesis, with the colloquium as its exam. */
  thesis?: NotenspiegelEntry;
}

/** Thrown if the text does not look like a Notenspiegel. */
export class NotenspiegelParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotenspiegelParseError';
  }
}

/** Items on the same line can differ slightly in their baseline. */
const LINE_TOLERANCE = 2;
/** Items closer than this are parts of the same text, e.g. single letters of a heading. */
const CELL_GAP = 1.5;
/**
 * A line closer than this below the previous one continues its name, which was too long for one
 * line. Table rows are at least about 16 units apart, wrapped lines about 10 units.
 */
const WRAPPED_LINE_GAP = 13;
const CREDITS_TOLERANCE = 0.01;

interface Cell {
  x: number;
  right: number;
  text: string;
  bold: boolean;
}

interface Line {
  page: number;
  y: number;
  cells: Cell[];
}

type Column = 'name' | 'grade' | 'annotation' | 'recognized' | 'credits' | 'date' | 'semester';

const COLUMN_HEADERS: Record<'de' | 'en', Record<string, Column>> = {
  de: {
    Note: 'grade',
    Vm: 'annotation',
    Ang: 'recognized',
    CP: 'credits',
    Datum: 'date',
    Sem: 'semester',
  },
  en: {
    Grade: 'grade',
    An: 'annotation',
    Rec: 'recognized',
    CP: 'credits',
    Date: 'date',
    Sem: 'semester',
  },
};

/** The first cell of the header row of the module table, and of the thesis table. */
const TABLE_TITLES: Record<string, { language: 'de' | 'en'; thesis: boolean }> = {
  'Module/Fächer': { language: 'de', thesis: false },
  'Modules/Courses': { language: 'en', thesis: false },
  Abschlussarbeit: { language: 'de', thesis: true },
  'Final thesis': { language: 'en', thesis: true },
};

const HEADER_LABELS = {
  program: ['Studiengang:', 'Course of Study:'],
  degree: ['(angestrebter) Abschluss:', '(Intended) Degree:'],
  studyId: ['Studien-ID:', 'Study-ID:'],
};

const TOTAL_CREDITS_PATTERN = /^(?:Gesamtcredits|Overall Credits):\s*([\d.,]+)/;
const TOTAL_GRADE_PATTERN = /^(?:Gesamtnote|Overall Grade):\s*([\d.,]+)/;

/** Groups the text items into lines of cells, from the top to the bottom of each page. */
function toLines(items: TextItem[]): Line[] {
  const sorted = items
    .filter((item) => item.text.trim() !== '' || item.text === ' ')
    .toSorted((a, b) => a.page - b.page || b.y - a.y || a.x - b.x);

  const lines: { page: number; y: number; items: TextItem[] }[] = [];
  for (const item of sorted) {
    const line = lines.at(-1);
    if (line && line.page === item.page && Math.abs(line.y - item.y) <= LINE_TOLERANCE) {
      line.items.push(item);
    } else {
      lines.push({ page: item.page, y: item.y, items: [item] });
    }
  }

  return lines.map((line) => {
    const cells: Cell[] = [];
    for (const item of line.items.toSorted((a, b) => a.x - b.x)) {
      const cell = cells.at(-1);
      if (cell && cell.bold === item.bold && item.x - cell.right < CELL_GAP) {
        cell.text += item.text;
        cell.right = Math.max(cell.right, item.x + item.width);
      } else {
        cells.push({ x: item.x, right: item.x + item.width, text: item.text, bold: item.bold });
      }
    }
    for (const cell of cells) {
      cell.text = cell.text.replace(/\s+/g, ' ').trim();
    }
    return { page: line.page, y: line.y, cells: cells.filter((cell) => cell.text !== '') };
  });
}

/** Parses a number with `,` or `.` as decimal separator, e.g. `2,3` or `180.00`. */
function parseNumber(text: string | undefined): number | undefined {
  if (text === undefined || !/^\d+(?:[.,]\d+)?$/.test(text)) {
    return undefined;
  }
  return Number(text.replace(',', '.'));
}

function parseGradeCell(text: string | undefined): number | 'B' | undefined {
  if (text === 'B') {
    return 'B';
  }
  return parseNumber(text);
}

/** Converts a German date (`20.02.2018`) to ISO format, English dates already are. */
function parseDate(text: string | undefined): string | undefined {
  const german = text?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (german) {
    return `${german[3]}-${german[2]}-${german[1]}`;
  }
  return text && /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : undefined;
}

/** Finds the value below a label of the personal data, e.g. the course of study. */
function findLabeledValue(lines: Line[], labels: string[]): string | undefined {
  for (const [index, line] of lines.entries()) {
    const label = line.cells.find((cell) => labels.includes(cell.text));
    if (!label) {
      continue;
    }
    const next = lines[index + 1];
    const value = next?.cells.find((cell) => Math.abs(cell.x - label.x) < 5);
    if (next && next.page === line.page && value) {
      return value.text;
    }
  }
  return undefined;
}

interface Row {
  cells: Partial<Record<Column, string>>;
  bold: boolean;
  thesis: boolean;
}

interface ColumnPosition {
  column: Column;
  center: number;
}

/** Reads the rows of the module and thesis tables, until the totals below them. */
function readRows(lines: Line[]): {
  language: 'de' | 'en';
  rows: Row[];
  totalCredits?: number;
  totalGrade?: number;
} {
  let language: 'de' | 'en' | undefined;
  let columns: ColumnPosition[] | undefined;
  /** The left edge of the grade column, everything left of it belongs to the name. */
  let nameEnd = 0;
  let thesis = false;
  let page = -1;
  const rows: Row[] = [];
  let totalCredits: number | undefined;
  let totalGrade: number | undefined;
  /** The previous line of the table, if it was a row (and not skipped). */
  let previous: { line: Line; row: Row | undefined } | undefined;

  for (const line of lines) {
    const first = line.cells[0]?.text ?? '';

    const totalCreditsMatch = first.match(TOTAL_CREDITS_PATTERN);
    const totalGradeMatch = first.match(TOTAL_GRADE_PATTERN);
    if (totalCreditsMatch) {
      totalCredits = parseNumber(totalCreditsMatch[1]);
    }
    if (totalGradeMatch) {
      totalGrade = parseNumber(totalGradeMatch[1]);
      // Bilingual exports repeat everything in English, which is ignored
      break;
    }
    if (totalCreditsMatch) {
      continue;
    }

    const title = TABLE_TITLES[first];
    if (title && (language === undefined || title.language === language)) {
      language = title.language;
      thesis = title.thesis;
      page = line.page;
      const headers = COLUMN_HEADERS[language];
      columns = line.cells.flatMap((cell) =>
        headers[cell.text]
          ? [{ column: headers[cell.text], center: (cell.x + cell.right) / 2 }]
          : [],
      );
      const gradeHeader = line.cells.find((cell) => headers[cell.text] === 'grade');
      nameEnd = gradeHeader ? gradeHeader.x - 10 : 0;
      previous = undefined;
      continue;
    }

    // Only lines below a table header on the same page belong to the table
    if (!columns || line.page !== page) {
      continue;
    }

    const cells: Partial<Record<Column, string>> = {};
    let bold = false;
    for (const cell of line.cells) {
      let column: Column = 'name';
      if (cell.x >= nameEnd) {
        const center = (cell.x + cell.right) / 2;
        column = columns.reduce((best, current) =>
          Math.abs(current.center - center) < Math.abs(best.center - center) ? current : best,
        ).column;
      } else {
        bold = cell.bold;
      }
      cells[column] = cells[column] ? `${cells[column]} ${cell.text}` : cell.text;
    }

    const nameOnly = Object.keys(cells).length === 1 && cells.name !== undefined;
    const isWrapped =
      nameOnly && previous !== undefined && previous.line.y - line.y < WRAPPED_LINE_GAP;

    if (isWrapped) {
      // The rest of a long name, or of a skipped line
      if (previous?.row) {
        previous.row.cells.name = `${previous.row.cells.name} ${cells.name}`;
      }
      previous = { line, row: previous?.row };
    } else if (cells.name === undefined || cells.credits === undefined) {
      // Every row has credits, so this is e.g. the topic of the thesis or the page footer
      previous = { line, row: undefined };
    } else {
      const row = { cells, bold, thesis };
      rows.push(row);
      previous = { line, row };
    }
  }

  if (language === undefined) {
    throw new NotenspiegelParseError('No table of modules was found.');
  }

  return { language, rows, totalCredits, totalGrade };
}

function toEntry(row: Row): NotenspiegelEntry {
  return {
    name: row.cells.name ?? '',
    grade: parseGradeCell(row.cells.grade),
    annotation: row.cells.annotation,
    credits: parseNumber(row.cells.credits) ?? 0,
    date: parseDate(row.cells.date),
    semester: row.cells.semester,
    children: [],
    isExam: !row.bold,
  };
}

/**
 * Builds the tree of the table. The rows are not indented, but the credits of an area are the
 * sum of the credits of its children. A module's exams directly follow it as normal rows.
 * @returns The entry starting at `start` and the index of the row after it.
 */
function buildTree(rows: Row[], start: number): [NotenspiegelEntry, number] {
  const entry = toEntry(rows[start]);
  let index = start + 1;

  while (index < rows.length && !rows[index].bold) {
    entry.children.push(toEntry(rows[index]));
    index += 1;
  }

  // A module with exams has no further children
  if (entry.children.length > 0) {
    return [entry, index];
  }

  let credits = 0;
  while (index < rows.length && credits < entry.credits - CREDITS_TOLERANCE) {
    const [child, next] = buildTree(rows, index);
    entry.children.push(child);
    credits += child.credits;
    index = next;
  }

  return [entry, index];
}

/**
 * Parses the text of a Notenspiegel exported from RWTH Online.
 * Personal data like the name or the matriculation number is not read.
 * @param items The text items of the PDF, see `extractTextItems`.
 * @throws {NotenspiegelParseError} If the text does not look like a Notenspiegel.
 */
export function parseNotenspiegel(items: TextItem[]): Notenspiegel {
  const lines = toLines(items);
  const { language, rows, totalCredits, totalGrade } = readRows(lines);

  const moduleRows = rows.filter((row) => !row.thesis);
  const thesisRows = rows.filter((row) => row.thesis);
  if (moduleRows.length === 0 || !moduleRows[0].bold) {
    throw new NotenspiegelParseError('The table of modules is empty.');
  }

  const [root, end] = buildTree(moduleRows, 0);
  // Rows that did not fit into the first entry, e.g. because the credits did not add up
  let index = end;
  while (index < moduleRows.length) {
    const [entry, next] = buildTree(moduleRows, index);
    root.children.push(entry);
    index = next;
  }

  const thesis = thesisRows.length > 0 ? toEntry(thesisRows[0]) : undefined;
  thesis?.children.push(...thesisRows.slice(1).map(toEntry));

  const studyId = findLabeledValue(lines, HEADER_LABELS.studyId);
  const poYear = studyId?.match(/\((\d{4})\)/)?.[1];

  return {
    language,
    program: findLabeledValue(lines, HEADER_LABELS.program) ?? '',
    degree: findLabeledValue(lines, HEADER_LABELS.degree) ?? '',
    poYear: poYear ? Number(poYear) : undefined,
    totalCredits,
    totalGrade,
    root,
    thesis,
  };
}
