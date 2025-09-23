import Card from './ui/Card';
import type { Settings } from '../types';
import './settings-card.css';
import { IonIcon } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import Button from './ui/Button';

interface SettingsCardProp {
  updateSetting: <K extends keyof Settings>(k: K, v: Settings[K]) => void;
  resetSettings: () => void;
  settings: Settings;
}

export default function SettingsCard({
  updateSetting,
  settings,
  resetSettings,
}: SettingsCardProp) {
  return (
    <div>
      <details>
        <div style={{ justifyContent: 'flex-end', display: 'flex', marginBottom: '10px'}}>
          <Button onClick={resetSettings}>Reset settings</Button>
        </div>
        <summary>
          <span className='title'>Settings</span>
          <IonIcon icon={chevronDownOutline} className='chevron' />
        </summary>
        <Card>
          <div className='setting-row'>
            <label>Work (minutes)</label>
            <input
              type='number'
              value={settings.workMinutes}
              onChange={(e) => {
                const val = e.target.value;
                updateSetting('workMinutes', val === '' ? '' : Number(val));
              }}
              onBlur={(e) => {
                const num = Number(e.target.value);
                updateSetting('workMinutes', isNaN(num) ? 1 : Math.max(1, num));
              }}
            />
          </div>
          <div className='setting-row'>
            <label>Short break (minutes)</label>
            <input
              type='number'
              value={settings.shortBreakMinutes}
              onChange={(e) => {
                const val = e.target.value;
                updateSetting(
                  'shortBreakMinutes',
                  val === '' ? '' : Number(val)
                );
              }}
              onBlur={(e) => {
                const num = Number(e.target.value);
                updateSetting(
                  'shortBreakMinutes',
                  isNaN(num) ? 1 : Math.max(1, num)
                );
              }}
            />
          </div>
          <div className='setting-row'>
            <label>Long break (minutes)</label>
            <input
              type='number'
              value={settings.longBreakMinutes}
              onChange={(e) => {
                const val = e.target.value;
                updateSetting(
                  'longBreakMinutes',
                  val === '' ? '' : Number(val)
                );
              }}
              onBlur={(e) => {
                const num = Number(e.target.value);
                updateSetting(
                  'longBreakMinutes',
                  isNaN(num) ? 1 : Math.max(1, num)
                );
              }}
            />
          </div>
          <div className='setting-row'>
            <label>Sessions before long break</label>
            <input
              type='number'
              value={settings.sessionsBeforeLongBreak}
              onChange={(e) => {
                const val = e.target.value;
                updateSetting(
                  'sessionsBeforeLongBreak',
                  val === '' ? '' : Number(val)
                );
              }}
              onBlur={(e) => {
                const num = Number(e.target.value);
                updateSetting(
                  'sessionsBeforeLongBreak',
                  isNaN(num) ? 1 : Math.max(1, num)
                );
              }}
            />
          </div>
          <div className='setting-row'>
            <label>Auto start next session</label>
            <label className='checkbox-wrapper'>
              <input
                type='checkbox'
                checked={settings.autoStartNext}
                onChange={(e) =>
                  updateSetting('autoStartNext', e.target.checked)
                }
              />
              <span className='checkmark'></span>
            </label>
          </div>
        </Card>
      </details>
    </div>
  );
}
