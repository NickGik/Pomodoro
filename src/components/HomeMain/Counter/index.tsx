import { FC, useState, useEffect, useCallback, useRef } from "react";
import { Timer } from "../Timer";
import { SettingsEdit } from "../SettingsEdit";
import { ITask, IStatistics, ITimer } from "../../../types/interfaces";
import useTimer from "../../../hooks/useTimer";
import useTasks from "../../../hooks/useTasks";
import useStatistics from "../../../hooks/useStatistics";
import { useTimerContext } from "../../../contexts/TimerContext";

import './style.scss';

interface CounterProps {
  tasks: any[];
}

export const Counter: FC<CounterProps> = () => {
  const { timerSettings } = useTimerContext();

  const { timer, updateTimer } = useTimer(); // Удалите updateTimerSettings
  const { tasks, updateTask, deleteTask } = useTasks();
  
  const { updateDateStatistics, getDailyStatistics } = useStatistics(); 

  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const [mode, setMode] = useState<'pomodoro' | 'short' | 'long'>('pomodoro');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null); 

  const today = new Date().toISOString().split("T")[0];

  const [updateTaskAfterTimerEnd, setUpdateTaskAfterTimerEnd] = useState<ITask | null>(null);
  const [updateDailyStatsAfterTimerEnd, setUpdateDailyStatsAfterTimerEnd] = useState<IStatistics | null>(null);

  const { data: dailyStats, isSuccess: isStatsLoaded } = getDailyStatistics(today);

  const [timerLocalStorage, setTimerLocalStorage] = useState<ITimer | null>(null);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);

  const [totalSessionTime, setTotalSessionTime] = useState(0); 

  useEffect(() => {
    const storedTimer = localStorage.getItem('timer');
    if (storedTimer) {
      setTimerLocalStorage(JSON.parse(storedTimer));
    }
  }, []);

  useEffect(() => {
    if (timerLocalStorage) {
      localStorage.setItem('timer', JSON.stringify(timerLocalStorage));
    }
  }, [timerLocalStorage]);

  // Обновление `currentTask`  с помощью `useEffect`
  useEffect(() => {
    if (timer && timer.currentTaskId) {
      const task = tasks.find((task) => task.id === timer.currentTaskId) || null;
      setCurrentTask(task);
      console.log("Updated currentTask:", task);
    } else {
      setCurrentTask(null);
    }
  }, [timer?.currentTaskId, tasks]);
  

  useEffect(() => {
    if (updateTaskAfterTimerEnd) {
      updateTask({
        id: updateTaskAfterTimerEnd.id,
        updatedTask: {
          ...updateTaskAfterTimerEnd,
          pomodorosCompleted: updateTaskAfterTimerEnd.pomodorosCompleted + 1,
        },
      });
      setUpdateTaskAfterTimerEnd(null);
    }
    if (updateDailyStatsAfterTimerEnd) {
      updateDateStatistics({
        date: today,
        updatedStats: updateDailyStatsAfterTimerEnd,
      });
      setUpdateDailyStatsAfterTimerEnd(null);
    }
  }, [
    updateTaskAfterTimerEnd,
    updateDailyStatsAfterTimerEnd,
    updateTask,
    updateDateStatistics,
    today,
  ]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const updatePomodorosCompleted = useCallback(
    (task: ITask, newCount: number) => {
      updateTask({
        id: task.id,
        updatedTask: {
          ...task,
          pomodorosCompleted: newCount,
        },
      });
    },
    [updateTask]
  );

  const handleModeChange = useCallback(
    (newMode: "pomodoro" | "short" | "long") => {
      if (timer) {
        setMode(newMode);
        updateTimer({
          ...timer,
          mode: newMode,
        });
      }
    },
    [timer, updateTimer]
  );

  const handleTimerEnd = useCallback(async () => {
    if (timer && currentTask) {
      if (mode === "pomodoro") {
        updatePomodorosCompleted(currentTask, currentTask.pomodorosCompleted + 1);

        let newStats: IStatistics;
        if (isStatsLoaded && dailyStats) {
          const additionalWorkTime = (timerSettings?.pomodoroDuration || 25) * 60; 

          newStats = {
            ...dailyStats,
            totalHoursWorked: dailyStats.totalHoursWorked + additionalWorkTime, 
            totalSessionTime: dailyStats.totalSessionTime + additionalWorkTime,
            breaksPomodoros: dailyStats.breaksPomodoros + 1,
          };

          setUpdateDailyStatsAfterTimerEnd(newStats);
          updateDateStatistics({
            date: today,
            updatedStats: {
              totalSessionTime: dailyStats.totalSessionTime + additionalWorkTime, 
            },
          });
        }

        if (currentTask.pomodorosCompleted + 1 >= currentTask.pomodorosPlanned) {
          deleteTask(currentTask.id);
        
          const remainingTasks = tasks.filter((task) => task.id !== currentTask.id);
          const newTask = remainingTasks.length > 0 ? remainingTasks[0] : null;
        
          setCurrentTask(newTask); 
        
          if (newTask) {
            updateTimer({
              ...timer,
              currentTaskId: newTask.id,
              mode: "pomodoro",
              status: "running",
              currentPomodoro: 0,
            });
          } else {
            updateTimer({
              ...timer,
              currentTaskId: null,
              mode: "pomodoro",
              status: "stopped",
              currentPomodoro: 0,
            });
          }
          return;
        }
         else {
          handleModeChange("short");
          updateTimer({
            ...timer,
            status: "running", 
            currentPomodoro: timer.currentPomodoro + 1,
          });
        }
      } else if (mode === "short") {
        let newStats: IStatistics;
        if (isStatsLoaded && dailyStats) {
          const additionalBreakTime = (timerSettings?.pomodoroShortBreak || 5) * 60; 

          newStats = {
            ...dailyStats,
            totalSessionTime: dailyStats.totalSessionTime + additionalBreakTime, 
            breaksTaken: dailyStats.breaksTaken + 1,
          };

          setUpdateDailyStatsAfterTimerEnd(newStats);
          updateDateStatistics({
            date: today,
            updatedStats: {
              totalSessionTime: dailyStats.totalSessionTime + additionalBreakTime, 
            },
          });
        }

        if ((timer.currentPomodoro ?? 0) % (timer.frequencyLongBreak ?? 1) === 0) { 
          handleModeChange("long");
          updateTimer({
            ...timer,
            status: "running", 
            currentPomodoro: timer.currentPomodoro + 1,
          });
        } else {
          handleModeChange("pomodoro");
          updateTimer({
            ...timer,
            status: "running", 
          });
        }
      } else if (mode === "long") {
        let newStats: IStatistics;
        if (isStatsLoaded && dailyStats) {
          const additionalLongBreakTime = (timerSettings?.pomodoroLongBreak || 15) * 60; 

          newStats = {
            ...dailyStats,
            totalSessionTime: dailyStats.totalSessionTime + additionalLongBreakTime, 
            breaksTaken: dailyStats.breaksTaken + 1,
          };

          setUpdateDailyStatsAfterTimerEnd(newStats);
          updateDateStatistics({
            date: today,
            updatedStats: {
              totalSessionTime: dailyStats.totalSessionTime + additionalLongBreakTime, 
            },
          });
        }

        handleModeChange("pomodoro");
        updateTimer({
          ...timer,
          status: "running", 
        });
      }
    }
  }, [
    currentTask,
    deleteTask,
    timer,
    updateDateStatistics,
    updatePomodorosCompleted,
    updateTimer,
    dailyStats,
    isStatsLoaded,
    tasks,
    today,
    mode,
    handleModeChange,
    timerSettings?.pomodoroDuration,
    timerSettings?.pomodoroShortBreak,
    timerSettings?.pomodoroLongBreak
  ]);
  

  const handleSkip = useCallback(async () => {
    if (timer && currentTask) {
      if (currentTask.pomodorosCompleted + 1 < currentTask.pomodorosPlanned) {
        console.log("Timer skipped");
        let nextMode: "pomodoro" | "short" | "long" = "pomodoro";
  
        // Увеличиваем счетчик завершенных помидоров
        const nextPomodorosCompleted = currentTask.pomodorosCompleted + 1;
        updatePomodorosCompleted(currentTask, nextPomodorosCompleted);
  
        // Определяем следующий режим
        const completedPomodoros = (timer.currentPomodoro ?? 0) + 1;
        const isLongBreak =
          completedPomodoros % (timer.frequencyLongBreak * 4) === 0;
        const isShortBreak = completedPomodoros % 4 === 0;
        if (isLongBreak) {
          nextMode = "long";
        } else if (isShortBreak) {
          nextMode = "short";
        } else {
          nextMode = "pomodoro";
        }
  
        // Обновляем таймер
        updateTimer({
          ...timer,
          currentPomodoro: completedPomodoros,
          status: "running",
          mode: nextMode,
        });
      } else {
        console.log("All pomodoros completed, deleting task");
  
        // Ожидаем завершения удаления задачи
        await deleteTask(currentTask.id);
  
        // Находим следующую задачу
        const remainingTasks = tasks.filter((task) => task.id !== currentTask.id);
        const newTask = remainingTasks.length > 0 ? remainingTasks[0] : null;
  
        // Обновляем текущую задачу
        setCurrentTask(newTask); 
  
        // Запускаем новый таймер для новой задачи, если она есть
        if (newTask) {
          updateTimer({
            ...timer,
            currentTaskId: newTask.id, // Устанавливаем новый ID задачи в таймере
            mode: "pomodoro",
            status: "running",
            currentPomodoro: 0,
          });
        } else {
          // Если задач больше нет, останавливаем таймер
          updateTimer({
            ...timer,
            currentTaskId: null, // Устанавливаем `currentTaskId` в `null`
            mode: "pomodoro",
            status: "stopped",
            currentPomodoro: 0,
          });
        }
      }
    }
  }, [
    currentTask,
    handleModeChange,
    mode,
    timer,
    updatePomodorosCompleted,
    deleteTask,
    tasks,
    updateTimer,
  ]);
  

  const handleStop = useCallback(() => {
    if (timer) {
      console.log("Timer stopped");
      updateTimer({
        ...timer,
        status: "stopped",
      });
    }
  }, [timer, updateTimer, totalSessionTime, updateDateStatistics]);

  const handleTimerPause = useCallback(() => {
    if (timerLocalStorage) {
      if (timerLocalStorage.status === 'running') {
        setPauseStartTime(new Date());
        setTimerLocalStorage({
          ...timerLocalStorage,
          status: "paused",
          pauseTime: timerLocalStorage.pauseTime,
        });
      }
    }
  }, [timerLocalStorage]);

  const handleTimerStart = useCallback(() => {
    if (timerLocalStorage) {
      if (timerLocalStorage.status === 'paused') {
        setTimerLocalStorage({
          ...timerLocalStorage,
          status: "running",
          pauseTime: timerLocalStorage.pauseTime,
        });
        setPauseStartTime(null);
      } else {
        setTimerLocalStorage({
          ...timerLocalStorage,
          status: "running",
        });
      }
    }
  }, [timerLocalStorage]);

  useEffect(() => {
    if (pauseStartTime) {
      const now = new Date();
      const pauseDuration = now.getTime() - pauseStartTime.getTime();
      const pauseTime = formatTime(pauseDuration / 1000);

      if (isStatsLoaded && dailyStats) {
        const updatedStats: IStatistics = {
          ...dailyStats,
          pauseTime: formatTime(
            (parseInt(dailyStats.pauseTime.split(':')[2], 10) + parseInt(pauseTime.split(':')[2], 10))
          )
        };
        setUpdateDailyStatsAfterTimerEnd(updatedStats);
      }
    }
  }, [pauseStartTime, dailyStats, isStatsLoaded]);

  const showNotification = useCallback((title: string, body: string) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "/path/to/icon.png",
      });
    }
  }, []);

  const playSound = useCallback((soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play();
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notifications allowed!");
        } else {
          console.log("Notifications denied!");
        }
      });
    }
  }, []);

  if (!timer) return null;

  const handleAddMinutes = useCallback(() => {
    if (timer) {
      switch (mode) {
        case "pomodoro":
          updateTimer({ ...timer, pomodoroDuration: timer.pomodoroDuration + 1 });
          break;
        case "short":
          updateTimer({ ...timer, pomodoroShortBreak: timer.pomodoroShortBreak + 1 });
          break;
        case "long":
          updateTimer({ ...timer, pomodoroLongBreak: timer.pomodoroLongBreak + 1 });
          break;
      }
    }
  }, [timer, updateTimer, mode]);

  const handleSubtractMinutes = useCallback(() => {
    if (timer) {
      switch (mode) {
        case "pomodoro":
          if (timer.pomodoroDuration > 1) {
            updateTimer({ ...timer, pomodoroDuration: timer.pomodoroDuration - 1 });
          }
          break;
        case "short":
          if (timer.pomodoroShortBreak > 1) {
            updateTimer({ ...timer, pomodoroShortBreak: timer.pomodoroShortBreak - 1 });
          }
          break;
        case "long":
          if (timer.pomodoroLongBreak > 1) {
            updateTimer({ ...timer, pomodoroLongBreak: timer.pomodoroLongBreak - 1 });
          }
          break;
        default:
          break;
      }
    }
  }, [timer, updateTimer, mode]);


  const handleSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleSettingsSave = (newTimerSettings: ITimer) => {
    console.log("Counter: Сохранение настроек", newTimerSettings);
    updateTimer(newTimerSettings); // Используйте updateTimer для обновления настроек
    handleCloseSettings();
  };

  const handleCounterClassChange = useCallback((isRunning: boolean, currentPomodoro: number) => {
    if (counterRef.current) {
      if (isRunning) {
        counterRef.current.classList.add('counter-start');
        counterRef.current.classList.remove('counter-stop');
        counterRef.current.classList.remove('counter-finish'); 
      } else {
        counterRef.current.classList.remove('counter-start');
        counterRef.current.classList.add('counter-stop');
        if (currentPomodoro > 0) { 
          counterRef.current.classList.add('counter-finish');
        } else {
          counterRef.current.classList.remove('counter-finish');
        }
      }
    }
  }, []); 

  useEffect(() => {
    if (timer) {
      if (counterRef.current) {
        if (timer.status === "running") {
          counterRef.current.classList.add('counter-start');
          counterRef.current.classList.remove('counter-stop');
          counterRef.current.classList.remove('counter-finish');
          counterRef.current.classList.remove('counter-defaul');
        } else if (timer.status === "stopped") {
          counterRef.current.classList.remove('counter-start');
          counterRef.current.classList.add('counter-stop');
          if (timer.currentPomodoro > 0) {
            counterRef.current.classList.add('counter-finish');
            counterRef.current.classList.remove('counter-defaul');
          } else {
            counterRef.current.classList.remove('counter-finish');
            counterRef.current.classList.add('counter-defaul');
          }
        } else if (timer.status === "paused") {
          counterRef.current.classList.remove('counter-start');
          counterRef.current.classList.add('counter-stop');
          if (timer.currentPomodoro > 0) {
            counterRef.current.classList.add('counter-finish');
            counterRef.current.classList.remove('counter-defaul');
          } else {
            counterRef.current.classList.remove('counter-finish');
            counterRef.current.classList.add('counter-defaul');
          }
        }
      }
    }
  }, [timer]);

  return (
    // Условное рендеринг всего counter
    (tasks.length > 0 && (  
      <div className="counter" ref={counterRef}>
        <div className="counter-head">
          <span className="counter-head__task">
            {currentTask?.title || "Нет текущей задачи"}
          </span>
          <div className="counter-head-tomatos">
            <span className="counter-head__current">
              Текущий помидор: {currentTask ? currentTask.pomodorosCompleted + 1 : 0}
            </span>
            <span className="counter-head__plan">
              Запланировано помидоров: {currentTask?.pomodorosPlanned || 0}
            </span>
          </div>
        </div>
  
        <div className="counter-main">
          <div className="counter-main__btn-wrapper">
            <button className="counter-main__btn-pomodoro" onClick={() => handleModeChange("pomodoro")}>Pomodoro</button>
            <button className="counter-main__btn-short" onClick={() => handleModeChange("short")}>Короткий перерыв</button>
            <button className="counter-main__btn-long" onClick={() => handleModeChange("long")}>Длинный перерыв</button>
          </div>
          <div className="counter-timer__btn-minutes">
            <button className="counter-timer__btn-min-add" onClick={handleAddMinutes}>Добавить минуту</button>
            <button className="counter-timer__btn-min-del" onClick={handleSubtractMinutes}>Убавить минуту</button>
          </div>
          <div className="counter-timer">
            <Timer
              currentMode={mode}
              onTimerEnd={handleTimerEnd} //  Передайте handleTimerEnd в Timer
              onStart={handleTimerStart}
              onPause={handleTimerPause}
              onSkip={handleSkip}
              onStop={handleStop}
              onPlaySound={playSound}
              onShowNotification={showNotification}
              totalSessionTime={totalSessionTime} 
              onUpdateTotalSessionTime={setTotalSessionTime} 
              onCounterClassChange={handleCounterClassChange} 
            />
          </div>
        </div>
  
        <button className="counter-settings" onClick={handleSettings}>Настройки</button>
        {isSettingsOpen && (
          <SettingsEdit onSettingsSave={handleSettingsSave} onClose={handleCloseSettings} />
        )}
        <div className="counter-footer"></div>
      </div>
    ))
  );
};

export default Counter;
