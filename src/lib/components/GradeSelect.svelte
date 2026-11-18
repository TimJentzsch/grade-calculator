<script lang="ts">
  interface Props {
    /** The selected grade, `undefined` for "TBD". */
    value: number | undefined;
    /** Whether to offer a "TBD" option for modules without a grade yet. */
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

  const GRADES = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0];
  const TBD = 'TBD';

  function onchange(event: Event & { currentTarget: HTMLSelectElement }) {
    const selected = event.currentTarget.value;
    value = selected === TBD ? undefined : Number(selected);
  }
</script>

<select
  class={className}
  name="grade-selection"
  {disabled}
  value={value === undefined ? TBD : String(value)}
  {onchange}
>
  {#if allowTBD}
    <option class="select-option" value={TBD}>TBD</option>
  {/if}
  {#each GRADES as grade (grade)}
    <option class="select-option" value={String(grade)}>{grade.toFixed(1)}</option>
  {/each}
</select>
