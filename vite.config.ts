import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

const base = process.env.BASE_PATH ?? '';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ pages: 'build', assets: 'build' }),
      paths: {
        base: base === '' ? '' : (base as `/${string}`),
      },
      csp: {
        mode: 'hash',
        directives: {
          'default-src': ['self'],
          'script-src': ['self'],
          'style-src': ['self', 'unsafe-inline'],
          'img-src': ['self'],
          'object-src': ['none'],
          'base-uri': ['self'],
          'form-action': ['none'],
        },
      },
    }),
  ],
  worker: {
    format: 'es',
    // Workers are bundled separately, so they need the Svelte plugin to compile runes in `.svelte.ts` modules
    plugins: () => [svelte()],
  },
  test: {
    include: ['src/**/*.test.ts'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
});
