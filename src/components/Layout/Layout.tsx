import { Header } from "../Header";
import { FC, ReactNode } from "react";
import { Outlet } from "react-router";
import { useTheme } from '../../contexts/ThemeContext'; 

import "./style.scss";

type Props = {
	children?: ReactNode[];
};


const Layout: FC<Props> = () => {
    const { theme } = useTheme();

    return (
        <>
			<div className={`desk ${theme === 'dark' ? 'dark-theme' : ''}`}>
                <Header />
                <main className="content">
                    <Outlet />
                </main>
            </div>

		</>
    )
}

export default Layout;


