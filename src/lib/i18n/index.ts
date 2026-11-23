import { getContext, setContext } from 'svelte';
import de from './de.ts';
import en from './en.ts';

export type { AreaKind } from './de.ts';

/** The languages of the app. Each one is prerendered as its own page. */
export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

/** Served at the root, the other languages get a path prefix like `/en`. */
export const defaultLocale: Locale = 'de';

export type Messages = typeof de;

const messages: Record<Locale, Messages> = { de, en };

/** The published site, used for canonical and alternate links. */
export const SITE_URL = 'https://timjentzsch.github.io/grade-calculator';

export function isLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? '');
}

/** The path of the page in the given language, relative to the site root, e.g. `/en`. */
export function localePath(locale: Locale): string {
  // GitHub Pages redirects the root of the site to the path with a trailing slash
  return locale === defaultLocale ? '/' : `/${locale}`;
}

/** The current language and its texts. */
export interface I18n {
  readonly locale: Locale;
  readonly t: Messages;
}

const key = Symbol('i18n');

/**
 * Provides the language to all child components.
 * @param getLocale Returns the current language, so that it can change on navigation.
 */
export function setI18n(getLocale: () => Locale): I18n {
  return setContext(key, {
    get locale() {
      return getLocale();
    },
    get t() {
      return messages[getLocale()];
    },
  });
}

/** The current language. Falls back to the default language, e.g. in component tests. */
export function getI18n(): I18n {
  return getContext<I18n | undefined>(key) ?? { locale: defaultLocale, t: messages[defaultLocale] };
}

/**
 * The context that provides a language, e.g. to render a component in a test:
 * `render(Component, { props, context: i18nContext('en') })`.
 */
export function i18nContext(locale: Locale): Map<symbol, I18n> {
  return new Map([[key, { locale, t: messages[locale] }]]);
}

/** The texts of a language outside of components. */
export function messagesFor(locale: Locale): Messages {
  return messages[locale];
}
