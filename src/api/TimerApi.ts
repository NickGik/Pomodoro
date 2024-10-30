import { ITimer } from "../types/interfaces";
import { validateResponse } from "../hooks/validateResponse";

const API_URL = 'http://localhost:3000';

export const getTimer = async (): Promise<ITimer> => {
    try {
        const response = await fetch(`${API_URL}/timer`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        validateResponse(response);

        if (!response.ok) {
            throw new Error('Error fetching timer');
        }

        const data: ITimer = await response.json();
        return data;
    } catch (error) {
        console.log("Ошибка при запросе к данным", error);
        throw error;
    }
}


export const addTimer = async (): Promise<ITimer> => {
    try {
        const response = await fetch(`${API_URL}/timer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
       .then(validateResponse)
        if (!response.ok) {
            throw new Error('Error fetching tasks');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Ошибка при запросе к данным", error);
        throw error;
    }
}


export const updateTimer = async (timerData: ITimer): Promise<ITimer> => {
    try {
        const response = await fetch(`${API_URL}/timer`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timerData) 
        });
        
        if (!response.ok) {
            throw new Error('Error updating timer');
        }
        
        const updatedTimer: ITimer = await response.json();
        return updatedTimer;
    } catch (error) {
        console.error("Ошибка при обновлении таймера", error);
        throw error;
    }
};


export const updateTimerSettings = async (timerSettings: ITimer): Promise<ITimer> => {
    console.log("TimerApi: Обновление настроек", timerSettings);
    try {
      const response = await fetch(`${API_URL}/timer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(timerSettings) // Отправьте все настройки
      });
  
      if (!response.ok) {
        throw new Error('Error updating timer settings');
      }
  
      const updatedTimerSettings: ITimer = await response.json();
      return updatedTimerSettings;
    } catch (error) {
      console.error("Ошибка при обновлении настроек таймера", error);
      throw error;
    }
  };
  





