import React from 'react'
import "./header.css"
import { Link } from 'react-router-dom'
import { MdAccountCircle } from "react-icons/md";
import AIAdvanced from '../ai/AIAdvanced';
import { UserData } from '../../context/UserContex';

function Header({ isAuth }) {
  const { user } = UserData();
  return (
    <header>
      <div className='logo'> EduBlaze </div>

      <div className='link'>
        <Link to="/"> Home </Link>
        <Link to="/courses"> Courses </Link>
        <Link to="/about"> About </Link>
        {isAuth && <AIAdvanced user={user} />}
        {
          isAuth ? (
            <Link to="/account"> <MdAccountCircle /> </Link>
          ) : (
            <Link to="/login"> Login </Link>
          )
        }
      </div>
    </header>
  )
}

export default Header
