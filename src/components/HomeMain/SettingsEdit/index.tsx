import { FC, useState } from "react";
import { useTimerContext } from "../../../contexts/TimerContext";
import { ITimer } from "../../../types/interfaces";
import useTimer from '../../../hooks/useTimer';
import { useTheme } from "../../../contexts/ThemeContext";

import './style.scss';

interface SettingsEditProps {

  onSettingsSave: (newTimerSettings: ITimer) => void;
  onClose: () => void;
}

export const SettingsEdit: FC<SettingsEditProps> = ({ onSettingsSave, onClose }) => {
  const { theme } = useTheme();
  const { timerSettings } = useTimerContext();
  const { updateTimerSettings } = useTimer();

  const [pomodoroDuration, setPomodoroDuration] = useState(timerSettings?.pomodoroDuration || 25 * 60);
  const [pomodoroShortBreak, setPomodoroShortBreak] = useState(timerSettings?.pomodoroShortBreak || 5 * 60);
  const [pomodoroLongBreak, setPomodoroLongBreak] = useState(timerSettings?.pomodoroLongBreak || 15 * 60);
  const [frequencyLongBreak, setFrequencyLongBreak] = useState(timerSettings?.frequencyLongBreak || 4);
  const [enableNotifications, setEnableNotifications] = useState(timerSettings?.enableNotifications !== false);

  const handlePomodoroDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPomodoroDuration(parseInt(event.target.value, 10));
  };

  const handlePomodoroShortBreakChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPomodoroShortBreak(parseInt(event.target.value, 10));
  };

  const handlePomodoroLongBreakChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPomodoroLongBreak(parseInt(event.target.value, 10));
  };

  const handleFrequencyLongBreakChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrequencyLongBreak(parseInt(event.target.value, 10));
  };

  const handleEnableNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnableNotifications(event.target.checked);
  };

  const handleSaveSettings = () => {
    const newTimerSettings: ITimer = {
      status: timerSettings?.status || 'stopped',
      currentTaskId: timerSettings?.currentTaskId || null,
      pomodoroDuration,
      pomodoroShortBreak,
      pomodoroLongBreak,
      frequencyLongBreak,
      enableNotifications,
      mode: timerSettings?.mode || 'pomodoro',
      currentPomodoro: timerSettings?.currentPomodoro || 0
    };

    updateTimerSettings(newTimerSettings);
    onSettingsSave(newTimerSettings);
  };

  return (
    <div className={`settings ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="setting-wrapper">
        <h2 className="settings__h2">Настройки</h2>
        <div className="settings-pomodoro">
          <label>Продолжительность Timer:</label>
          <input type="number" value={pomodoroDuration} onChange={handlePomodoroDurationChange} />
        </div>
        <div className="settings-short">
          <label>Короткий перерыв:</label>
          <input type="number" value={pomodoroShortBreak} onChange={handlePomodoroShortBreakChange} />
        </div>
        <div className="settings-long">
          <label>Длинный перерыв:</label>
          <input type="number" value={pomodoroLongBreak} onChange={handlePomodoroLongBreakChange} />
        </div>
        <div className="settings-frequency">
          <label>Частота длинных перерывов:</label>
          <input type="number" value={frequencyLongBreak} onChange={handleFrequencyLongBreakChange} />
        </div>
        <div className="settings-notification">
          <label>Включить уведомления:</label>
          <input className="settings-check" type="checkbox" checked={enableNotifications} onChange={handleEnableNotificationsChange} />
        </div>
        <button className="setting-btn-save" onClick={handleSaveSettings}>Сохранить</button>
        <button className="setting-btn-cancel" onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

export default SettingsEdit;




