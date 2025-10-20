import { HistoryContext } from '../contexts/HistoryContext';
import { useContext } from 'react';
import SessionCard from './ui/SessionCard.tsx';
import type { PomodoroRecordSession } from '../types.ts';
import { IonIcon } from '@ionic/react';
import { trashBin } from 'ionicons/icons';

export default function HistoryList() {
  const { history, clearHistory } = useContext(HistoryContext);

  return (
    <div>
      <h1>History</h1>
      <button
        style={{
          alignItems: 'center',
          fontSize: '16px',
          maxWidth: '300px',
          display: 'flex',
        }}
        onClick={clearHistory}
      >
        <text style={{ marginRight: '10px', fontWeight: '400' }}>
          Clear history
        </text>
        <IonIcon icon={trashBin} style={{ fontSize: '16px' }} />
      </button>
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
