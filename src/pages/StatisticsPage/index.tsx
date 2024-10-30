import { FC, useState } from "react";
import ActivityChart from '../../components/StatisticsMain/ActivityChart';
import { DayDetails } from '../../components/StatisticsMain/DayDetails';
import { Summary } from '../../components/StatisticsMain/Summary';
import { BreaksPomodoros } from "../../components/StatisticsMain/BreaksPomodoros";
import { StatisticsSelect } from "../../components/StatisticsMain/StatisticsSelect";
import { useTheme } from "../../contexts/ThemeContext";
import { BlackTheme } from "../../components/HomeMain/BlackTheme";

import './style.scss';

const StatisticsPage: FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this-week');
  const [selectedDayData, setSelectedDayData] = useState<any>(null); 

  const handleDayClick = (dayData: any) => {
    setSelectedDayData(dayData); 
  };

  return (
    <main className={`statistics ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="container">
      <BlackTheme />
        <div className="statistics-wrapper">
          <div className="statistics-activity">
            <h2 className="statistics-activity__h1">Ваша активность</h2>
            <StatisticsSelect 
              selectedPeriod={selectedPeriod} 
              setSelectedPeriod={setSelectedPeriod} 
            />
          </div>
          <DayDetails selectedDayData={selectedDayData} />
          <BreaksPomodoros selectedDayData={selectedDayData} />
          <ActivityChart selectedPeriod={selectedPeriod} handleDayClick={handleDayClick} />
          <Summary selectedDayData={selectedDayData} />
        </div>
      </div>
    </main>
  );
};

export default StatisticsPage;