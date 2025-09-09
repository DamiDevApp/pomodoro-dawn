import { useEffect, useRef, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import Button from './ui/Button';
import Card from './ui/Card';
import type { SessionType } from '../types';

interface Settings {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStartNext: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStartNext: false,
};

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

  const { addRecord } = useHistory();

  const getInitialSeconds = (s: SessionType, st: Settings) =>
    (s === 'work'
      ? st.workMinutes
      : s === 'short-break'
        ? st.shortBreakMinutes
        : st.longBreakMinutes) * 60;

  const [remainingSec, setRemainingSec] = useState<number>(() =>
    getInitialSeconds('work', settings)
  );

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

            if (intervalRef.current !== null) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsRunning(false);
            handleSessionEnd();
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

  function handleSessionEnd() {
    // compute real duration sessionStartRef
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
        sessionStartRef.current === Date.now();
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

  useEffect(() => {
    if (!isRunning) {
      setRemainingSec(getInitialSeconds(session, settings));
    }
  }, [session, settings]);

  function updateSetting<K extends keyof Settings>(k: K, v: Settings[K]) {
    setSettings((prev) => ({ ...prev, [k]: v }));
  }

  return (
    <div>
      <h2>
        {session === 'work'
          ? 'Focus'
          : session === 'short-break'
            ? 'Short break'
            : 'Long break'}
      </h2>
      <div style={{ fontSize: 48, fontWeight: 700, margin: '10px 0' }}>
        {formatTime(remainingSec)}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {!isRunning ? (
          <Button onClick={handleStart}>Start</Button>
        ) : (
          <Button onClick={handlePause}>Pause</Button>
        )}
        <Button onClick={handleSkip}>Skip</Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>

      <hr style={{ margin: '16px 0' }} />

      <details>
        <summary>Settings</summary>
        <Card>
          <label>
            Work (minutes)
            <input
              type='number'
              value={settings.workMinutes}
              onChange={(e) =>
                updateSetting(
                  'workMinutes',
                  Math.max(1, Number(e.target.value))
                )
              }
            />
          </label>
          <label>
            Short break (minutes)
            <input
              type='number'
              value={settings.shortBreakMinutes}
              onChange={(e) =>
                updateSetting(
                  'shortBreakMinutes',
                  Math.max(1, Number(e.target.value))
                )
              }
            />
          </label>
          <label>
            Long break (minutes)
            <input
              type='number'
              value={settings.longBreakMinutes}
              onChange={(e) =>
                updateSetting(
                  'longBreakMinutes',
                  Math.max(1, Number(e.target.value))
                )
              }
            />
          </label>
          <label>
            Sessions before long break
            <input
              type='number'
              value={settings.sessionsBeforeLongBreak}
              onChange={(e) =>
                updateSetting(
                  'sessionsBeforeLongBreak',
                  Math.max(1, Number(e.target.value))
                )
              }
            />
          </label>
          <label>
            <input
              type='checkbox'
              checked={settings.autoStartNext}
              onChange={(e) => updateSetting('autoStartNext', e.target.checked)}
            />{' '}
            Auto start next session
          </label>
        </Card>
      </details>

      <hr style={{ margin: '16px 0' }} />
      <div>Completed sessions: {completedSessions}</div>
    </div>
  );
}
