import { FC } from "react";

import './style.scss';

interface SummaryProps {
    selectedDayData: any; 
}

export const Summary: FC<SummaryProps> = ({ selectedDayData }) => {
    const pauseTime = selectedDayData?.pauseTime || "00:00:00";
    const [hoursStr, minutesStr, secondsStr] = pauseTime.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);

    const pauseInMinutes = hours * 60 + minutes + Math.round(seconds / 60);

    const totalSessionTime = selectedDayData?.totalSessionTime || 0;
    const totalHoursWorked = selectedDayData?.totalHoursWorked || 0;

    const focusRatio = totalHoursWorked > 0 ? Math.floor((totalHoursWorked / totalSessionTime) * 100) : 0;

    return (
        <div className="statistics-summary">
            <div className="statistics-summary-focus">
                <h3 className="statistics-summary-focus__h3">Фокус</h3>
                <span className="statistics-summary-focus__span">{focusRatio}%</span>
            </div>
            <div className="statistics-summary-paused">
                <h3 className="statistics-summary-paused__h3">Время на паузе</h3>
                <span className="statistics-summary-paused__span">{pauseInMinutes}м</span>
            </div>
            <div className="statistics-summary-stoped">
                <h3 className="statistics-summary-stoped__h3">Остановки</h3>
                <span className="statistics-summary-stoped__span">{selectedDayData?.breaksPomodoros || 0}</span>
            </div>
        </div>
    )
}
