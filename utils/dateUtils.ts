
import { YEAR, MONTHS } from '../constants';

export const getDateKey = (monthIndex: number, day: number): string => {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${YEAR}-${m}-${d}`;
};

export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const getDayOfWeek = (monthIndex: number, day: number): string => {
  const date = new Date(YEAR, monthIndex, day);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};
