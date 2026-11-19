import { render } from 'svelte/server';
import { describe, expect, test } from 'vitest';
import IconButton from './IconButton.svelte';

function html(props: Parameters<typeof IconButton>[1]): string {
  return render(IconButton, { props }).body;
}

describe('IconButton', () => {
  const onclick = () => {};

  test('labels the button for tooltips and screen readers', () => {
    const body = html({ icon: 'plus', label: 'Add a module', onclick });
    expect(body).toContain('title="Add a module"');
    expect(body).toContain('aria-label="Add a module"');
    expect(body).toContain('type="button"');
  });

  test('hides the icon from screen readers', () => {
    expect(html({ icon: 'trash', label: 'Remove', onclick })).toMatch(
      /<svg[^>]*aria-hidden="true"/,
    );
  });

  test('uses the ghost variant by default', () => {
    expect(html({ icon: 'pencil', label: 'Edit', onclick })).toMatch(/class="icon-button ghost/);
    expect(html({ icon: 'check', label: 'Save', variant: 'primary', onclick })).toMatch(
      /class="icon-button primary/,
    );
  });

  test('draws the icon with SVG paths', () => {
    const body = html({ icon: 'x', label: 'Discard', onclick });
    expect(body.match(/<path /g)).toHaveLength(2);
  });
});
