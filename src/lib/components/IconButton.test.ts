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

  test('can be a toggle', () => {
    expect(html({ icon: 'ban', label: 'Eliminate', pressed: true, onclick })).toContain(
      'aria-pressed="true"',
    );
    expect(html({ icon: 'ban', label: 'Eliminate', pressed: false, onclick })).toContain(
      'aria-pressed="false"',
    );
    expect(html({ icon: 'plus', label: 'Add', onclick })).not.toContain('aria-pressed');
  });

  test('draws the icon with SVG paths', () => {
    const body = html({ icon: 'x', label: 'Discard', onclick });
    expect(body.match(/<path /g)).toHaveLength(2);
  });

  test('can be disabled', () => {
    expect(html({ icon: 'ban', label: 'Eliminate', disabled: true, onclick })).toContain(
      'disabled',
    );
    expect(html({ icon: 'ban', label: 'Eliminate', onclick })).not.toContain('disabled');
  });
});
