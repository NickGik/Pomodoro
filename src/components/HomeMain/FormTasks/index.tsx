import React, { FC, useState } from "react";
import Api from "../../../api/api";
import { ITask, ITimer } from "../../../types/interfaces";
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../../contexts/ThemeContext';
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../hooks/queryClient";

import './style.scss';

export const FormTask: FC = () => {
    const { theme } = useTheme();
    const [taskTitle, setTaskTitle] = useState<string>("");
    const [taskTomato, setTaskTomato] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { data: tasks, refetch: refetchTasks } = useQuery({
        queryKey: ['tasks'],
        queryFn: Api.getTasks
    });
    const { data: timer, refetch: refetchTimer } = useQuery({
        queryKey: ['timer'],
        queryFn: Api.getTimer
    });

    const createMutation = useMutation({
        mutationFn: (data: ITask) => Api.postTasks(data),
        onSuccess: async (newTask) => {
            await queryClient.invalidateQueries({ queryKey: ['tasks'] });
            await queryClient.invalidateQueries({ queryKey: ['timer'] });

            refetchTasks();
            refetchTimer();

            if (!tasks || tasks.length === 0) {
                if (!timer) return;

                const updatedTimer: ITimer = {
                    ...timer,
                    currentTaskId: newTask.id,
                    status: "stopped",
                    pomodoroDuration: timer.pomodoroDuration ?? 25,
                    pomodoroLongBreak: timer.pomodoroLongBreak,
                    pomodoroShortBreak: timer.pomodoroShortBreak,
                    frequencyLongBreak: timer.frequencyLongBreak,
                    enableNotifications: timer.enableNotifications
                };
                await Api.updateTimer(updatedTimer);
                await queryClient.invalidateQueries({ queryKey: ['timer'] });
            }

            setIsSubmitting(false);
            setTaskTitle("");
            setTaskTomato("");
        },
        onError: (error) => {
            console.error("Error adding task:", error);
            setIsSubmitting(false);
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!taskTitle || !taskTomato || isSubmitting) return;
        setIsSubmitting(true);

        const tomatoNumber = parseInt(taskTomato);
        if (isNaN(tomatoNumber)) {
            setIsSubmitting(false);
            return;
        }

        const newTask: ITask = {
            id: uuidv4(),
            title: taskTitle,
            pomodorosPlanned: tomatoNumber,
            pomodorosCompleted: 0
        };

        try {
            await createMutation.mutateAsync(newTask);
        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            setIsSubmitting(false);
            setTaskTitle("");
            setTaskTomato("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.target.value);
    };

    const handleTomatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTomato(e.target.value);
    };

    return (
        <form className={`form ${theme === 'dark' ? 'dark-theme' : ''}`} onSubmit={handleSubmit}>
            <input
                className="form__input-name"
                type="text"
                placeholder="Название задачи"
                value={taskTitle}
                onChange={handleInputChange}
            />
            <input
                className="form__input-count"
                type="number"
                placeholder="Кол-во помидорок"
                value={taskTomato}
                onChange={handleTomatoChange}
            />
            <button className="form__btn" type="submit" disabled={isSubmitting}>Добавить</button>
        </form>
    );
};

export default FormTask;
