import { localized } from '../i18n/types';
import type { Category, CategoryId, Tradition, TraditionId } from './types';

export const CATEGORIES: Category[] = [
  { id: 'temple', name: localized('Temples', '庙宇'), emoji: '⛩️', color: '#e2a54b' },
  { id: 'church', name: localized('Churches', '教堂'), emoji: '⛪', color: '#7fa8e0' },
  { id: 'mosque', name: localized('Mosques', '清真寺'), emoji: '🕌', color: '#63c2a0' },
  { id: 'monastery', name: localized('Monasteries', '修院'), emoji: '🏯', color: '#c98a6b' },
  { id: 'shrine', name: localized('Shrines', '神社圣祠'), emoji: '🏮', color: '#e07a7a' },
  { id: 'sacred-mountain', name: localized('Sacred mountains', '圣山'), emoji: '🏔️', color: '#9d8fd6' },
  { id: 'academy', name: localized('Historic academies', '书院学府'), emoji: '🏛️', color: '#d6c48f' },
  { id: 'university', name: localized('Ancient universities', '古代大学'), emoji: '🎓', color: '#8fc7d6' },
  { id: 'library', name: localized('Libraries', '藏书楼'), emoji: '📜', color: '#d69fc2' },
  { id: 'pilgrimage-site', name: localized('Pilgrimage sites', '朝圣之地'), emoji: '🥾', color: '#a8c97b' },
  { id: 'archaeological-site', name: localized('Archaeological sites', '考古遗址'), emoji: '🏺', color: '#c9b06b' },
  { id: 'historic-city', name: localized('Historic cities', '历史名城'), emoji: '🏙️', color: '#b0b8c9' },
];

export const CATEGORY_BY_ID: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const TRADITIONS: Tradition[] = [
  { id: 'confucianism', name: localized('Confucianism', '儒家'), emoji: '📖' },
  { id: 'daoism', name: localized('Daoism', '道家'), emoji: '☯️' },
  { id: 'buddhism', name: localized('Buddhism', '佛教'), emoji: '🪷' },
  { id: 'hinduism', name: localized('Hinduism', '印度教'), emoji: '🕉️' },
  { id: 'christianity', name: localized('Christianity', '基督宗教'), emoji: '✝️' },
  { id: 'islam', name: localized('Islam', '伊斯兰教'), emoji: '☪️' },
  { id: 'judaism', name: localized('Judaism', '犹太教'), emoji: '✡️' },
  { id: 'shinto', name: localized('Shinto', '神道'), emoji: '⛩️' },
  { id: 'sikhism', name: localized('Sikhism', '锡克教'), emoji: '🪯' },
  { id: 'zoroastrianism', name: localized('Zoroastrianism', '琐罗亚斯德教'), emoji: '🔥' },
  { id: 'greek-philosophy', name: localized('Greek philosophy', '希腊哲学'), emoji: '🏛️' },
  { id: 'indigenous', name: localized('Indigenous traditions', '原住民传统'), emoji: '🌎' },
  { id: 'scholarship', name: localized('Learning & scholarship', '学术传承'), emoji: '✒️' },
];

export const TRADITION_BY_ID: Record<TraditionId, Tradition> = Object.fromEntries(
  TRADITIONS.map((t) => [t.id, t]),
) as Record<TraditionId, Tradition>;
