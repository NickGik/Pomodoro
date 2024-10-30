import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTimer, addTimer, updateTimer, updateTimerSettings } from '../api/TimerApi';
import { ITimer } from '../types/interfaces';

const useTimer = () => {
  const queryClient = useQueryClient();

  const { data: timer, isLoading, error } = useQuery({
    queryKey: ['timer'],
    queryFn: getTimer,
    staleTime: Infinity, 
  });

  const updateTimerMutation = useMutation({
    mutationFn: updateTimer,
    onSuccess: (updatedTimer) => {
      queryClient.setQueryData(['timer'], updatedTimer);
    },
  });

  const addTimerMutation = useMutation({
    mutationFn: addTimer,
    onSuccess: (newTimer) => {
      queryClient.setQueryData(['timer'], newTimer);
    },
  });

const updateTimerSettingsMutation = useMutation({
  mutationFn: updateTimerSettings,
  onSuccess: (updatedTimerSettings) => {
    queryClient.setQueryData(['timer'], (oldTimer: ITimer) => ({
      ...oldTimer, 
      ...updatedTimerSettings 
    }));
  },
});

  return {
    timer,
    isLoading,
    error,
    updateTimer: updateTimerMutation.mutate,
    addTimer: addTimerMutation.mutate,
    updateTimerSettings: updateTimerSettingsMutation.mutate
  };
};

export default useTimer;