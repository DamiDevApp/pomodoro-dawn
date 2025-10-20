import type { PomodoroRecordSession } from '../../types';
import styles from './SessionCard.module.css';
import { IonIcon } from '@ionic/react';
import {
  pauseCircleSharp,
  bugSharp,
  hourglassOutline,
  timeOutline,
} from 'ionicons/icons';

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
          justifyContent: 'space-between',
          maxWidth: '475px',
        }}
      >
        <div className={styles['title-session']}>
          {capitalizeTitle(history.sessionType)}{' '}
        </div>
        <div>{chooseActivityIcon(history.sessionType)}</div>
      </div>
      <div style={{ fontStyle: 'normal', letterSpacing: '1px' }}>Duration: </div>
      <div className={styles['duration-section']}>
        <IonIcon icon={timeOutline} className={styles['duration-icon']} />
        <div className={styles['duration-text']}>
          <span className={styles['time-range']}>
            {new Date(history.startedAt).toLocaleTimeString()} →{' '}
            {new Date(history.endedAt).toLocaleTimeString()}
          </span>
          <span className={styles['total-duration']}>
            <IonIcon icon={hourglassOutline} className={styles['mini-icon']} />(
            {Math.round(history.durationSec / 60)}min)
          </span>
        </div>
      </div>
    </li>
  );
}
