// Build-time script: collects every Simplified Chinese string authored in
// the app's content/UI data, converts each to Traditional Chinese via
// opencc-js, and writes a flat lookup table consumed at runtime by
// src/i18n/L.ts. Run with `npm run gen:i18n` whenever content changes.
// Same architecture as Journey to Great Harmony.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as OpenCC from 'opencc-js';

import { LOCATIONS } from '../src/data/locations';
import { PEOPLE } from '../src/data/people';
import { COLLECTIONS } from '../src/data/collections';
import { ACHIEVEMENTS } from '../src/data/achievements';
import { CATEGORIES, TRADITIONS } from '../src/data/categories';
import { VIRTUES } from '../src/data/virtues';
import { LEGENDS } from '../src/data/legends';
import { LEGEND_COLLECTION } from '../src/data/legendCollection';
import { QUESTS } from '../src/data/quests';
import { LOCATION_TEACHINGS, PERSON_TEACHINGS } from '../src/data/teachings';
import { RANKS } from '../src/engine/progression';
import { UI } from '../src/i18n/strings';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const CJK = /[㐀-鿿豈-﫿]/;

/** Recursively collect every full string value that contains CJK text. */
function collect(value: unknown, out: Set<string>): void {
  if (typeof value === 'string') {
    if (CJK.test(value)) out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collect(v, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) collect(v, out);
  }
}

const found = new Set<string>();
for (const root_ of [
  LOCATIONS,
  PEOPLE,
  COLLECTIONS,
  ACHIEVEMENTS,
  CATEGORIES,
  TRADITIONS,
  VIRTUES,
  LEGENDS,
  LEGEND_COLLECTION,
  QUESTS,
  LOCATION_TEACHINGS,
  PERSON_TEACHINGS,
  RANKS,
  UI,
]) {
  collect(root_, found);
}

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
const map: Record<string, string> = {};
for (const s of found) {
  const converted = converter(s);
  if (converted !== s) map[s] = converted;
}

const outPath = path.join(root, 'src/i18n/zhHant.generated.json');
fs.writeFileSync(outPath, JSON.stringify(map), 'utf8');
console.log(
  `gen-zh-hant: wrote ${Object.keys(map).length} entries (of ${found.size} unique zh strings scanned) -> ${path.relative(root, outPath)}`,
);
