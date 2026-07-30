import { COLLECTIONS } from '../../data/collections';
import { LOCATIONS } from '../../data/locations';
import { VIRTUES } from '../../data/virtues';
import type { Localized, Locale } from '../../i18n/types';
import { L } from '../../i18n/L';
import { rankForXp } from '../../engine/progression';
import { virtueCounts } from '../../state/store';
import type { Reflection, VirtuePractice } from '../../state/store';
import { capturePassportGlobe } from './capturePassportGlobe';

function resolve(loc: Localized<string>, locale: Locale): string {
  return L(loc, locale);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image load failed'));
    img.src = src;
  });
}

/** Fallback parchment sphere if MapLibre capture fails. */
function drawFallbackGlobe(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  const ocean = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
  ocean.addColorStop(0, '#d9e4d0');
  ocean.addColorStop(1, '#a8b89a');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = ocean;
  ctx.fill();
}

/**
 * Draw a shareable explorer passport to canvas and trigger a PNG download.
 * Globe uses the online MapLibre style when reachable.
 */
export async function exportPassportPng(
  progress: {
    xp: number;
    streak: { count: number };
    visited: Record<string, string>;
    reflections: Record<string, Reflection>;
    practices: Record<string, VirtuePractice>;
    completedCollections: string[];
  },
  locale: Locale,
  appName: string,
): Promise<void> {
  const rank = rankForXp(progress.xp);
  const counts = virtueCounts(progress.reflections, progress.practices);
  const topCollectionId = progress.completedCollections[progress.completedCollections.length - 1];
  const topCollection = COLLECTIONS.find((c) => c.id === topCollectionId);

  const globeUrl = await capturePassportGlobe(Object.keys(progress.visited));
  let globeImg: HTMLImageElement | null = null;
  if (globeUrl) {
    try {
      globeImg = await loadImage(globeUrl);
    } catch {
      globeImg = null;
    }
  }

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

  const gx = W / 2;
  const gy = 415;
  const gr = 168;
  ctx.save();
  ctx.beginPath();
  ctx.arc(gx, gy, gr, 0, Math.PI * 2);
  ctx.clip();
  if (globeImg) {
    ctx.drawImage(globeImg, gx - gr, gy - gr, gr * 2, gr * 2);
  } else {
    drawFallbackGlobe(ctx, gx, gy, gr);
  }
  ctx.restore();

  const axes = VIRTUES.map((v) => {
    const total = LOCATIONS.filter((l) => l.virtues.includes(v.id)).length;
    const got = counts[v.id] ?? 0;
    return { v, ratio: total > 0 ? got / total : 0, got, total };
  });

  ctx.textAlign = 'left';
  ctx.font = '700 18px Cinzel, serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText('Virtue Compass', 80, 620);

  let y = 650;
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

  await new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `atlas-passport-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}
