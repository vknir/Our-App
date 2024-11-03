import './Header.css'
import { NavLink } from 'react-router-dom'


function Header(){
    return <nav>
        <NavLink to='/'>
            <p>Our App</p>
        </NavLink>


        <form>
            <input type='text' placeholder='Username'></input>
            <input type='password' placeholder='Password'></input>
            <button type='submit'>Login</button>
        </form>
    </nav>
}

export default Header