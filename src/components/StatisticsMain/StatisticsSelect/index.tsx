import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface StatisticsSelectProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
}

export const StatisticsSelect: React.FC<StatisticsSelectProps> = ({ selectedPeriod, setSelectedPeriod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && event.target instanceof HTMLElement && !event.target.closest('.statistics-activity__select-wrapper')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`select ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className={`statistics-activity__select-wrapper ${isOpen ? 'open' : ''}`}>
        <select 
          className="statistics-activity__select"
          name="sorting" 
          id="sorting"
          value={selectedPeriod}
          onChange={handleChange} 
          onClick={handleClick}
        >
          <option className="statistics-activity__option" value="this-week">Эта неделя</option>
          <option className="statistics-activity__option" value="last-week">Прошлая неделя</option>
          <option className="statistics-activity__option" value="two-week-ago">2 недели назад</option>
        </select>
        <span className="arrow" /> 
      </div>
    </div>
  );
};
