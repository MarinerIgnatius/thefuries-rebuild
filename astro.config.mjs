import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://www.thefuries1986.com',
  output: 'static',
  build: {
    // Cloudflare Pages — no trailing slashes
    format: 'directory',
  },
});
