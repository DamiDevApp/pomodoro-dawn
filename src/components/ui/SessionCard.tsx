import type { PomodoroRecordSession } from '../../types';
import styles from './SessionCard.module.css';
import { IonIcon } from '@ionic/react';
import { pauseCircleSharp, bugSharp } from 'ionicons/icons';

interface SessionCardProps {
  history: PomodoroRecordSession;
  index: number;
}

export default function SessionCard({ history, index }: SessionCardProps) {
  function capitalizeTitle(title: string) {
    if (!title) return title;

    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  function chooseActivityIcon(title: string) {
    if (!title) return title;
    switch (title) {
      case 'work':
        return <IonIcon icon={bugSharp} className={styles['icon']} />;
      default:
        return <IonIcon icon={pauseCircleSharp} className={styles['icon']} />;
    }
  }
  return (
    <li key={index} className={styles['main-card']}>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'normal',
        }}
      >
        <div className={styles['title-session']}>
          {capitalizeTitle(history.sessionType)}{' '}
        </div>
        <div>{chooseActivityIcon(history.sessionType)}</div>
      </div>
      <div style={{fontStyle: 'normal'}}>Duration: </div>
      <div>
        {new Date(history.startedAt).toLocaleTimeString()} → {' '}
        {new Date(history.endedAt).toLocaleTimeString()} (
        {Math.round(history.durationSec / 60)}m)
      </div>
    </li>
  );
}
