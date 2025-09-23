export type SessionType = 'work' | 'short-break' | 'long-break';

export interface PomodoroRecordSession {
  sessionType: SessionType;
  startedAt: string;
  endedAt: string;
  durationSec: number;
}

export interface Settings {
  workMinutes: number | "";
  shortBreakMinutes: number | "";
  longBreakMinutes: number | "";
  sessionsBeforeLongBreak: number | "";
  autoStartNext: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartNext: false,
};
