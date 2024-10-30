import { FC } from 'react';

import './style.scss';

interface TotalHoursWorkedProps {
    selectedDayData: any;
}

export const DayDetails: FC<TotalHoursWorkedProps> = ({ selectedDayData }) => {
    const totalSeconds = selectedDayData?.totalHoursWorked || 0;
    const totalSessionTime = selectedDayData?.totalSessionTime || 1;  

    const focusRatio = Math.min((totalSeconds / totalSessionTime) * 100, 100);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const dayOfWeek = () => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const date = new Date(selectedDayData?.date); 
        return days[date.getDay()];
    };

    console.log("focusRatio", focusRatio); 

    return (
        <div className="statistics-DayDetails">
            <h3 className="statistics-DayDetails__h3">{dayOfWeek() || 'День недели'}</h3> 
            <p className="statistics-DayDetails__text">
                Вы работали над задачами в течение: 
                <span className='statistics-DayDetails__span'>{hours} ч {minutes} м</span>
            </p>
        </div>
    );
};
