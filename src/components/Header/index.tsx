import { Logo } from "./Logo";
import { StatisticsLink } from "./StatisticsLink";
import { useTheme } from '../../contexts/ThemeContext'; 

import './style.scss';

export const Header = () => {
    const { theme } = useTheme();

    return (
        <header className={`header ${theme === 'dark' ? 'dark-theme' : ''}`}>
            <div className="container">
                <div className="header-wrapper">
                    <Logo />
                    <StatisticsLink />
                </div>
            </div>
        </header>
    )
}


