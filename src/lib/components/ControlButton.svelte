<script lang="ts">
  type Variant = 'add' | 'edit' | 'remove' | 'save' | 'discard';

  interface Props {
    variant: Variant;
    title: string;
    onclick: () => void;
  }

  const { variant, title, onclick }: Props = $props();

  // The variation selector U+FE0E forces the text (non-emoji) presentation of the glyphs.
  const glyphs: Record<Variant, string> = {
    add: '➕︎',
    edit: '✎︎',
    remove: '\u{1F5D9}︎',
    save: '✔︎',
    discard: '\u{1F5D9}︎',
  };
</script>

<button class="{variant}-button control-button" {title} {onclick}>{glyphs[variant]}</button>
