import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const SRC_DIR = join(import.meta.dirname, '..', '..');

/** The only files that may define raw colors, fonts and spacing. */
const THEME_FILES = [
  'lib/styles/palette.css',
  'lib/styles/theme.css',
  'lib/styles/typography.css',
  'lib/styles/spacing.css',
];

const NAMED_COLORS = [
  'black',
  'white',
  'gray',
  'grey',
  'lightgray',
  'lightgrey',
  'darkgray',
  'darkgrey',
  'silver',
  'red',
  'green',
  'blue',
  'yellow',
  'orange',
  'purple',
  'pink',
];

const FORBIDDEN: [string, RegExp][] = [
  ['palette color', /--ctp-/],
  ['hex color', /#[0-9a-f]{3,8}\b/i],
  ['color function', /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/i],
  ['named color', new RegExp(`:[^;{}]*\\b(${NAMED_COLORS.join('|')})\\b`, 'i')],
  ['font without token', /\bfont-(family|size|weight)\s*:(?!\s*var\(--font-)/],
  ['font shorthand', /\bfont\s*:(?!\s*inherit\s*;)/],
  ['spacing without token', /\b(margin|padding|gap)(-[a-z]+)?\s*:[^;]*\d(px|r?em)\b/],
  ['radius without token', /\bborder-([a-z]+-)*radius\s*:(?!\s*var\(--radius-)/],
];

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

/** The CSS of a file: the whole file for stylesheets, style blocks and attributes for components. */
function extractCss(path: string): string {
  const content = readFileSync(path, 'utf-8');
  if (path.endsWith('.css')) {
    return content;
  }
  const styleBlocks = [...content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const styleAttributes = [...content.matchAll(/\bstyle="([^"]*)"/g)].map((m) => `{${m[1]}}`);
  return [...styleBlocks, ...styleAttributes].join('\n');
}

const styledFiles = listFiles(SRC_DIR)
  .filter((path) => path.endsWith('.css') || path.endsWith('.svelte'))
  .map((path) => relative(SRC_DIR, path))
  .filter((path) => !THEME_FILES.includes(path));

describe('theming', () => {
  test.each(styledFiles)('%s only uses theme tokens for colors, fonts and spacing', (path) => {
    const lines = extractCss(join(SRC_DIR, path)).split('\n');
    const violations = lines.flatMap((line) =>
      FORBIDDEN.filter(([, pattern]) => pattern.test(line)).map(
        ([kind]) => `${kind}: ${line.trim()}`,
      ),
    );
    expect(violations).toEqual([]);
  });
});
