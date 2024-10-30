import { FC, useState } from "react";
import { Manual } from "../../components/HomeMain/Manual";
import { TasksList } from "../../components/HomeMain/TasksList";
import { FormTask }  from "../../components/HomeMain/FormTasks";
import { Counter } from "../../components/HomeMain/Counter";
import { BlackTheme } from "../../components/HomeMain/BlackTheme";

import './style.scss';

const HomePage: FC<{ theme: string }> = ({ theme }) => { 
    const [tasks] = useState<any[]>([]);

    return (
        <>
            <div className={`container ${theme === 'dark' ? 'dark-theme' : ''}`}> 
                <BlackTheme />
                <div className="content-page">
                    <div className="tasks">
                        <Manual />
                        <FormTask />
                        <TasksList />
                    </div>
                    <div className="timer-block">
                        <Counter tasks={tasks} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage;

