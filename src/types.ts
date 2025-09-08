export type SessionType = 'work' | 'short-break' | 'long-break';

export interface PomodoroRecordSession {
  sessionType: SessionType;
  startedAt: string;
  endedAt: string;
  durationSec: number;
}
