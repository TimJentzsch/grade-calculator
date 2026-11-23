<script lang="ts">
  import type { Snippet } from 'svelte';
  import { resolve } from '$app/paths';
  import {
    defaultLocale,
    locales,
    localePath,
    messagesFor,
    setI18n,
    SITE_URL,
    type Locale,
  } from '#lib/i18n/index.ts';
  import '../../app.css';
  import type { LayoutData } from './$types';

  const { data, children }: { data: LayoutData; children: Snippet } = $props();

  const i18n = setI18n(() => data.locale);
  const t = $derived(i18n.t);

  /** The name of each language in that language, so that it can be found without knowing the current one. */
  const languageNames: Record<Locale, string> = { de: 'Deutsch', en: 'English' };

  // Client-side navigation doesn't rerender the `<html>` element
  $effect(() => {
    document.documentElement.lang = data.locale;
  });
</script>

<svelte:head>
  <title>{t.meta.title}</title>
  <meta name="description" content={t.meta.description} />
  <link rel="canonical" href="{SITE_URL}{localePath(data.locale)}" />
  {#each locales as locale (locale)}
    <link rel="alternate" hreflang={locale} href="{SITE_URL}{localePath(locale)}" />
  {/each}
  <link rel="alternate" hreflang="x-default" href="{SITE_URL}{localePath(defaultLocale)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t.meta.title} />
  <meta property="og:description" content={t.meta.description} />
  <meta property="og:url" content="{SITE_URL}{localePath(data.locale)}" />
  <meta property="og:locale" content={t.meta.ogLocale} />
  {#each locales.filter((locale) => locale !== data.locale) as locale (locale)}
    <meta property="og:locale:alternate" content={messagesFor(locale).meta.ogLocale} />
  {/each}
</svelte:head>

<noscript id="js-error-container">{t.noscript}</noscript>

<header>
  <div id="header-content">
    <h1>{t.header.appName} <span class="title-university">{t.header.university}</span></h1>
    <nav class="header-links">
      <ul class="language-switcher" aria-label={t.header.languageLabel}>
        {#each locales as locale (locale)}
          <li>
            <a
              href={locale === defaultLocale
                ? resolve('/[[lang=locale]]', {})
                : resolve('/[[lang=locale]]', { lang: locale })}
              hreflang={locale}
              lang={locale}
              aria-current={locale === data.locale ? 'page' : undefined}>{languageNames[locale]}</a
            >
          </li>
        {/each}
      </ul>
      <a
        class="github-link"
        href="https://github.com/TimJentzsch/grade-calculator"
        title={t.header.githubTitle}
        aria-label={t.header.githubLabel}
      >
        <svg width="28" height="28" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </a>
    </nav>
  </div>
</header>

{@render children()}

<style>
  /* Only the app's purpose is highlighted, the university is secondary */
  .title-university {
    color: var(--color-text);
    font-weight: var(--font-weight-normal);
  }

  .header-links {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .language-switcher {
    display: flex;
    gap: var(--space-sm);
    list-style: none;
    font-size: var(--font-size-sm);
  }

  .language-switcher a {
    color: var(--color-text-muted);
    text-decoration: none;
  }

  .language-switcher a:hover {
    color: var(--color-text);
    text-decoration: underline;
  }

  .language-switcher a[aria-current='page'] {
    color: var(--color-text);
    font-weight: var(--font-weight-semibold);
  }
</style>
