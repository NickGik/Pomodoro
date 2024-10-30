import { FC, useState, useEffect, MouseEventHandler } from 'react';
import Api from '../../../api/api';
import { ModalDel } from '../ModalDel';
import { ModalEdit } from '../ModalEdit'; 
import { ITask, ITaskResponse } from '../../../types/interfaces';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../hooks/queryClient';
import { useTheme } from '../../../contexts/ThemeContext';

import './style.scss';

interface EditTaskProps {
    task: ITask;
}

export const EditTask: FC<EditTaskProps> = ({ task }) => {
    const { theme } = useTheme(); 
    const [menuOpen, setMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [showEditModal, setEditModal] = useState(false); 

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (!(event.target as HTMLElement).closest('.task-btn') && !(event.target as HTMLElement).closest('.task-menu')) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    const deleteTaskMutation  = useMutation({
        mutationFn: () => Api.deleteTasks(task.id),
        onSuccess: () => {
            console.log('Задача успешно удалена');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setMenuOpen(false);
        },
        onError: (error) => {
            console.log('Ошибка при удалении задачи', error);
        }
    },
    queryClient);

    const increaseTomatoMutation = useMutation({
        mutationFn: async () => {
            const newTask = { ...task, pomodorosPlanned: task.pomodorosPlanned + 1 };
            await Api.putTasks(task.id, newTask);
            return newTask;
        },
        onSuccess: (data) => {
            console.log('Задача успешно увеличена', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            console.log('Ошибка при увеличении задачи', error);
        }
    },
    queryClient);

    const decreaseTomatoMutation = useMutation({
        mutationFn: async () => {
            const newPomodoros = Math.max(1, task.pomodorosPlanned - 1); // Ensure pomodoros never go below 1
            const newTask = { ...task, pomodorosPlanned: newPomodoros };
            await Api.putTasks(task.id, newTask);
            return newTask;
        },
        onSuccess: (data) => {
            console.log('Задача успешно уменьшена', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            console.log('Ошибка при уменьшении задачи', error);
        }
    },
    queryClient);
    

    const { data: taskData } = useQuery<ITaskResponse>({
        queryFn: () => Api.getTasks(),
        queryKey: ['tasks'],
    },
    queryClient);

    useEffect(() => {
        if (taskData) {
        }
    }, [taskData]);

    const editTaskMutation = useMutation({
        mutationFn: async (updatedTask: ITask) => {
            await Api.putTasks(task.id, updatedTask);
            return updatedTask;
        },
        onSuccess: (data) => {
            console.log('Задача успешно изменена', data);
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    },
    queryClient);

    const decreaseAction: MouseEventHandler<HTMLButtonElement> = () => {
        decreaseTomatoMutation.mutate();
    };

    const increaseAction: MouseEventHandler<HTMLButtonElement> = () => {
        increaseTomatoMutation.mutate();
    };

    const deleteAction: MouseEventHandler<HTMLButtonElement> = () => {
        setShowDeleteModal(true);
    };

    const hanleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const hanleDeleteConfirm = () => {
        deleteTaskMutation.mutate();
        setShowDeleteModal(false);
    };

    const editAction: MouseEventHandler<HTMLButtonElement> = () => {
        setEditModal(true);
    };

    const handleEditCancel = () => {
        setEditModal(false);
    };

    const handleEditSave = (updatedTask: Partial<ITask>) => {
        if (updatedTask.id) {
            editTaskMutation.mutate(updatedTask as ITask);
            setEditModal(false);
        } else {
            console.error("ID задачи отсутствует или не является строкой");
        }
    };

    return (
        <div>
            <div className={`task-btn-wrapper ${theme === 'dark' ? 'dark-theme' : ''}`}>
                <button className='task-btn' onClick={toggleMenu} type="button">...</button>
                {menuOpen && (
                    <ul className="task-menu">
                        <li className="task-menu__item">
                            <button className="task-menu__btn" onClick={decreaseAction}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.75 4.25H7.25V7.25H4.25V8.75H7.25V11.75H8.75V8.75H11.75V7.25H8.75V4.25ZM8 0.5C3.8675 0.5 0.5 3.8675 0.5 8C0.5 12.1325 3.8675 15.5 8 15.5C12.1325 15.5 15.5 12.1325 15.5 8C15.5 3.8675 12.1325 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z" fill="#EC9794"/>
                                </svg>
                                Уменьшить
                            </button>
                        </li>
                        <li className="task-menu__item">
                            <button className="task-menu__btn" onClick={increaseAction}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0.5C3.8675 0.5 0.5 3.8675 0.5 8C0.5 12.1325 3.8675 15.5 8 15.5C12.1325 15.5 15.5 12.1325 15.5 8C15.5 3.8675 12.1325 0.5 8 0.5ZM8 14C4.6925 14 2 11.3075 2 8C2 4.6925 4.6925 2 8 2C11.3075 2 14 4.6925 14 8C14 11.3075 11.3075 14 8 14Z" fill="#EC9794"/>
                                <path d="M4.25 7.25H7.25H8.75H11.75V8.75H8.75H7.25H4.25V7.25Z" fill="#EC9794"/>
                                </svg>
                                Увеличить
                            </button>
                        </li>
                        <li className="task-menu__item">
                            <button className="task-menu__btn" onClick={editAction}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.545 4.765L9.235 5.455L2.44 12.25H1.75V11.56L8.545 4.765ZM11.245 0.25C11.0575 0.25 10.8625 0.325 10.72 0.4675L9.3475 1.84L12.16 4.6525L13.5325 3.28C13.825 2.9875 13.825 2.515 13.5325 2.2225L11.7775 0.4675C11.6275 0.3175 11.44 0.25 11.245 0.25ZM8.545 2.6425L0.25 10.9375V13.75H3.0625L11.3575 5.455L8.545 2.6425Z" fill="#EC9794"/>
                            </svg>
                                Редактировать
                            </button>
                        </li>
                        <li className="task-menu__item">
                            <button className="task-menu__btn" onClick={deleteAction}>
                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 4.75V12.25H3V4.75H9ZM7.875 0.25H4.125L3.375 1H0.75V2.5H11.25V1H8.625L7.875 0.25ZM10.5 3.25H1.5V12.25C1.5 13.075 2.175 13.75 3 13.75H9C9.825 13.75 10.5 13.075 10.5 12.25V3.25Z" fill="#EC9794"/>
                            </svg>
                                Удалить
                            </button>
                        </li>
                    </ul>
                )}
            </div>
            <ModalDel
                title="Подтвердить удаление"
                isOpen={showDeleteModal}
                onCancel={hanleDeleteCancel}
                onConfirm={hanleDeleteConfirm}
            />
            <ModalEdit
                title="Редактирование задачи"
                isOpen={showEditModal}
                onCancel={handleEditCancel}
                onConfirm={handleEditSave}
                task={task}
            />
        </div>
    );
};
