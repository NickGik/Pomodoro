import { FC, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTimerContext } from "../../../contexts/TimerContext"; 
import useStatistics from "../../../hooks/useStatistics";

interface TimerProps {
  currentMode: "pomodoro" | "short" | "long";
  onTimerEnd: () => void;
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
  onStop: () => void;
  onPlaySound: (soundFile: string) => void;
  onShowNotification: (title: string, body: string) => void;
  totalSessionTime: number; 
  onUpdateTotalSessionTime: (newTotalSessionTime: number) => void; 
  onCounterClassChange: (isRunning: boolean, currentPomodoro: number) => void; 
}

export const Timer: FC<TimerProps> = ({
  currentMode,
  onTimerEnd,
  onStart,
  onPause,
  onSkip,
  onStop,
  onPlaySound,
  onShowNotification,
  totalSessionTime,
  onUpdateTotalSessionTime,
  onCounterClassChange, 
}) => {
  const { timerSettings } = useTimerContext(); 
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [wasPaused, setWasPaused] = useState(false); 

  const { updateDateStatistics, getDailyStatistics } = useStatistics();
  
  const currentDate = new Date().toISOString().split('T')[0];
  const { data: dailyStats } = getDailyStatistics(currentDate);

  useEffect(() => {
    if (dailyStats && dailyStats.pauseTime) {
      const [hours, minutes, seconds] = dailyStats.pauseTime.split(':').map(Number);
      setTotalPauseTime(hours * 3600 + minutes * 60 + seconds);
    }
  }, [dailyStats]);

  // Управление таймером с помощью useRef
  const timerId = useRef<NodeJS.Timeout | null>(null); 

  // Сохраняем начальное значение timeLeft
  const initialTimeLeft = useRef<number>(0); 
  useEffect(() => {
    initialTimeLeft.current = timeLeft;
  }, [timeLeft]);

  const formattedTime = useMemo(() => {
    return `${Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleStartPause = useCallback(() => {
    setIsRunning((prevIsRunning) => {
      if (prevIsRunning) {
        onPause();
        setPauseStartTime(Date.now());
        setWasPaused(true); 
        onCounterClassChange(false, 0); 
        return false;
      } else {
        onStart();
        if (pauseStartTime) {
          const pauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
          setTotalPauseTime(prev => prev + pauseDuration);
          setPauseStartTime(null);
          setWasPaused(false);
          const updatedPauseTime = totalPauseTime + pauseDuration;
          const formattedPauseTime = formatTime(updatedPauseTime);

          updateDateStatistics({ 
            date: currentDate, 
            updatedStats: { pauseTime: formattedPauseTime } 
          });
        }
        onCounterClassChange(true, 0); 
        return true;
      }
    });
  }, [onPause, onStart, pauseStartTime, totalPauseTime, updateDateStatistics, currentDate, onCounterClassChange]);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    onStop();
    timerId.current && clearTimeout(timerId.current); 

    let updatedTotalPauseTime = totalPauseTime;
    if (pauseStartTime) {
      const pauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
      updatedTotalPauseTime += pauseDuration;
      setTotalPauseTime(updatedTotalPauseTime);
      setPauseStartTime(null);
    }

    const formattedPauseTime = formatTime(updatedTotalPauseTime);

    if (isRunning || timeLeft !== initialTimeLeft.current || wasPaused) {
      const updatedBreaksStopped = (dailyStats?.breaksStoped || 0) + 1;

      updateDateStatistics({ 
        date: currentDate, 
        updatedStats: { 
          pauseTime: formattedPauseTime,
          breaksStoped: updatedBreaksStopped,
        } 
      });
    }

    setTimeLeft(
      currentMode === "pomodoro"
        ? (timerSettings?.pomodoroDuration || 25) * 60
        : currentMode === "short"
        ? (timerSettings?.pomodoroShortBreak || 5) * 60
        : (timerSettings?.pomodoroLongBreak || 15) * 60
    );

    onCounterClassChange(false, 0); 
  }, [onStop, currentMode, timerSettings, pauseStartTime, totalPauseTime, updateDateStatistics, dailyStats, currentDate, totalSessionTime, onUpdateTotalSessionTime, timeLeft, initialTimeLeft.current, wasPaused, onCounterClassChange]);

  const handleSkip = useCallback(() => {
    handleStop();
    onSkip();
  }, [handleStop, onSkip]);

  useEffect(() => {
    handleStop();
  }, [currentMode]);

  // Обновление timeLeft при изменении настроек
  useEffect(() => {
    // Проверка, были ли изменены настройки таймера
    setTimeLeft(
      currentMode === "pomodoro"
        ? (timerSettings?.pomodoroDuration || 25) * 60
        : currentMode === "short"
        ? (timerSettings?.pomodoroShortBreak || 5) * 60
        : (timerSettings?.pomodoroLongBreak || 15) * 60
    );
  }, [timerSettings, currentMode]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      // Используем timerId.current для управления таймером
      timerId.current = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      onTimerEnd();
      setIsRunning(false);

      if (currentMode === "pomodoro") {
        onPlaySound("/sound/sound.mp3");
        onShowNotification("Время отдыха!", "Отдохните и вернитесь к работе");
      } else if (currentMode === "short") {
        onPlaySound("/sound/sound.mp3");
        onShowNotification("Время работы!", "Пора возвращаться к работе");
      } else if (currentMode === "long") {
        onPlaySound("/sound/sound.mp3");
        onShowNotification("Время работы!", "Пора возвращаться к работе");
      }
    }

    return () => {
      // Очистка таймера при размонтировании
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, [isRunning, timeLeft, currentMode, onPlaySound, onShowNotification, onTimerEnd]);

  return (
    <div className="timer-wrapper">
      <div className="timer">{formattedTime}</div>
      <div className="timer-btn-wrapper">
        <button className="timer-btn-stop" onClick={handleStartPause}>
          {isRunning ? "Пауза" : "Старт"}
        </button>
        <button className="timer-btn-start-pause" onClick={handleStop}>Стоп</button>
        <button className="timer-btn-skip" onClick={handleSkip}>Пропустить</button>
      </div>
    </div>
  );
};

export default Timer;
