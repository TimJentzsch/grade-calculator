<script lang="ts">
  import type { CurriculumDefinition } from '#lib/curricula/definition.ts';
  import { builtInCurricula } from '#lib/curricula/index.ts';
  import { getI18n } from '#lib/i18n/index.ts';
  import Button from './Button.svelte';

  interface Props {
    /** Whether a Notenspiegel is currently being imported. */
    importing: boolean;
    onImport: (file: File) => void;
    onChoose: (definition: CurriculumDefinition) => void;
    /** Starts creating a custom curriculum. */
    onCustom?: () => void;
    onLoad: () => void;
  }

  const { importing, onImport, onChoose, onCustom, onLoad }: Props = $props();

  const i18n = getI18n();
  const t = $derived(i18n.t);

  let fileInput: HTMLInputElement | undefined = $state();

  /** Whether a file is dragged over the drop zone. */
  let dragging = $state(false);

  function onchange(event: Event & { currentTarget: HTMLInputElement }) {
    const file = event.currentTarget.files?.[0];
    // Allows selecting the same file again
    event.currentTarget.value = '';
    if (file) {
      onImport(file);
    }
  }

  function ondragover(event: DragEvent) {
    event.preventDefault();
    dragging = true;
  }

  function ondrop(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && !importing) {
      onImport(file);
    }
  }
</script>

<div class="start">
  <section
    class={['drop-zone', { dragging }]}
    aria-labelledby="upload-heading"
    {ondragover}
    ondragleave={() => (dragging = false)}
    {ondrop}
  >
    <h2 id="upload-heading">{t.start.title}</h2>
    <p>{t.start.description}</p>
    <div class="drop-actions">
      <Button onclick={() => fileInput?.click()} disabled={importing}
        >{importing ? t.toolbar.importing : t.start.chooseFile}</Button
      >
      <span class="drop-hint">{t.start.dropHint}</span>
    </div>
    <p class="privacy">{t.start.privacy}</p>
    <input
      bind:this={fileInput}
      type="file"
      accept=".pdf,application/pdf"
      name="notenspiegelInput"
      hidden
      {onchange}
    />
  </section>

  <section class="manual" aria-labelledby="manual-heading">
    <h2 id="manual-heading">{t.start.manualTitle}</h2>
    <div class="manual-group" role="group" aria-labelledby="curricula-label">
      <span id="curricula-label" class="manual-label">{t.start.chooseCurriculum}</span>
      <div class="manual-buttons">
        {#each builtInCurricula as definition (definition.id)}
          <Button
            variant="secondary"
            title={t.start.chooseTitle(definition.name)}
            onclick={() => onChoose(definition)}>{definition.name}</Button
          >
        {/each}
      </div>
    </div>
    <div class="manual-group" role="group" aria-labelledby="other-label">
      <span id="other-label" class="manual-label">{t.start.otherOptions}</span>
      <div class="manual-buttons">
        {#if onCustom}
          <Button variant="secondary" title={t.start.customTitle} onclick={onCustom}
            >{t.start.custom}</Button
          >
        {/if}
        <Button variant="secondary" title={t.toolbar.loadTitle} onclick={onLoad}
          >{t.toolbar.load}</Button
        >
      </div>
    </div>
  </section>
</div>

<style>
  .start {
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    margin: var(--space-xl) 0;
  }

  section {
    padding: var(--space-xl);
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-raised);
  }

  h2 {
    margin: 0 0 var(--space-sm);
    color: var(--color-heading);
    font-size: var(--font-size-xl);
  }

  .drop-zone {
    border: 2px dashed var(--color-border-strong);
    text-align: center;
  }

  .drop-zone.dragging {
    border-color: var(--color-primary);
    background-color: var(--color-surface-raised);
  }

  .drop-zone p {
    max-width: 40rem;
    margin: var(--space-sm) auto;
  }

  .drop-actions {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    margin: var(--space-lg) 0;
  }

  .drop-hint,
  .privacy {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }

  .manual {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .manual h2 {
    font-size: var(--font-size-lg);
  }

  .manual-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .manual-label {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .manual-buttons {
    display: flex;
    flex-flow: row wrap;
    gap: var(--space-sm);
  }
</style>
