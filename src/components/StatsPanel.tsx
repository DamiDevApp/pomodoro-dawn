import type { PomodoroRecordSession } from '../types';

interface StatsPanelProps {
  history: PomodoroRecordSession[];
}

export default function StatsPanel({ history }: StatsPanelProps) {
  const stats = history.reduce(
    (acc, h) => {
      acc.totalSessions++;
      acc.totalMinutes += h.durationSec / 60;
      acc.byType[h.sessionType]++;
      return acc;
    },
    {
      totalSessions: 0,
      totalMinutes: 0,
      byType: { work: 0, shortBreak: 0, longBreak: 0 },
    }
  );
  return (
    <div>
      <h3>Statistics</h3>
      <div>Total sessions: {stats.totalSessions}</div>
      <div>Total minutes: {Math.round(stats.totalMinutes)}</div>
      <div>Work sessions: {stats.byType.work}</div>
      <div>Short breaks: {stats.byType.shortBreak}</div>
      <div>Long breaks: {stats.byType.longBreak}</div>
    </div>
  );
}
