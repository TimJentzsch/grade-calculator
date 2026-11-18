<script lang="ts">
  import { formatGrade, MAX_GRADE, MIN_GRADE, parseGrade } from '#lib/grade.ts';

  interface Props {
    /** The entered grade, `undefined` for "TBD". */
    value: number | undefined;
    /** Whether an empty input is allowed, meaning "TBD" for modules without a grade yet. */
    allowTBD?: boolean;
    disabled?: boolean;
    class?: string;
  }

  let {
    value = $bindable(),
    allowTBD = false,
    disabled = false,
    class: className,
  }: Props = $props();

  const hint = `Enter a grade between ${MIN_GRADE.toFixed(1)} and ${MAX_GRADE.toFixed(1)}`;

  function format(grade: number | undefined): string {
    return grade === undefined ? '' : formatGrade(grade);
  }

  /** Parses the input, returning `null` if it is invalid. */
  function parse(input: string): number | undefined | null {
    if (allowTBD && input.trim() === '') {
      return undefined;
    }
    return parseGrade(input) ?? null;
  }

  // Follows the bound value, but can be overwritten while the user is typing.
  let text = $derived(format(value));
  const invalid = $derived(parse(text) === null);

  function onchange() {
    const parsed = parse(text);
    if (parsed !== null) {
      value = parsed;
    }
    // Normalize the input and discard invalid entries.
    text = format(value);
  }
</script>

<input
  class={['grade-input', className, { invalid }]}
  type="text"
  inputmode="decimal"
  name="grade-input"
  size="4"
  placeholder={allowTBD ? 'TBD' : undefined}
  title={hint}
  aria-invalid={invalid}
  {disabled}
  bind:value={text}
  {onchange}
/>
