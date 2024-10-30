import { createContext, ReactNode, useContext } from "react";
import { ITimer } from "../types/interfaces"; 
import useTimer from "../hooks/useTimer";

interface TimerContextType {
    timerSettings: ITimer | undefined;
    updateTimer: (newSettings: ITimer) => void; //  Сохраняем updateTimer в контексте 
    isLoading: boolean;
    error: string | null;
  }
  
  const TimerContext = createContext<TimerContextType>({
    timerSettings: undefined, 
    updateTimer: () => {},
    isLoading: true,
    error: null,
  });
  
  export const TimerContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { timer: timerSettings, isLoading, error, updateTimer } = useTimer(); 
  
    return (
      <TimerContext.Provider value={{ 
        timerSettings, 
        updateTimer, // Передача updateTimer в контекст 
        isLoading, 
        error: error ? error.message : null  
      }}>
        {children}
      </TimerContext.Provider>
    );
  };
  
  export const useTimerContext = () => {
    const context = useContext(TimerContext);
    if (!context) {
      throw new Error("useTimerContext must be used within a TimerContextProvider");
    }
    return context;
  };
