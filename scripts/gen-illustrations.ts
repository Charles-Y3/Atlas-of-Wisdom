// Illustrations are AI parchment WebP plates under public/illustrations/.
// This script only reports coverage — it no longer generates SVG fallbacks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCATIONS } from '../src/data/locations';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/illustrations');

const missing: string[] = [];
for (const loc of LOCATIONS) {
  if (!fs.existsSync(path.join(outDir, `${loc.id}.webp`))) missing.push(loc.id);
}

if (missing.length) {
  console.error(`gen-illustrations: missing ${missing.length} WebP plate(s):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`gen-illustrations: OK — ${LOCATIONS.length} WebP plates present`);
