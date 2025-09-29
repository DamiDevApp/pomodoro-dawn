import { HistoryContext } from '../contexts/HistoryContext';
import { useContext } from 'react';

export default function HistoryList() {
  const { history, clearHistory } = useContext(HistoryContext);

  return (
    <div>
      <h3>History</h3>
      <button onClick={clearHistory}>Clear history</button>
      <ul
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          padding: '8px',
          margin: '8px 0',
        }}
      >
        {history.map((h, i) => (
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
