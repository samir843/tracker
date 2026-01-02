
export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export type HabitLog = Record<string, Record<string, boolean>>; // { habitId: { dateKey: boolean } }

export interface SleepEntry {
  date: string; // YYYY-MM-DD
  hours: number;
}

export interface MonthData {
  name: string;
  days: number;
  offset: number; // For rendering calendar start
}

export enum ViewMode {
  TRACKER = 'TRACKER',
  DASHBOARD = 'DASHBOARD',
  SLEEP = 'SLEEP'
}

export interface AppState {
  habits: Habit[];
  logs: HabitLog;
  sleepLogs: Record<string, number>;
}
