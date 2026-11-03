// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Astro 7 changed the default to 'jsx' (JSX-style whitespace collapsing between elements);
  // keep the Astro 6 behaviour so text separated by inline elements keeps its spaces.
  compressHTML: true,
  vite: {
    plugins: [tailwindcss()],
  },
});
