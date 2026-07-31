// Build-time script: generates a small offline shaded-relief raster tile
// pyramid from Natural Earth's public-domain "Natural Earth I with Shaded
// Relief and Water" raster, for a subtle terrain-texture background layer
// under the flat land tint (see offlineStyle.ts's `relief` source/layer).
//
// Natural Earth's raster is a single equirectangular (Plate Carrée) image —
// MapLibre raster tile sources are Web Mercator XYZ, so this reprojects it
// pixel-by-pixel into a small local {z}/{x}/{y}.jpg pyramid (no tile server,
// just static files under public/, same as everything else in public/geo/).
//
// Run with `npm run gen:relief`. Output is committed under public/geo/relief.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cacheDir = path.join(root, 'scripts/data/ne');
const outDir = path.join(root, 'public/geo/relief');

const RELIEF_ZIP_URL = 'https://naciscdn.org/naturalearth/50m/raster/NE1_50M_SR_W.zip';
const ZIP_ENTRY = 'NE1_50M_SR_W/NE1_50M_SR_W.tif';

// Source resolution used for reprojection sampling — 2x the pixel density
// of the highest tile zoom below, so nearest-neighbor sampling doesn't look
// obviously blocky. Full 10800x5400 source is far more than this subtle
// low-opacity background layer needs.
const SRC_WIDTH = 4096;
const SRC_HEIGHT = 2048;

// Tint toward the app's warm parchment/gold palette instead of the source's
// natural greens/blues — this is a background texture, not a physical map.
const TINT = { r: 168, g: 132, b: 82 };

const TILE_SIZE = 256;
const MAX_ZOOM = 3;

async function downloadReliefZip(): Promise<Buffer> {
  fs.mkdirSync(cacheDir, { recursive: true });
  const cachePath = path.join(cacheDir, 'relief.zip');
  if (!fs.existsSync(cachePath)) {
    console.log('gen-relief: downloading Natural Earth shaded relief (~85 MB)…');
    const res = await fetch(RELIEF_ZIP_URL);
    if (!res.ok) throw new Error(`Failed to download relief zip: ${res.status} ${res.statusText}`);
    fs.writeFileSync(cachePath, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(cachePath);
}

function tile2lon(xTileUnits: number, z: number): number {
  return (xTileUnits / 2 ** z) * 360 - 180;
}

function tile2lat(yTileUnits: number, z: number): number {
  const n = Math.PI - (2 * Math.PI * yTileUnits) / 2 ** z;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

async function main() {
  const zipBuf = await downloadReliefZip();
  const zip = new AdmZip(zipBuf);
  const entry = zip.getEntry(ZIP_ENTRY);
  if (!entry) throw new Error(`gen-relief: ${ZIP_ENTRY} not found in downloaded zip`);
  const tifBuf = entry.getData();

  console.log('gen-relief: decoding + resampling source raster…');
  const { data: src, info } = await sharp(tifBuf)
    .resize(SRC_WIDTH, SRC_HEIGHT, { fit: 'fill' })
    .greyscale()
    .tint(TINT)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const srcW = info.width;
  const srcH = info.height;

  const sampleSrc = (lon: number, lat: number): [number, number, number] => {
    const sx = Math.min(srcW - 1, Math.max(0, Math.round(((lon + 180) / 360) * srcW)));
    const sy = Math.min(srcH - 1, Math.max(0, Math.round(((90 - lat) / 180) * srcH)));
    const i = (sy * srcW + sx) * channels;
    return [src[i], src[i + 1], src[i + 2]];
  };

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  let tileCount = 0;
  for (let z = 0; z <= MAX_ZOOM; z++) {
    const n = 2 ** z;
    for (let tx = 0; tx < n; tx++) {
      for (let ty = 0; ty < n; ty++) {
        const tileBuf = Buffer.alloc(TILE_SIZE * TILE_SIZE * 3);
        for (let py = 0; py < TILE_SIZE; py++) {
          const yTileUnits = ty + py / TILE_SIZE;
          const lat = tile2lat(yTileUnits, z);
          for (let px = 0; px < TILE_SIZE; px++) {
            const xTileUnits = tx + px / TILE_SIZE;
            const lon = tile2lon(xTileUnits, z);
            const [r, g, b] = sampleSrc(lon, lat);
            const i = (py * TILE_SIZE + px) * 3;
            tileBuf[i] = r;
            tileBuf[i + 1] = g;
            tileBuf[i + 2] = b;
          }
        }
        const tileDir = path.join(outDir, String(z), String(tx));
        fs.mkdirSync(tileDir, { recursive: true });
        await sharp(tileBuf, { raw: { width: TILE_SIZE, height: TILE_SIZE, channels: 3 } })
          .jpeg({ quality: 62 })
          .toFile(path.join(tileDir, `${ty}.jpg`));
        tileCount++;
      }
    }
    console.log(`gen-relief: zoom ${z} done (${n * n} tiles)`);
  }

  let totalBytes = 0;
  const walk = (dir: string) => {
    for (const entryName of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entryName.name);
      if (entryName.isDirectory()) walk(p);
      else totalBytes += fs.statSync(p).size;
    }
  };
  walk(outDir);
  console.log(`gen-relief: ${tileCount} tiles written (${Math.round(totalBytes / 1024)} KB total)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
