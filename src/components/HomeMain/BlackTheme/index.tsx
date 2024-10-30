import { FC } from "react";
import { useTheme } from '../../../contexts/ThemeContext'; 

import './style.scss';

export const BlackTheme: FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`black-theme-content ${theme === 'dark' ? 'dark-theme' : ''}`}> 
      <div className="black-theme-wrapper">
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? 'Выбрать' : 'Светлая тема'}
          </button>
      </div>
    </div>
  );
};

