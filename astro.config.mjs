import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://costaco.life',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
});
