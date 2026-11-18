import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const styleSource = fileURLToPath(new URL('../../packages/styles/src/', import.meta.url));

export default defineConfig({
  site: process.env.ASTRO_SITE || undefined,
  base: process.env.ASTRO_BASE || '/',
  devToolbar: { enabled: false },
  vite: {
    plugins: [
      {
        name: 'luminedge-styles-source',
        apply: 'serve',
        config: () => ({
          resolve: {
            alias: [{ find: /^@luminedge\/styles\//, replacement: styleSource }],
          },
        }),
      },
      tailwindcss(),
    ],
  },
});
