import { FC, useEffect, useRef } from "react";
import { Chart } from 'chart.js/auto';
import useStatistics from '../../../hooks/useStatistics';

import './style.scss';

interface ActivityChartProps {
  selectedPeriod: string;
  handleDayClick: (dayData: any) => void;
}

interface DayData {
  id: string;
  date: string;
  totalSessionTime: number;
  totalHoursWorked: number;
  pauseTime: string;
  breaksPomodoros: number;
  breaksTaken: number;
  breaksStoped: number;
}

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const ActivityChart: FC<ActivityChartProps> = ({ selectedPeriod, handleDayClick }) => {
  const { getDateStatistics } = useStatistics();
  const { data: statisticsData, isLoading: isLoadingAllDailyStatistics } = getDateStatistics;

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (statisticsData && selectedPeriod) {
      const filteredData = filterDataByPeriod(statisticsData, selectedPeriod);
      const { formattedData, dateMap } = formatData(filteredData);
      renderChart(formattedData, dateMap);
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [statisticsData, selectedPeriod]);

  const getStartAndEndOfWeek = (today: Date): [Date, Date] => {
    const DAYS_IN_WEEK = 7;
    const currentDayOfWeek = today.getDay();
    const daysToMonday = currentDayOfWeek === 0 ? DAYS_IN_WEEK - 1 : currentDayOfWeek - 1;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + DAYS_IN_WEEK - 1);
    endOfWeek.setHours(23, 59, 59, 999);
    return [startOfWeek, endOfWeek];
  };

  const filterDataByPeriod = (data: DayData[], period: string): DayData[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [startOfWeek, endOfWeek] = getStartAndEndOfWeek(today);

    switch (period) {
      case 'this-week':
        return data.filter(d => {
          const date = new Date(d.date);
          return date >= startOfWeek && date <= endOfWeek;
        });
      case 'last-week':
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const endOfLastWeek = new Date(endOfWeek);
        endOfLastWeek.setDate(endOfLastWeek.getDate() - 7);
        return data.filter(d => {
          const date = new Date(d.date);
          return date >= startOfLastWeek && date <= endOfLastWeek;
        });
      case 'two-week-ago':
        const startOfTwoWeeksAgo = new Date(startOfWeek);
        startOfTwoWeeksAgo.setDate(startOfTwoWeeksAgo.getDate() - 14);
        const endOfTwoWeeksAgo = new Date(endOfWeek);
        endOfTwoWeeksAgo.setDate(endOfTwoWeeksAgo.getDate() - 14);
        return data.filter(d => {
          const date = new Date(d.date);
          return date >= startOfTwoWeeksAgo && date <= endOfTwoWeeksAgo;
        });
      default:
        return [];
    }
  };

  const formatData = (data: DayData[]) => {
    const result = new Array(7).fill(0);
    const dateMap: Record<number, string> = {};

    data.forEach(dayData => {
      const dayIndex = new Date(dayData.date).getDay();
      const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; 
      result[adjustedDayIndex] = dayData.totalSessionTime;
      dateMap[adjustedDayIndex] = dayData.date;
    });

    return { formattedData: result, dateMap };
  };

  const renderChart = (data: number[], dateMap: Record<number, string>) => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      const newChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: daysOfWeek,
          datasets: [{
            label: 'Total Session Time (мин)',
            data: data.map(time => time / 60),
            backgroundColor: 'rgba(234, 138, 121, 1)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          onClick: (_, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const selectedDate = dateMap[index];
              const selectedDayData = statisticsData?.find(day => day.date === selectedDate);
              handleDayClick(selectedDayData);
            }
          }
        }
      });

      chartInstanceRef.current = newChart;
    }
  };

  return (
    <div className="statistics-ActivityChart">
      {isLoadingAllDailyStatistics && <div className="loader">Загрузка...</div>}
      <canvas ref={chartRef} id="myChart"></canvas>
    </div>
  );
};

export default ActivityChart;




