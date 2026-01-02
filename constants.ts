
import { Habit, MonthData } from './types';

export const YEAR = 2026;

export const MONTHS: MonthData[] = [
  { name: 'January', days: 31, offset: 4 }, // 2026-01-01 is Thursday
  { name: 'February', days: 28, offset: 0 },
  { name: 'March', days: 31, offset: 0 },
  { name: 'April', days: 30, offset: 3 },
  { name: 'May', days: 31, offset: 5 },
  { name: 'June', days: 30, offset: 1 },
  { name: 'July', days: 31, offset: 3 },
  { name: 'August', days: 31, offset: 6 },
  { name: 'September', days: 30, offset: 2 },
  { name: 'October', days: 31, offset: 4 },
  { name: 'November', days: 30, offset: 0 },
  { name: 'December', days: 31, offset: 2 },
];

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Morning Meditation', emoji: '🧘', color: '#BDE0FE' },
  { id: '2', name: '8 Glasses of Water', emoji: '💧', color: '#A2D2FF' },
  { id: '3', name: 'Read 20 Pages', emoji: '📖', color: '#FFC8DD' },
  { id: '4', name: 'No Social Media', emoji: '📵', color: '#FFAFCC' },
  { id: '5', name: 'Stretch / Exercise', emoji: '🏃', color: '#CDB4DB' },
];

export const PASTEL_COLORS = [
  '#BDE0FE', '#A2D2FF', '#FFC8DD', '#FFAFCC', '#CDB4DB', 
  '#E9EDC9', '#CCD5AE', '#D4A373', '#FAEDCD', '#FEFAE0'
];
