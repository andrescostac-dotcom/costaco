import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://costaco.life',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  // Scripts incrustados en cada página: más rápido y funciona en cualquier visor.
  vite: { build: { assetsInlineLimit: 200000 } },
});
