import { deflateSync } from 'node:zlib';
import { describe, expect, test } from 'vitest';
import { extractTextItems, PdfReadError } from './pdf-text';

/**
 * Creates a minimal one-page PDF with a regular and a bold font.
 * @param content The (uncompressed) content stream of the page.
 */
function createPdf(content: string): Uint8Array {
  const stream = deflateSync(Buffer.from(content, 'latin1'));
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R' +
      ' /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
    `<< /Length ${stream.length} /Filter /FlateDecode >>\nstream\n`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];

  const parts: Buffer[] = [Buffer.from('%PDF-1.4\n', 'latin1')];
  let length = parts[0].length;
  const offsets: number[] = [];
  const push = (part: Buffer) => {
    parts.push(part);
    length += part.length;
  };

  objects.forEach((object, index) => {
    offsets.push(length);
    push(Buffer.from(`${index + 1} 0 obj\n${object}`, 'latin1'));
    if (index === 3) {
      push(stream);
      push(Buffer.from('\nendstream', 'latin1'));
    }
    push(Buffer.from('\nendobj\n', 'latin1'));
  });

  const xref = [
    'xref',
    `0 ${objects.length + 1}`,
    '0000000000 65535 f ',
    ...offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n `),
    'trailer',
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    'startxref',
    String(length),
    '%%EOF',
  ].join('\n');
  push(Buffer.from(xref, 'latin1'));

  return new Uint8Array(Buffer.concat(parts));
}

describe('extractTextItems', () => {
  test('returns the text items with their positions and fonts', () => {
    const pdf = createPdf(
      'BT /F2 10 Tf 60 700 Td (Programmierung) Tj ET\n' +
        'BT /F1 10 Tf 343 700 Td (2,3) Tj ET\n' +
        // "für" in WinAnsiEncoding
        'BT /F1 10 Tf 60 680 Td (Analysis f\\374r Informatiker) Tj ET',
    );

    const items = extractTextItems(pdf);

    expect(items.map(({ text, bold, page }) => ({ text, bold, page }))).toEqual([
      { text: 'Programmierung', bold: true, page: 0 },
      { text: '2,3', bold: false, page: 0 },
      { text: 'Analysis für Informatiker', bold: false, page: 0 },
    ]);
    expect(items[1].x).toBeCloseTo(343);
    expect(items[1].y).toBeCloseTo(700);
    expect(items[1].width).toBeGreaterThan(0);
  });

  test('rejects files that are not PDFs', () => {
    expect(() => extractTextItems(new TextEncoder().encode('{"name": "curriculum"}'))).toThrow(
      PdfReadError,
    );
  });
});
