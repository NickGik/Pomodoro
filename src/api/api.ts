import { getTasks, postTasks, deleteTasks, putTasks } from "./TasksApi";
import { getDateStatistics, 
		 addDateStatistics, 
		 getAllDailyStatistics, 
		 updateDateStatistics
		} from "./StatisticsApi";
import { getTimer, addTimer, updateTimer } from "./TimerApi";

const Api = {
	//Api для задач
	getTasks,
	postTasks,	
	deleteTasks,
	putTasks,
	//Api для таймера
	getTimer,
	addTimer, 
	updateTimer,
    //Api для статистики
	getDateStatistics,
	addDateStatistics,
	getAllDailyStatistics,
	updateDateStatistics,
};

export default Api;


