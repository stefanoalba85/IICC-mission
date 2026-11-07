// Keeps every build except production out of search engines. Only `SITE_ENV=production npm run build`
// produces an indexable site, so a preview can never be published as indexable by mistake.
// Crawling stays allowed on purpose: a crawler blocked by robots.txt could not read the noindex tag,
// and pages already indexed would stay in the results.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TAG = '<meta name="robots" content="noindex, nofollow">';

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

export default function previewNoindex() {
  return {
    name: 'iicc-preview-noindex',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        if (process.env.SITE_ENV === 'production') {
          logger.info('production build: pages can be indexed');
          return;
        }
        const dist = fileURLToPath(dir);
        const files = htmlFiles(dist);
        for (const file of files) {
          const html = fs.readFileSync(file, 'utf8');
          if (!html.includes('</head>')) throw new Error(`no </head> in ${file}`);
          fs.writeFileSync(file, html.replace('</head>', `${TAG}</head>`));
        }
        fs.writeFileSync(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n');
        fs.rmSync(path.join(dist, 'sitemap.xml'), { force: true });
        logger.info(`preview build: noindex on ${files.length} pages, sitemap removed`);
      },
    },
  };
}
