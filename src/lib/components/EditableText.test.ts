import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import EditableText from './EditableText.svelte';

function html(props: Parameters<typeof EditableText>[1]): string {
  return render(EditableText, { props }).body.replace(/<!--.*?-->/g, '');
}

describe('EditableText', () => {
  test('shows the value as a button that announces the edit action', () => {
    const body = html({ value: 'Programming', label: 'module name' });
    expect(body).toMatch(/^<button type="button" class="editable-text[^"]*">Programming</);
    expect(body).toContain('<span class="visually-hidden">, edit module name</span>');
  });

  test('shows the placeholder if the value is empty', () => {
    for (const value of ['', undefined]) {
      const body = html({ value, label: 'module name', placeholder: 'Unnamed module' });
      expect(body).toMatch(/class="editable-text[^"]* empty[^"]*">Unnamed module</);
    }
  });
});
