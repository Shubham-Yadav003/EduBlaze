import React from 'react'
import "./header.css"
import { Link } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";
import AIAdvanced from '../ai/AIAdvanced';
import { UserData } from '../../context/UserContex';
import { IoIosLogIn} from "react-icons/io";

function Header({ isAuth }) {
  const { user } = UserData();
  return (
    <header>
      <div className='logo'> EduBlaze </div>

      <div className='link'>
        <Link to="/"> Home </Link>
        <Link to="/courses">Courses </Link>
        <Link to="/about"> About </Link>
        {isAuth && <AIAdvanced user={user} />}
        {
          isAuth ? (
            <Link to="/account"> <MdAccountCircle /> </Link>
          ) : (
           <a className='login-link'> <Link to="/login"> <IoIosLogIn />Login </Link> </a>
          )
        }
      </div>
    </header>
  )
}

export default Header
