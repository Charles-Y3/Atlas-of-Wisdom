import { COLLECTIONS } from '../../data/collections';
import { LOCATIONS, LOCATION_BY_ID } from '../../data/locations';
import { VIRTUES } from '../../data/virtues';
import type { Localized, Locale } from '../../i18n/types';
import { L } from '../../i18n/L';
import { rankForXp } from '../../engine/progression';
import { virtueCounts } from '../../state/store';

function resolve(loc: Localized<string>, locale: Locale): string {
  return L(loc, locale);
}

/** Orthographic projection for passport globe art. */
function projectGlobe(
  lon: number,
  lat: number,
  cx: number,
  cy: number,
  r: number,
): { x: number; y: number; front: boolean } {
  const λ = (lon * Math.PI) / 180;
  const φ = (lat * Math.PI) / 180;
  // Center on Africa/Eurasia for a familiar atlas face.
  const λ0 = (40 * Math.PI) / 180;
  const cosC = Math.sin(φ) * Math.sin(0) + Math.cos(φ) * Math.cos(0) * Math.cos(λ - λ0);
  // Front hemisphere relative to λ0, φ0=0
  const x = r * Math.cos(φ) * Math.sin(λ - λ0);
  const y = r * (Math.cos(0) * Math.sin(φ) - Math.sin(0) * Math.cos(φ) * Math.cos(λ - λ0));
  return { x: cx + x, y: cy - y, front: cosC > 0 };
}

function drawGlobe(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  visitedIds: string[],
): void {
  const ocean = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
  ocean.addColorStop(0, '#d9e4d0');
  ocean.addColorStop(0.55, '#c5d4b8');
  ocean.addColorStop(1, '#a8b89a');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = ocean;
  ctx.fill();

  // Soft land wash (stylized continents as blobs)
  ctx.fillStyle = 'rgba(176, 138, 60, 0.22)';
  for (const [lon, lat, rx, ry] of [
    [20, 20, 0.35, 0.28],
    [80, 35, 0.4, 0.22],
    [105, 30, 0.28, 0.2],
    [-90, 40, 0.32, 0.22],
    [-60, -15, 0.22, 0.3],
    [25, -20, 0.25, 0.28],
    [135, -25, 0.18, 0.14],
  ] as const) {
    const p = projectGlobe(lon, lat, cx, cy, r);
    if (!p.front) continue;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, r * rx, r * ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Latitude / longitude arcs
  ctx.strokeStyle = 'rgba(92, 74, 50, 0.28)';
  ctx.lineWidth = 1;
  for (const lat of [-45, 0, 45]) {
    ctx.beginPath();
    let started = false;
    for (let lon = -180; lon <= 180; lon += 4) {
      const p = projectGlobe(lon, lat, cx, cy, r);
      if (!p.front) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
  for (const lon of [-90, 0, 90]) {
    ctx.beginPath();
    let started = false;
    for (let lat = -80; lat <= 80; lat += 4) {
      const p = projectGlobe(lon, lat, cx, cy, r);
      if (!p.front) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#b08a3c';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Visited places as gold dots
  for (const id of visitedIds) {
    const loc = LOCATION_BY_ID[id];
    if (!loc) continue;
    const [lon, lat] = loc.coords;
    const p = projectGlobe(lon, lat, cx, cy, r);
    if (!p.front) continue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#b08a3c';
    ctx.fill();
    ctx.strokeStyle = '#fffdf6';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/**
 * Draw a shareable explorer passport to canvas and trigger a PNG download.
 * Fully client-side — works offline.
 */
export function exportPassportPng(
  progress: {
    xp: number;
    streak: { count: number };
    read: Record<string, true>;
    visited: Record<string, string>;
    completedCollections: string[];
  },
  locale: Locale,
  appName: string,
): void {
  const rank = rankForXp(progress.xp);
  const counts = virtueCounts(progress.read);
  const topCollectionId = progress.completedCollections[progress.completedCollections.length - 1];
  const topCollection = COLLECTIONS.find((c) => c.id === topCollectionId);

  const W = 720;
  const H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f6f0e2');
  bg.addColorStop(0.5, '#efe4cc');
  bg.addColorStop(1, '#e8d9b8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#b08a3c';
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.fillStyle = '#2b2416';
  ctx.textAlign = 'center';
  ctx.font = '700 36px Cinzel, "Noto Serif SC", serif';
  ctx.fillText(appName, W / 2, 90);

  ctx.font = '28px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.fillText(rank.emoji, W / 2, 140);

  ctx.font = '700 28px Cinzel, "Noto Serif SC", serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText(resolve(rank.name, locale), W / 2, 178);

  ctx.font = '16px "Noto Serif", "Noto Serif SC", serif';
  ctx.fillStyle = '#5c4a32';
  ctx.fillText(`${progress.xp} XP · ${progress.streak.count} 🔥`, W / 2, 210);

  if (topCollection) {
    ctx.font = '15px "Noto Serif", "Noto Serif SC", serif';
    ctx.fillText(
      `${topCollection.emoji} ${resolve(topCollection.name, locale)}`,
      W / 2,
      238,
    );
  }

  drawGlobe(ctx, W / 2, 400, 118, Object.keys(progress.visited));

  const axes = VIRTUES.map((v) => {
    const total = LOCATIONS.filter((l) => l.virtues.includes(v.id)).length;
    const got = counts[v.id] ?? 0;
    return { v, ratio: total > 0 ? got / total : 0, got, total };
  });

  ctx.textAlign = 'left';
  ctx.font = '700 18px Cinzel, serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText('Virtue Compass', 80, 560);

  let y = 590;
  for (const { v, ratio, got, total } of axes) {
    ctx.font = '16px "Segoe UI Emoji", sans-serif';
    ctx.fillText(v.emoji, 80, y + 4);
    ctx.font = '14px "Noto Serif", "Noto Serif SC", serif';
    ctx.fillStyle = '#2b2416';
    ctx.fillText(resolve(v.name, locale), 110, y);
    ctx.fillStyle = '#e8dcc4';
    ctx.fillRect(300, y - 12, 320, 14);
    ctx.fillStyle = '#b08a3c';
    ctx.fillRect(300, y - 12, 320 * Math.max(ratio, 0.02), 14);
    ctx.fillStyle = '#5c4a32';
    ctx.font = '12px "Noto Serif", sans-serif';
    ctx.fillText(`${got}/${total}`, 630, y);
    y += 36;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#8a7a60';
  ctx.font = '13px "Noto Serif", serif';
  ctx.fillText(new Date().toISOString().slice(0, 10), W / 2, H - 60);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlas-passport-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
