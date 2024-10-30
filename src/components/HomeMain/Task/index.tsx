import { FC } from "react";
import { ITask } from "../../../types/interfaces";
import { EditTask } from "../EditTask";
import { useTheme } from "../../../contexts/ThemeContext";

import './style.scss';

interface TaskProps {
    task: ITask;
    index: number;
}

export const Task: FC<TaskProps> = ({ task, index }) => {
    const { theme } = useTheme();

    return (
        <> 
            <div className={`task-content ${theme === 'dark' ? 'dark-theme' : ''}`}>
                <div>
                    <span className="task-index">{index}</span>
                </div>
                <div className="task">
                    <div className="task-item">
                        <p className="task-item__title">{task.title}</p>
                        <EditTask task={task} />
                    </div>
                    <div className="task-param">
                        <img className="task-param__img" src="/public/logo.png" alt="Картинка томата" />
                        <span className="task-param__count">{task.pomodorosPlanned}</span>
                    </div>
                </div>
            </div>
        </>
    )
}


