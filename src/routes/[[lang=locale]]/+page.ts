import type { EntryGenerator } from './$types';

/** Prerenders every language, not only the ones that are linked. */
export const entries: EntryGenerator = () => [{}, { lang: 'en' }];
