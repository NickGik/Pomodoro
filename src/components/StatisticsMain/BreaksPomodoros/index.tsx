import { FC } from "react";

interface BreaksPomodorosProps {
    selectedDayData: any; 
}

export const BreaksPomodoros: FC<BreaksPomodorosProps> = ({ selectedDayData }) => {
    return (
        <div className="statistics-BreaksPomodoros">
            <div className="statistics-BreaksPomodoros-count">
                <img className="statistics-BreaksPomodoros-tomato" src='/public/tomato.svg' alt="Изображение томата" />
                <span className="statistics-BreaksPomodoros-count_X">X</span>
                <span className="statistics-BreaksPomodoros-count_numb">{selectedDayData?.breaksPomodoros || 0}</span> 
            </div>
            <div className='statistics-BreaksPomodoros-count-bottom'>
                <span className='statistics-BreaksPomodoros-count-bottom__numb'>{selectedDayData?.breaksPomodoros || 0}</span> 
                <span className='statistics-BreaksPomodoros-count-bottom__text'>помидора</span>
            </div>
        </div>
    )
}
