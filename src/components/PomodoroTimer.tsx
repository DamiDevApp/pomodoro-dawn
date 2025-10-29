import { useEffect, useRef, useState, useContext } from 'react';
import Button from './ui/Button';
import { HistoryContext } from '../contexts/HistoryContext';
import { type Settings, type SessionType, DEFAULT_SETTINGS } from '../types';
import { useElectronNotifications } from '../hooks/useElectronNotifications';
import SettingsCard from './SettingsCard';
import CircularProgress from './CircularProgress';
import './pomodoro-timer.css';

// Function to pass the time to minutes:seconds
function formatTime(totalSec: number) {
  const mm = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, '0');

  const ss = (totalSec % 60).toString().padStart(2, '0');

  return `${mm}:${ss}`;
}

export default function PomodoroTimer() {
  // Load settings from local storage
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem('pomodoro:settings');
      return raw ? (JSON.parse(raw) as Settings) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error fetching settings from local storage: ', error);
      return DEFAULT_SETTINGS;
    }
  });

  const [session, setSession] = useState<SessionType>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const raw = localStorage.getItem('pomodoro:completed');
    return raw ? Number(raw) || 0 : 0;
  });

  const { sendNotification } = useElectronNotifications();

  const { addRecord } = useContext(HistoryContext);

  const getInitialSeconds = (s: SessionType, st: Settings) =>
    (s === 'work'
      ? st.workMinutes
      : s === 'short-break'
        ? st.shortBreakMinutes
        : st.longBreakMinutes) * 60;

  const [remainingSec, setRemainingSec] = useState<number>(() =>
    getInitialSeconds('work', settings)
  );

  const totalSec = getInitialSeconds(session, settings);

  const progress = 1 - remainingSec / totalSec;

  // References to manage interval and session timing
  const intervalRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  //Persist settings and completedSessions

  useEffect(() => {
    localStorage.setItem('pomodoro:settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(
      'pomodoro:completed',
      JSON.stringify(completedSessions)
    );
  }, [completedSessions]);

  //clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // start / pause logic
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current !== null) return;
      //start running logic
      intervalRef.current = window.setInterval(() => {
        setRemainingSec((prev) => {
          if (prev <= 1) {
            // stop timer session ended
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // pause
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRunning]);

  useEffect(() => {
    if (remainingSec === 0 && isRunning) {
      // stop timer
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
      handleSessionEnd();
    }
  }, [remainingSec, isRunning]);



  function handleSessionEnd() {
    // compute real duration sessionStartRef
    console.log('Calling session end');
    const now = Date.now();
    const startedAt = sessionStartRef.current
      ? new Date(sessionStartRef.current).toISOString()
      : new Date(now).toISOString();
    const durationSec =
      sessionStartRef.current !== null
        ? Math.round((now - sessionStartRef.current) / 1000)
        : getInitialSeconds(session, settings);

    const endedAt = new Date(now).toISOString();

    addRecord({
      sessionType: session,
      startedAt,
      endedAt,
      durationSec,
    });

    // create notification
    const notificationTitle =
      session === 'work' ? 'Work session completed!' : 'Break time is over';

    const notificationBody =
      session === 'work'
        ? `Great job! Time for a ${completedSessions % settings.sessionsBeforeLongBreak === 0 ? 'long' : 'short'} break`
        : 'Ready to focus again?';

    console.log('Sending notification', notificationTitle);

    sendNotification(notificationTitle, {
      body: notificationBody,
      sound: true,
    }).then((result) => console.log('Notification result: ', result));

    if (session === 'work') {
      setCompletedSessions((prev) => {
        const newCount = prev + 1;
        const isLong = newCount % settings.sessionsBeforeLongBreak === 0;
        const next: SessionType = isLong ? 'long-break' : 'short-break';
        setSession(next);
        setRemainingSec(getInitialSeconds(next, settings));

        if (settings.autoStartNext) {
          sessionStartRef.current = Date.now();
          setIsRunning(true);
        } else {
          sessionStartRef.current = null;
        }

        return newCount;
      });
    } else {
      setSession('work');
      setRemainingSec(getInitialSeconds('work', settings));
      if (settings.autoStartNext) {
        sessionStartRef.current = Date.now();
        setIsRunning(true);
      } else {
        sessionStartRef.current = null;
      }
    }
  }

  function handleStart() {
    if (!isRunning) {
      if (sessionStartRef.current === null) {
        sessionStartRef.current = Date.now();
      }
      setIsRunning(true);
    }
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setSession('work');
    setRemainingSec(getInitialSeconds('work', settings));
    setCompletedSessions(0);
    sessionStartRef.current = null;
  }

  function handleSkip() {
    setIsRunning(false);
    handleSessionEnd();
  }

  function updateSetting<K extends keyof Settings>(k: K, v: Settings[K]) {
    setSettings((prev) => ({ ...prev, [k]: v }));
  }
  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <div>
      <h1>
        {session === 'work'
          ? 'Focus'
          : session === 'short-break'
            ? 'Short break'
            : 'Long break'}
      </h1>
      <div className='timer-wrap'>
        <CircularProgress
          progress={progress}
          size={320}
          strokeWidth={8}
          timeLabel={formatTime(remainingSec)}
        />
      </div>
      <div className='controls-row'>
        {!isRunning ? (
          <Button className='timer-button'onClick={handleStart}>Start</Button>
        ) : (
          <Button className='timer-button' onClick={handlePause}>Pause</Button>
        )}
        <Button className='timer-button' onClick={handleSkip}>Skip</Button>
        <Button className='timer-button' onClick={handleReset}>Reset</Button>
      </div>

      <div
        style={{
          justifySelf: 'center',
          display: 'flex',
          width: '750px',
          flexDirection: 'column'
        }}
      >
        <hr style={{ margin: '16px 0' }} />
        <SettingsCard
          updateSetting={updateSetting}
          settings={settings}
          resetSettings={resetSettings}
        />

        <hr style={{ margin: '16px 0' }} />
        <div>Completed sessions: {completedSessions}</div>
      </div>
    </div>
  );
}
