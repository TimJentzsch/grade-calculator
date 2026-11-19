<script lang="ts">
  interface Props {
    value: number;
    /** Parses the entered text, returning `undefined` if it is invalid. */
    parse: (text: string) => number | undefined;
    format?: (value: number) => string;
    /** Describes the expected input, shown as tooltip. */
    hint: string;
    /** Describes the input for screen readers, if it has no visible label. */
    label?: string;
    class?: string;
  }

  let {
    value = $bindable(),
    parse,
    format = String,
    hint,
    label,
    class: className,
  }: Props = $props();

  // Follows the bound value, but can be overwritten while the user is typing.
  let text = $derived(format(value));
  const invalid = $derived(parse(text) === undefined);

  function onchange() {
    value = parse(text) ?? value;
    // Normalize the input and discard invalid entries.
    text = format(value);
  }
</script>

<input
  class={['number-input', className, { invalid }]}
  type="text"
  inputmode="decimal"
  size="3"
  title={hint}
  aria-label={label}
  aria-invalid={invalid}
  bind:value={text}
  {onchange}
/>
