<script lang="ts">
  import { formatGrade, MAX_GRADE, MIN_GRADE, parseGrade } from '#lib/grade.ts';
  import { getI18n } from '#lib/i18n/index.ts';

  interface Props {
    /** The entered grade, `undefined` for "TBD". */
    value: number | undefined;
    /** Whether an empty input is allowed, meaning "TBD" for modules without a grade yet. */
    allowTBD?: boolean;
    disabled?: boolean;
    /** Shown while no grade is entered, "TBD" by default if `allowTBD` is set. */
    placeholder?: string;
    /** Describes the input for screen readers, if it has no visible label. */
    label?: string;
    class?: string;
  }

  const i18n = getI18n();
  const t = $derived(i18n.t);

  let {
    value = $bindable(),
    allowTBD = false,
    disabled = false,
    placeholder,
    label,
    class: className,
  }: Props = $props();

  const hint = $derived(t.grade.hint(MIN_GRADE.toFixed(1), MAX_GRADE.toFixed(1)));

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
  placeholder={placeholder ?? (allowTBD ? t.grade.tbd : undefined)}
  title={hint}
  aria-label={label}
  aria-invalid={invalid}
  {disabled}
  bind:value={text}
  {onchange}
/>
