import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, postTasks, deleteTasks, putTasks } from '../api/TasksApi';
import { ITask, ITaskResponse } from '../types/interfaces';

const useTasks = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ITaskResponse>({
    queryFn: getTasks,
    queryKey: ['tasks'],
  });

  const tasks = data ?? [];

  const addTaskMutation = useMutation<ITask, unknown, ITask>({
    mutationFn: postTasks,
    onSuccess: (newTask) => {
      queryClient.setQueryData<ITaskResponse>(['tasks'], (oldTasks) => {
        return oldTasks ? [...oldTasks, newTask] : [newTask];
      });
    },
  });

  const deleteTaskMutation = useMutation<string, unknown, string>({
    mutationFn: deleteTasks,
    onSuccess: (deletedTaskId) => {
      queryClient.setQueryData<ITaskResponse>(['tasks'], (oldTasks) => {
        return oldTasks ? oldTasks.filter((task) => task.id !== deletedTaskId) : [];
      });
    },
  });

  const updateTaskMutation = useMutation<ITask, unknown, { id: string; updatedTask: Partial<ITask> }>({
    mutationFn: ({ id, updatedTask }) => putTasks(id, updatedTask),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<ITaskResponse>(['tasks'], (oldTasks) => {
        return oldTasks
          ? oldTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
          : [updatedTask];
      });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    addTask: addTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
  };
};

export default useTasks;
