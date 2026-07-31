import { ACHIEVEMENTS } from '../../data/achievements';
import { COLLECTIONS } from '../../data/collections';
import { LOCATIONS } from '../../data/locations';
import { VIRTUES } from '../../data/virtues';
import type { Localized, Locale } from '../../i18n/types';
import { L } from '../../i18n/L';
import { t } from '../../i18n/strings';
import { rankForXp, xpUnlocks } from '../../engine/progression';
import { statsOf, virtueCounts } from '../../state/store';
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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawVirtueCompass(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  ratios: number[],
): void {
  const n = ratios.length;

  ctx.beginPath();
  ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 253, 246, 0.75)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(176, 138, 60, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  for (const f of [0.25, 0.5, 0.75, 1]) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius * f, 0, Math.PI * 2);
    ctx.strokeStyle = f === 1 ? 'rgba(107, 79, 42, 0.8)' : 'rgba(176, 138, 60, 0.55)';
    ctx.lineWidth = f === 1 ? 2.25 : 1.25;
    ctx.stroke();
  }

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = 'rgba(107, 79, 42, 0.4)';
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }

  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    // Keep a visible seed when empty so the chart never collapses to a speck.
    const r = Math.max(ratios[i], 0.08) * radius;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  const any = ratios.some((r) => r > 0);
  ctx.fillStyle = any ? 'rgba(176, 138, 60, 0.45)' : 'rgba(176, 138, 60, 0.12)';
  ctx.fill();
  ctx.strokeStyle = '#6b4f2a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '17px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * (radius + 22);
    const y = cy + Math.sin(angle) * (radius + 22);
    ctx.globalAlpha = ratios[i] > 0 ? 1 : 0.38;
    ctx.fillText(VIRTUES[i].emoji, x, y);
  }
  ctx.globalAlpha = 1;
  ctx.textBaseline = 'alphabetic';
}

/**
 * Dense single-page passport: brand mark top-left, centered identity,
 * full 9-virtue compass, stats + achievements that hold empty and full states.
 */
