import React from 'react'
import "./common.css"
import { FaBook, FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
// import { IoIosLogOut } from "react-icons/io";

import { Link } from 'react-router-dom'
import { UserData } from '../../context/UserContex';
function Sidebar() {
    const { user } = UserData();
    return (
        <div className='sidebar'>
            <ul>
                <li>
                    <Link to={'/admin/dashboard'}>
                        <div className="icon">
                            <FaHome />
                        </div>
                        <span>Home</span>

                    </Link>
                </li>


                <li>
                    <Link to={'/admin/course'}>
                        <div className="icon">
                            <FaBook />
                        </div>
                        <span>Courses</span>

                    </Link>
                </li>


                {
                    user && user.mainrole === "superadmin" && (
                        <li>
                            <Link to={'/admin/users'}>
                                <div className="icon">
                                    <FaUser />
                                </div>
                                <span>Users</span>

                            </Link>
                        </li>
                    )
                }


                <li>
                    <Link to={'/account'}>
                        <div className="icon">
                            <FaSignOutAlt />
                        </div>
                        <span>Logout</span>

                    </Link>
                </li>
            </ul>

        </div>
    )
}

export default Sidebar
