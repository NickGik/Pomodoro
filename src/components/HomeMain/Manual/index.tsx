import { useTheme } from '../../../contexts/ThemeContext'; 

import './style.scss';

export const Manual = () => {
  const { theme } = useTheme(); 

    return (
        <>
            <div className={`manual ${theme === 'dark' ? 'dark-theme' : ''}`}> 
                <h2 className="manual__h2">Ура! Теперь можно начать работать:</h2>
                <ul className="manual__ul">
                    <li className="manual__li">
                        <p className="manual__text">Выберите категорию и напишите название текущей задачи</p>
                    </li>
                    <li className="manual__li">
                        <p className="manual__text">Запустите таймер («помидор»)</p>
                    </li>
                    <li className="manual__li">
                        <p className="manual__text">Работайте пока «помидор» не прозвонит</p>
                    </li>
                    <li className="manual__li">
                        <p className="manual__text">Сделайте короткий перерыв (3-5 минут)</p>
                    </li>
                    <li className="manual__li">
                        <p className="manual__text">Продолжайте работать «помидор» за «помидором», пока задача не будут выполнена. 
                            Каждые 4 «помидора» делайте длинный перерыв (15-30 минут).</p>
                    </li>
                </ul>
            </div>
        </>
    )
};