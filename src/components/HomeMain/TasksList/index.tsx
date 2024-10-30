import { FC } from "react";
import Api from "../../../api/api";
import { Task } from "../Task";
import { ITaskResponse } from "../../../types/interfaces";
import { queryClient } from "../../../hooks/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../../../contexts/ThemeContext";

import './style.scss';

export const TasksList: FC = () => {
    const { theme } = useTheme();
    const { data, isLoading } = useQuery<ITaskResponse>({
        queryFn: () => Api.getTasks(),
        queryKey: ['tasks'],
    },
    queryClient
    )

   if (isLoading) {
    return <h2 className="task__h2">Загрузка...</h2>
   }

    return (
        <div className="task-list">

            <ul className={`task-list__ul ${theme === 'dark' ? 'dark-theme' : ''}`}>
                {data?.map((task, index) => (
                    <li className="task-list__item" key={task.id}>
                        <Task task={task} index={index + 1} />
                    </li>
                ))}
            </ul>
        </div>
    )
};
