import { defaultLocale, type Locale } from '#lib/i18n/index.ts';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = ({ params }) => {
  const locale: Locale = params.lang ?? defaultLocale;
  return { locale };
};
