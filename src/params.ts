import { defineParams } from '@sveltejs/kit/params';
import { defaultLocale, isLocale } from '#lib/i18n/index.ts';

export const params = defineParams({
  /** Only the other languages get a path prefix, the default language is served at the root. */
  locale: (param) => (isLocale(param) && param !== defaultLocale ? param : undefined),
});
