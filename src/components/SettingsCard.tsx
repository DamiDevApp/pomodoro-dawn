import Card from './ui/Card';
import type { Settings } from '../types';

interface SettingsCardProp {
  updateSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  settings: Settings;
}

export default function SettingsCard({
  updateSetting,
  settings,
}: SettingsCardProp) {
  return (
    <div>
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
    </div>
  );
}
