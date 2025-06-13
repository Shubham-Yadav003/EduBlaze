import React from 'react';
import './account.css';
import { MdDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { UserData } from '../../context/UserContex.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Account({user}) {
    const {setIsAuth, setUser} = UserData();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.clear();
        setIsAuth(false);
        setUser([]);
        toast.success("Logout Successfully");
    }
  return (
    <div>
      {user && (
        <div className="profile">
          <h2>My Profile</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            
            <div className="button-container">
              <button onClick={()=>navigate(`/${user._id}/dashboard`)} className='common-btn'><MdDashboard /> Dashboard</button>

              {
                user.role === "admin" && (
                   <button onClick={()=>navigate(`/admin/dashboard`)} className='common-btn'><MdDashboard /> Admin Dashboard</button>
             
                )
              }

              <button onClick={logoutHandler} className='common-btn logout-btn'><IoIosLogOut /> Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;