export async function exportPassportPng(
  progress: {
    xp: number;
    streak: { count: number; lastDay?: string | null };
    visited: Record<string, string>;
    read: Record<string, true>;
    reflections: Record<string, Reflection>;
    practices: Record<string, VirtuePractice>;
    completedCollections: string[];
    achievements: string[];
    discoveriesMade?: number;
    quizzesCompleted?: number;
    exploredLegends?: Record<string, string>;
    completedQuests?: string[];
    questProgress?: Record<string, { completedSteps: string[] }>;
  },
  locale: Locale,
  appName: string,
): Promise<void> {
  const rank = rankForXp(progress.xp);
  const cartographer = xpUnlocks(progress.xp, 'cartographerPassport');
  const counts = virtueCounts(progress.reflections, progress.practices);
  const stats = statsOf({
    visited: progress.visited,
    read: progress.read,
    reflections: progress.reflections,
    practices: progress.practices,
    completedCollections: progress.completedCollections,
    streak: { count: progress.streak.count, lastDay: progress.streak.lastDay ?? null },
    discoveriesMade: progress.discoveriesMade ?? 0,
    quizzesCompleted: progress.quizzesCompleted ?? 0,
    exploredLegends: progress.exploredLegends ?? {},
    completedQuests: progress.completedQuests ?? [],
    questProgress: progress.questProgress ?? {},
  });

  const unlockedAch = ACHIEVEMENTS.filter((a) => progress.achievements.includes(a.id));
  const virtueRows = VIRTUES.map((v) => {
    const total = LOCATIONS.filter((l) => l.virtues.includes(v.id)).length;
    const got = counts[v.id] ?? 0;
    return { v, got, total, ratio: total > 0 ? got / total : 0 };
  });
  const ratios = virtueRows.map((r) => r.ratio);

  const topCollectionId = progress.completedCollections[progress.completedCollections.length - 1];
  const topCollection = COLLECTIONS.find((c) => c.id === topCollectionId);

  let art: HTMLImageElement | null = null;
  try {
    art = await loadImage(`${import.meta.env.BASE_URL}icons/passport-art.png`);
  } catch {
    try {
      art = await loadImage(`${import.meta.env.BASE_URL}icons/icon-cutout.png`);
    } catch {
      art = null;
    }
  }

  const W = 720;
  const H = 1080;
  const M = 48;
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
    ctx.lineWidth = 12;
    ctx.strokeRect(14, 14, W - 28, H - 28);
    ctx.strokeStyle = '#b08a3c';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, W - 56, H - 56);
  } else {
    ctx.strokeStyle = '#b08a3c';
    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.lineWidth = 1.25;
    ctx.strokeRect(32, 32, W - 64, H - 64);
  }

  // ── Top band: icon left, identity centered ──────────────────────────
  const iconSize = 118;
  const iconX = M;
  const iconY = 52;
  if (art) {
    const scale = Math.min(iconSize / art.naturalWidth, iconSize / art.naturalHeight);
    const aw = art.naturalWidth * scale;
    const ah = art.naturalHeight * scale;
    ctx.drawImage(art, iconX + (iconSize - aw) / 2, iconY + (iconSize - ah) / 2, aw, ah);
  }

  // Centered title / rank / XP — avoid overlapping the left icon
  ctx.textAlign = 'center';
  ctx.fillStyle = '#2b2416';
  ctx.font = '700 28px Cinzel, "Noto Serif SC", serif';
  ctx.fillText(appName, W / 2, 78);

  ctx.font = '700 22px Cinzel, "Noto Serif SC", "Segoe UI Emoji", serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText(`${rank.emoji} ${resolve(rank.name, locale)}`, W / 2, 110);

  ctx.font = '13px "Noto Serif", "Noto Serif SC", serif';
  const chip = `${progress.xp} XP · ${progress.streak.count} 🔥`;
  const chipW = Math.max(132, ctx.measureText(chip).width + 26);
  roundRect(ctx, (W - chipW) / 2, 122, chipW, 24, 12);
  ctx.fillStyle = 'rgba(176, 138, 60, 0.16)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(138, 106, 42, 0.45)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#5c4a32';
  ctx.fillText(chip, W / 2, 139);

  // Blurb under header band (full width, below icon)
  const headerBottom = Math.max(iconY + iconSize, 156) + 12;
  ctx.font = '13.5px "Noto Serif", "Noto Serif SC", "Noto Serif TC", serif';
  ctx.fillStyle = '#5c4a32';
  const blurbLines = wrapLines(ctx, resolve(rank.blurb, locale), W - M * 2);
  let y = headerBottom;
  for (const line of blurbLines.slice(0, 2)) {
    ctx.fillText(line, W / 2, y);
    y += 18;
  }

  // Push compass down so the page is not top-heavy
  y += 28;

  // ── Centered Virtue Compass + all 9 stats ──────────────────────────
  ctx.font = '700 16px Cinzel, "Noto Serif SC", serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText(t('compassTitle', locale), W / 2, y);
  y += 18;

  const compassR = 110;
  const compassCy = y + compassR + 26;
  drawVirtueCompass(ctx, W / 2, compassCy, compassR, ratios);

  // All 9 virtues in a 3×3 grid under the radar
  const gridTop = compassCy + compassR + 36;
  const gridW = W - M * 2;
  const gCols = 3;
  const gRows = 3;
  const gCellW = gridW / gCols;
  const gCellH = 36;
  const gridH = gRows * gCellH + 8;

  roundRect(ctx, M, gridTop - 6, gridW, gridH, 12);
  ctx.fillStyle = 'rgba(255, 253, 246, 0.55)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(176, 138, 60, 0.4)';
  ctx.lineWidth = 1.25;
  ctx.stroke();

  virtueRows.forEach((row, i) => {
    const c = i % gCols;
    const r = Math.floor(i / gCols);
    const cx = M + gCellW * c + 14;
    const cy = gridTop + 10 + gCellH * r + 14;
    const dim = row.got === 0;
    ctx.globalAlpha = dim ? 0.45 : 1;
    ctx.textAlign = 'left';
    ctx.font = '15px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText(row.v.emoji, cx, cy);
    ctx.font = '12px "Noto Serif", "Noto Serif SC", "Noto Serif TC", serif';
    ctx.fillStyle = '#2b2416';
    const name = resolve(row.v.name, locale);
    const nameMax = gCellW - 78;
    let shown = name;
    while (ctx.measureText(shown).width > nameMax && shown.length > 1) {
      shown = `${shown.slice(0, -2)}…`;
    }
    ctx.fillText(shown, cx + 22, cy);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#6b5f49';
    ctx.fillText(`${row.got}/${row.total}`, M + gCellW * (c + 1) - 12, cy);
    ctx.globalAlpha = 1;
  });

  y = gridTop + gridH + 22;

  // ── Stats strip ────────────────────────────────────────────────────
  const statH = 72;
  roundRect(ctx, M, y, W - M * 2, statH, 12);
  ctx.fillStyle = 'rgba(255, 253, 246, 0.72)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(176, 138, 60, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const statItems = [
    { label: t('profileStatPlaces', locale), value: stats.placesExplored },
    { label: t('profileStatStories', locale), value: stats.storiesRead },
    { label: t('profileStatCollections', locale), value: stats.collectionsCompleted },
    { label: t('profileStatContinents', locale), value: stats.continentsReached },
  ];
  const cellW = (W - M * 2) / 4;
  for (let i = 0; i < 4; i++) {
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(M + cellW * i, y + 12);
      ctx.lineTo(M + cellW * i, y + statH - 12);
      ctx.strokeStyle = 'rgba(176, 138, 60, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    const cx = M + cellW * i + cellW / 2;
    ctx.textAlign = 'center';
    ctx.font = '700 30px Cinzel, serif';
    ctx.fillStyle = '#2b2416';
    ctx.fillText(String(statItems[i].value), cx, y + 34);
    ctx.font = '11px "Noto Serif", "Noto Serif SC", "Noto Serif TC", serif';
    ctx.fillStyle = '#6b5f49';
    const labs = wrapLines(ctx, statItems[i].label, cellW - 14);
    ctx.fillText(labs[0] ?? '', cx, y + 54);
  }
  y += statH + 18;

  // ── Achievements: fixed panel height (empty and full both fill it) ─
  ctx.textAlign = 'center';
  ctx.font = '700 15px Cinzel, "Noto Serif SC", serif';
  ctx.fillStyle = '#6b4f2a';
  ctx.fillText(t('profileAchievements', locale), W / 2, y);
  y += 12;

  const ribbonH = 36;
  const footerGap = 18;
  const ribbonY = H - 52 - ribbonH;
  const achPanelTop = y;
  const achH = Math.max(120, ribbonY - footerGap - achPanelTop);

  roundRect(ctx, M, achPanelTop, W - M * 2, achH, 12);
  ctx.fillStyle = 'rgba(255, 253, 246, 0.55)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(176, 138, 60, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const cols = 4;
  const rows = 3;
  const maxShow = cols * rows; // 12 — densest readable grid in the panel
  const shown = unlockedAch.slice(0, maxShow);
  const cellWw = (W - M * 2) / cols;
  const cellHh = (achH - 16) / rows;

  if (shown.length === 0) {
    // Empty state: dashed ghost slots so the panel still reads as a grid
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(176, 138, 60, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < maxShow; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const sx = M + 10 + cellWw * c;
      const sy = achPanelTop + 10 + cellHh * r;
      roundRect(ctx, sx + 6, sy + 6, cellWw - 20, cellHh - 16, 8);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.font = '13px "Noto Serif", "Noto Serif SC", "Noto Serif TC", serif';
    ctx.fillStyle = '#8a7a60';
    ctx.textAlign = 'center';
    ctx.fillText(t('passportAchievementsEmpty', locale), W / 2, achPanelTop + achH / 2 + 4);
  } else {
    shown.forEach((a, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const cx = M + cellWw * c + cellWw / 2;
      const cy = achPanelTop + 12 + cellHh * r + cellHh / 2;
      ctx.font = '24px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(a.emoji, cx, cy - 8);
      ctx.font = '11px "Noto Serif", "Noto Serif SC", "Noto Serif TC", serif';
      ctx.fillStyle = '#5c4a32';
      const nm = resolve(a.name, locale);
      const clipped = wrapLines(ctx, nm, cellWw - 14)[0] ?? '';
      ctx.fillText(clipped, cx, cy + 14);
    });
    // Ghost remaining slots when partially filled — keeps density stable
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(176, 138, 60, 0.22)';
    for (let i = shown.length; i < maxShow; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const sx = M + 10 + cellWw * c;
      const sy = achPanelTop + 10 + cellHh * r;
      roundRect(ctx, sx + 6, sy + 6, cellWw - 20, cellHh - 16, 8);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  if (unlockedAch.length > maxShow) {
    ctx.font = '12px "Noto Serif", "Noto Serif SC", serif';
    ctx.fillStyle = '#8a7a60';
    ctx.textAlign = 'center';
    ctx.fillText(
      t('passportMoreAchievements', locale).replace('{n}', String(unlockedAch.length - maxShow)),
      W / 2,
      achPanelTop + achH - 10,
    );
  }

  // ── Footer ribbon ──────────────────────────────────────────────────
  roundRect(ctx, M, ribbonY, W - M * 2, ribbonH, 10);
  ctx.fillStyle = 'rgba(176, 138, 60, 0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(138, 106, 42, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const ribbonBits: string[] = [];
  if (topCollection) {
    ribbonBits.push(`${topCollection.emoji} ${resolve(topCollection.name, locale)}`);
  }
  ribbonBits.push(t('passportRibbonQuests', locale).replace('{n}', String(stats.questsCompleted)));
  ribbonBits.push(t('passportRibbonLegends', locale).replace('{n}', String(stats.legendsExplored)));

  ctx.font = '12px "Noto Serif", "Noto Serif SC", "Noto Serif TC", serif';
  ctx.fillStyle = '#5c4a32';
  ctx.textAlign = 'left';
  let ribbonText = ribbonBits.join('  ·  ');
  const maxRibbon = W - M * 2 - 110;
  while (ctx.measureText(ribbonText).width > maxRibbon && ribbonText.length > 8) {
    ribbonText = `${ribbonText.slice(0, -2)}…`;
  }
  ctx.fillText(ribbonText, M + 14, ribbonY + 23);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#8a7a60';
  ctx.fillText(new Date().toISOString().slice(0, 10), W - M - 14, ribbonY + 23);

  await new Promise<void>((resolveDone) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolveDone();
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `atlas-passport-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
      resolveDone();
    }, 'image/png');
  });
}
