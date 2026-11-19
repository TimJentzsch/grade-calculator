import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import Button from './Button.svelte';

const children = createRawSnippet(() => ({ render: () => '<span>Save...</span>' }));

function html(props: Omit<Parameters<typeof Button>[1], 'children'>): string {
  return render(Button, { props: { ...props, children } }).body.replace(/<!--.*?-->/g, '');
}

describe('Button', () => {
  test('renders a button with its content', () => {
    const body = html({ title: 'Save the curriculum', onclick: () => {} });
    expect(body).toMatch(/^<button type="button" class="button[^"]*" title="Save the curriculum"/);
    expect(body).toContain('<span>Save...</span>');
  });

  test('uses the primary variant by default', () => {
    expect(html({})).toMatch(/class="button primary/);
    expect(html({ variant: 'secondary' })).toMatch(/class="button secondary/);
  });

  test('can be disabled', () => {
    expect(html({ disabled: true })).toMatch(/<button[^>]* disabled/);
    expect(html({})).not.toMatch(/disabled/);
  });

  test('renders a link when a target is given', () => {
    const body = html({ href: 'data:application/json,{}', download: 'curriculum.json' });
    expect(body).toMatch(/^<a class="button[^"]*" href="data:application\/json,{}"/);
    expect(body).toContain('download="curriculum.json"');
    expect(body).not.toContain('<button');
  });
});
