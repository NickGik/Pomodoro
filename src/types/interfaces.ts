// Структуры объектов данных
export interface ITask {
    id: string;
    title: string;
    pomodorosPlanned: number;
    pomodorosCompleted: number;
}

export interface ITimer {
    status: "running" | "paused" | "stopped";
    currentTaskId: string | null | undefined;
    pomodoroDuration: number;
    pomodoroLongBreak: number;
    pomodoroShortBreak: number;
    frequencyLongBreak: number;
    enableNotifications: boolean;
    mode: "pomodoro" | "short" | "long" | null | undefined;
    currentPomodoro: number;
    pauseTime?: number;
}


export interface IStatistics {
    id: string;
    date: string;
    totalSessionTime: number; 
    totalHoursWorked: number; 
    pauseTime: string;        
    breaksPomodoros: number,    
    breaksTaken: number;      
    breaksStoped: number;   
}

// Типы данных объектов
export type ITaskResponse = ITask[];
export type ITimerResponse = ITimer;
export type IStatisticsResponse = IStatistics[];


