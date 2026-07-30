import { COLLECTIONS } from '../../data/collections';
import { LOCATIONS } from '../../data/locations';
import { VIRTUES } from '../../data/virtues';
import type { Localized, Locale } from '../../i18n/types';
import { L } from '../../i18n/L';
import { rankForXp } from '../../engine/progression';
import { virtueCounts } from '../../state/store';

function resolve(loc: Localized<string>, locale: Locale): string {
  return L(loc, locale);
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
  const H = 960;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Parchment background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f6f0e2');
  bg.addColorStop(0.5, '#efe4cc');
  bg.addColorStop(1, '#e8d9b8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = '#b08a3c';
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.fillStyle = '#2b2416';
  ctx.textAlign = 'center';
  ctx.font = '700 36px Cinzel, "Noto Serif SC", serif';
  ctx.fillText(appName, W / 2, 100);

  ctx.font = '28px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.fillText(rank.emoji, W / 2, 170);

  ctx.font = '700 28px Cinzel, "Noto Serif SC", serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText(resolve(rank.name, locale), W / 2, 210);

  ctx.font = '16px "Noto Serif", "Noto Serif SC", serif';
  ctx.fillStyle = '#5c4a32';
  ctx.fillText(`${progress.xp} XP · ${progress.streak.count} 🔥`, W / 2, 250);

  if (topCollection) {
    ctx.font = '15px "Noto Serif", "Noto Serif SC", serif';
    ctx.fillText(
      `${topCollection.emoji} ${resolve(topCollection.name, locale)}`,
      W / 2,
      285,
    );
  }

  // Virtue compass snapshot (simple bars)
  const axes = VIRTUES.map((v) => {
    const total = LOCATIONS.filter((l) => l.virtues.includes(v.id)).length;
    const got = counts[v.id] ?? 0;
    return { v, ratio: total > 0 ? got / total : 0, got, total };
  });

  ctx.textAlign = 'left';
  ctx.font = '700 18px Cinzel, serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText('Virtue Compass', 80, 340);

  let y = 370;
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
