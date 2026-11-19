import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import GradeText from './GradeText.svelte';

function html(props: { text: string }): string {
  return render(GradeText, { props }).body.replace(/<!--.*?-->/g, '');
}

describe('GradeText', () => {
  test('marks the second decimal place', () => {
    expect(html({ text: '1.59' })).toBe('1.5<span class="truncated-digits">9</span>');
  });

  test('shows other grades as they are', () => {
    expect(html({ text: '2.3' })).toBe('2.3');
    expect(html({ text: 'TBD' })).toBe('TBD');
    expect(html({ text: 'B' })).toBe('B');
    expect(html({ text: '' })).toBe('');
  });
});
