// Astro integration: generates the Italian pages after every `astro build` (see src/i18n/build.mjs).
import { fileURLToPath } from 'node:url';
import { buildItalian } from './build.mjs';

export default function italianSite() {
  let root;
  return {
    name: 'iicc-italian-site',
    hooks: {
      'astro:config:done': ({ config }) => { root = fileURLToPath(config.root); },
      'astro:build:done': ({ dir, logger }) => { buildItalian(fileURLToPath(dir), root, logger); },
    },
  };
}
