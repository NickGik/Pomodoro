import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDateStatistics,
  addDateStatistics,
  updateDateStatistics,
  getAllDailyStatistics,
} from '../api/StatisticsApi';
import { IStatistics } from '../types/interfaces';

const useStatistics = () => {
  const queryClient = useQueryClient();

  const getDailyStatisticsForDate = (date: string) => {
    const { data, isSuccess } = useQuery({
      queryKey: ['statistics_daily', date],
      queryFn: () => getDateStatistics(date),
      staleTime: Infinity,
    });
    if (isSuccess && data) {
      return data;
    }
  };

  const getAllDailyStatisticsQuery = useQuery({
    queryKey: ['statistics_daily'],
    queryFn: () => getAllDailyStatistics(),
    staleTime: Infinity,
  });


  const getDailyStatistics = (date: string) => {
    if (getAllDailyStatisticsQuery.isSuccess && getAllDailyStatisticsQuery.data) {
      const dailyStats = getAllDailyStatisticsQuery.data.find(
        (stats) => stats.date === date
      );
      if (dailyStats) {
        return { data: dailyStats, isSuccess: true }; 
      } else {
        console.log("Данные за дату", date, "не найдены:", getAllDailyStatisticsQuery.data);
      }
    } else {
      console.log("Ошибка при получении статистики:", getAllDailyStatisticsQuery.error);
    }
    return { data: null, isSuccess: false }; 
  };
  

  const addStatisticsMutation = useMutation({
    mutationFn: (data: { date: string, stats: IStatistics }) => addDateStatistics(data.date, data.stats),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics_daily'] });
    },
  });

  const updateStatisticsMutation = useMutation({
    mutationFn: (data: { date: string, updatedStats: Partial<IStatistics> }) => {
      const dailyStats = getAllDailyStatisticsQuery.data?.find(
        (stats) => stats.date === data.date
      );
      if (dailyStats) {
        return updateDateStatistics(dailyStats.id, data.updatedStats);
      } else {
        throw new Error('Statistics for the given date not found');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics_daily'] }); 
    },
  });

  return {
    getDailyStatistics,
    getDailyStatisticsForDate,
    addDateStatistics: addStatisticsMutation.mutate,
    updateDateStatistics: updateStatisticsMutation.mutate,
    getDateStatistics: getAllDailyStatisticsQuery, 
    isLoadingAllDailyStatistics: getAllDailyStatisticsQuery.isLoading, 
  };
};

export default useStatistics;