import { DocuText } from 'docutext/browser';

/** A piece of text on a page of a PDF. */
export interface TextItem {
  /** The index of the page, starting at 0. */
  page: number;
  /** The left edge of the text, in PDF units from the left edge of the page. */
  x: number;
  /** The baseline of the text, in PDF units from the bottom edge of the page. */
  y: number;
  /** The width of the text, in PDF units. */
  width: number;
  text: string;
  /** Whether the text uses a bold font. */
  bold: boolean;
}

/** Thrown if a file can't be read as a PDF. */
export class PdfReadError extends Error {
  constructor(cause?: unknown) {
    super('This file could not be read as a PDF.', { cause });
    this.name = 'PdfReadError';
  }
}

/**
 * Extracts the text items of all pages of a PDF, with their positions.
 * @param data The contents of the PDF file.
 * @returns The text items of all pages, in the order of the pages.
 * @throws {PdfReadError} If the file is not a PDF or uses unsupported features, e.g. encryption.
 */
export function extractTextItems(data: Uint8Array): TextItem[] {
  try {
    const document = DocuText.fromBuffer(data);
    try {
      return document.pages.flatMap((page, pageIndex) => {
        // Reading the items first, as errors are only known once the page is parsed
        const items = page.textItems;
        if (page.error) {
          throw page.error;
        }
        return items.map((item) => ({
          page: pageIndex,
          x: item.x,
          y: item.y,
          width: item.width,
          text: item.text,
          bold: /bold/i.test(item.fontName),
        }));
      });
    } finally {
      document.dispose();
    }
  } catch (error) {
    throw new PdfReadError(error);
  }
}
