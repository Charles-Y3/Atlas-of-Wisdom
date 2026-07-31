import { COLLECTIONS } from '../../data/collections';
import { LOCATIONS } from '../../data/locations';
import { VIRTUES } from '../../data/virtues';
import type { Localized, Locale } from '../../i18n/types';
import { L } from '../../i18n/L';
import { rankForXp, xpUnlocks } from '../../engine/progression';
import { virtueCounts } from '../../state/store';
import type { Reflection, VirtuePractice } from '../../state/store';

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

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  const lines: string[] = [];
  const hasCjk = /[\u4e00-\u9fff]/.test(text);
  if (!hasCjk && /\s/.test(text)) {
    let line = '';
    for (const word of text.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }
  let line = '';
  for (const ch of text) {
    const test = line + ch;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Draw a shareable explorer passport to canvas and trigger a PNG download.
 * Center art uses the app icon.
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
  const cartographer = xpUnlocks(progress.xp, 'cartographerPassport');
  const counts = virtueCounts(progress.reflections, progress.practices);
  const topCollectionId = progress.completedCollections[progress.completedCollections.length - 1];
  const topCollection = COLLECTIONS.find((c) => c.id === topCollectionId);

  let iconImg: HTMLImageElement | null = null;
  try {
    iconImg = await loadImage(`${import.meta.env.BASE_URL}icons/icon-512.png`);
  } catch {
    try {
      iconImg = await loadImage(`${import.meta.env.BASE_URL}icons/icon.png`);
    } catch {
      iconImg = null;
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

  if (cartographer) {
    ctx.strokeStyle = '#6b4f2a';
    ctx.lineWidth = 14;
    ctx.strokeRect(18, 18, W - 36, H - 36);
    ctx.strokeStyle = '#b08a3c';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, W - 64, H - 64);
    ctx.strokeStyle = '#8a6a2a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(44, 44, W - 88, H - 88);
    const mark = (x: number, y: number, sx: number, sy: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + 28 * sy);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 28 * sx, y);
      ctx.strokeStyle = '#8a6a2a';
      ctx.lineWidth = 3;
      ctx.stroke();
    };
    mark(48, 48, 1, 1);
    mark(W - 48, 48, -1, 1);
    mark(48, H - 48, 1, -1);
    mark(W - 48, H - 48, -1, -1);
  } else {
    ctx.strokeStyle = '#b08a3c';
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, W - 72, H - 72);
  }

  ctx.fillStyle = '#2b2416';
  ctx.textAlign = 'center';
  ctx.font = '700 36px Cinzel, "Noto Serif SC", serif';
  ctx.fillText(appName, W / 2, 90);

  ctx.font = '28px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.fillText(rank.emoji, W / 2, 140);

  ctx.font = '700 28px Cinzel, "Noto Serif SC", serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText(resolve(rank.name, locale), W / 2, 178);

  // Same rank blurb as the rank-ladder detail popup.
  ctx.font = '15px "Noto Serif", "Noto Serif SC", "Noto Serif TC", serif';
  ctx.fillStyle = '#5c4a32';
  const blurbLines = wrapLines(ctx, resolve(rank.blurb, locale), W - 120);
  let y = 204;
  for (const line of blurbLines.slice(0, 4)) {
    ctx.fillText(line, W / 2, y);
    y += 22;
  }
  y += 10;

  ctx.font = '16px "Noto Serif", "Noto Serif SC", serif';
  ctx.fillStyle = '#5c4a32';
  ctx.fillText(`${progress.xp} XP · ${progress.streak.count} 🔥`, W / 2, y);
  y += 28;

  if (topCollection) {
    ctx.font = '15px "Noto Serif", "Noto Serif SC", serif';
    ctx.fillText(
      `${topCollection.emoji} ${resolve(topCollection.name, locale)}`,
      W / 2,
      y,
    );
    y += 24;
  }

  const iconSize = 300;
  const iconTop = Math.min(y + 12, 360);
  const iconLeft = (W - iconSize) / 2;
  if (iconImg) {
    const r = 36;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(iconLeft + r, iconTop);
    ctx.arcTo(iconLeft + iconSize, iconTop, iconLeft + iconSize, iconTop + iconSize, r);
    ctx.arcTo(iconLeft + iconSize, iconTop + iconSize, iconLeft, iconTop + iconSize, r);
    ctx.arcTo(iconLeft, iconTop + iconSize, iconLeft, iconTop, r);
    ctx.arcTo(iconLeft, iconTop, iconLeft + iconSize, iconTop, r);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(iconImg, iconLeft, iconTop, iconSize, iconSize);
    ctx.restore();
  }

  const axes = VIRTUES.map((v) => {
    const total = LOCATIONS.filter((l) => l.virtues.includes(v.id)).length;
    const got = counts[v.id] ?? 0;
    return { v, ratio: total > 0 ? got / total : 0, got, total };
  });

  const compassTop = Math.max(iconTop + iconSize + 28, 620);
  ctx.textAlign = 'left';
  ctx.font = '700 18px Cinzel, serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText('Virtue Compass', 80, compassTop);

  let rowY = compassTop + 30;
  const rowStep = Math.min(36, (H - 80 - rowY) / axes.length);
  for (const { v, ratio, got, total } of axes) {
    ctx.font = '16px "Segoe UI Emoji", sans-serif';
    ctx.fillText(v.emoji, 80, rowY + 4);
    ctx.font = '14px "Noto Serif", "Noto Serif SC", serif';
    ctx.fillStyle = '#2b2416';
    ctx.fillText(resolve(v.name, locale), 110, rowY);
    ctx.fillStyle = '#e8dcc4';
    ctx.fillRect(300, rowY - 12, 320, 14);
    ctx.fillStyle = '#b08a3c';
    ctx.fillRect(300, rowY - 12, 320 * Math.max(ratio, 0.02), 14);
    ctx.fillStyle = '#5c4a32';
    ctx.font = '12px "Noto Serif", sans-serif';
    ctx.fillText(`${got}/${total}`, 630, rowY);
    rowY += rowStep;
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
