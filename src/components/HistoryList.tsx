import type { PomodoroRecordSession } from '../types';

interface HistoryListProps {
  history: PomodoroRecordSession[];
  onClear: () => void;
}

export default function HistoryList({ history, onClear }: HistoryListProps) {
  return (
    <div>
      <h3>History</h3>
      <button onClick={onClear}>Clear history</button>
      <ul>
        {history.slice(-5).map((h, i) => (
          <li key={i}>
            {h.sessionType} • {new Date(h.startedAt).toLocaleTimeString()} →{' '}
            {new Date(h.endedAt).toLocaleTimeString()} (
            {Math.round(h.durationSec / 60)}m)
          </li>
        ))}
      </ul>
    </div>
  );
}
