import { IStatistics } from "../types/interfaces";
import { validateResponse } from "../hooks/validateResponse";

const API_URL = 'http://localhost:3000';

//Для получения текущей даты если она есть 
export const getDateStatistics = async (date: string): Promise<IStatistics | null> => {
    try {
        const response = await fetch(`${API_URL}/statistics_daily?date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 404) {
            console.log(`No statistics found for date: ${date}`);
            return null;
        }

        await validateResponse(response);

        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.log("Ошибка при запросе к данным", error);
        throw error;
    }
};

//Добавление статистики за определённую дату
export const addDateStatistics = async (date: string, stats: IStatistics): Promise<void> => {
    try {
        const { date: statsDate, ...statsWithoutDate } = stats;

        const data = { date, ...statsWithoutDate }; 

        const response = await fetch(`${API_URL}/statistics_daily`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log(`Response status: ${response.status}`);
        await validateResponse(response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error adding statistics: ${response.status} ${errorText}`);
        }
    } catch (error) {
        console.log("Ошибка при добавлении данных", error);
        throw error;
    }
};

// Получение всех записей статистики daily
export const getAllDailyStatistics = async (): Promise<IStatistics[]> => {
    try {
      const response = await fetch(`${API_URL}/statistics_daily`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      await validateResponse(response);
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Ошибка при запросе к данным", error);
      throw error;
    }
};

export const updateDateStatistics = async (id: string, updatedStats: Partial<IStatistics>): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/statistics_daily/${id}`, { // Используем id
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStats),
      });
  
      await validateResponse(response); 
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating statistics: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error); 
      throw error;
    }
  };











