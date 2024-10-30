import { Link } from "react-router-dom";
import './style.scss';

 export const Logo = () => {
    return (
        <Link to="/"  className="logo">
            <img className='logo__img' src="logo.png" alt="logo" />
            <h1 className="logo__title">pomodoro_box</h1>
        </Link>
    )
 }