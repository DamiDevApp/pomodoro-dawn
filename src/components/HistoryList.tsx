import { HistoryContext } from '../contexts/HistoryContext';
import { useContext } from 'react';
import SessionCard from './ui/SessionCard.tsx';
import type { PomodoroRecordSession } from '../types.ts';

export default function HistoryList() {
  const { history, clearHistory } = useContext(HistoryContext);

  return (
    <div>
      <h2>History</h2>
      <button style={{ justifySelf: 'end'}} onClick={clearHistory}>Clear history</button>
      <ul
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          paddingLeft: '0px',
        }}
      >
        {history.map((h: PomodoroRecordSession, i: number) => (
          <SessionCard key={i} history={h} index={i} />
        ))}
      </ul>
    </div>
  );
}
