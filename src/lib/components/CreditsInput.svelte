<script lang="ts">
  import { parseCredits } from '#lib/credits.ts';

  interface Props {
    value: number;
    /** Describes the input for screen readers, if it has no visible label. */
    label?: string;
    class?: string;
  }

  let { value = $bindable(), label, class: className }: Props = $props();

  // Follows the bound value, but can be overwritten while the user is typing.
  let text = $derived(String(value));
  const invalid = $derived(parseCredits(text) === undefined);

  function onchange() {
    value = parseCredits(text) ?? value;
    // Normalize the input and discard invalid entries.
    text = String(value);
  }
</script>

<input
  class={['credit-points-input', className, { invalid }]}
  type="text"
  inputmode="decimal"
  name="credits-input"
  size="3"
  title="Enter the credit points"
  aria-label={label}
  aria-invalid={invalid}
  bind:value={text}
  {onchange}
/>
