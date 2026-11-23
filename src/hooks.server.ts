import { defaultLocale, isLocale } from '#lib/i18n/index.ts';
import type { Handle } from '@sveltejs/kit/hooks';

/** Sets the language of the prerendered page, e.g. `<html lang="en">`. */
export const handle: Handle = ({ event, resolve }) => {
  const lang = isLocale(event.params.lang) ? event.params.lang : defaultLocale;
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang),
  });
};
