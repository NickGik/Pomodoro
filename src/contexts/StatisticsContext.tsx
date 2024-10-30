import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import Api from '../api/api';
import { IStatistics, ITimer, ITask } from '../types/interfaces';

interface StatisticsContextProps {
    dailyStatistics: IStatistics | null; 
    setDailyStatistics: React.Dispatch<React.SetStateAction<IStatistics | null>>; 
}

const StatisticsContext = createContext<StatisticsContextProps | undefined>(undefined);

interface StatisticsProviderProps {
    children: ReactNode; 
}

export const StatisticsProvider: FC<StatisticsProviderProps> = ({ children }) => {
    const [dailyStatistics, setDailyStatistics] = useState<IStatistics | null>(null); 

    useEffect(() => {
        const fetchDailyStatistics = async () => {
            const currentDate = new Date().toISOString().split('T')[0]; 
            console.log(`Fetching statistics for date: ${currentDate}`); 
            try {
                let stats = await Api.getDateStatistics(currentDate); 
                if (!stats) { 
                    console.log(`No statistics found for date: ${currentDate}, adding new stats.`);
                    const newStats: IStatistics = { 
                        id: Math.random().toString(36).slice(2, 9),
                        date: currentDate,
                        totalSessionTime: 0,
                        totalHoursWorked: 0,
                        pauseTime: '00:00:00',
                        breaksPomodoros: 0,
                        breaksTaken: 0,
                        breaksStoped: 0
                    };
                    await Api.addDateStatistics(currentDate, newStats); 
                    stats = newStats; 
                }
                setDailyStatistics(stats); 

                const timer: ITimer = await Api.getTimer();
                if (!timer.currentTaskId) { 
                    const tasks: ITask[] = await Api.getTasks(); 
                    if (tasks.length > 0) {
                        timer.currentTaskId = tasks[0].id; 
                        await Api.updateTimer(timer); 
                    }
                }

            } catch (error) {
                console.error("Ошибка при получении или добавлении статистики", error); 
            }
        };

        fetchDailyStatistics(); 
    }, []); 

    return (
        <StatisticsContext.Provider value={{ dailyStatistics, setDailyStatistics }}>
            {children}
        </StatisticsContext.Provider>
    );
};

export const useStatistics = () => {
    const context = useContext(StatisticsContext); 
    if (!context) { 
        throw new Error('useStatistics must be used within a StatisticsProvider');
    }
    return context; 
};
