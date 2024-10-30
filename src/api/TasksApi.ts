import { ITask, ITaskResponse } from "../types/interfaces";
import { validateResponse } from "../hooks/validateResponse";

const API_URL = 'http://localhost:3000';

// Запрос к серверу для получения данных о задачах
export const getTasks = async (): Promise<ITaskResponse> => {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(validateResponse);
        if (!response.ok) {
            throw new Error('Ошибка при получении задач');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Ошибка при запросе к данным", error);
        throw error;
    }
};

// Работа со списком задач (добавить)
export const postTasks = async (newTask: ITask): Promise<ITask> => {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
        .then(validateResponse);

        if (!response.ok) {
            throw new Error('Ошибка при создании задачи');
        }
        const data = await response.json();
        return data; // Предполагается, что возвращается одна задача ITask
    } catch (error) {
        console.log("Ошибка при создании задачи", error);
        throw error;
    }
};

// Работа со списком задач (удалить)
export const deleteTasks = async (id: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(validateResponse);
        if (!response.ok) {
            throw new Error('Ошибка при удалении задачи');
        }
        return id; // Возвращаем ID удаленной задачи
    } catch (error) {
        console.log("Ошибка при удалении задачи", error);
        throw error;
    }
};

// Работа со списком задач (редактировать)
export const putTasks = async (id: string, updatedTask: Partial<ITask>): Promise<ITask> => {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        })
        .then(validateResponse);
        if (!response.ok) {
            throw new Error('Ошибка при обновлении задачи');
        }
        const data = await response.json();
        return data; // Предполагается, что возвращается обновленная задача ITask
    } catch (error) {
        console.log("Ошибка при обновлении задачи", error);
        throw error;
    }
};
