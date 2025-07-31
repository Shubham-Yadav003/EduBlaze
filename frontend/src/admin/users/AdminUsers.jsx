import React, { useEffect, useState } from 'react'
import "./users.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { server } from '../../main';
import Layout from '../utils/Layout';
import toast from 'react-hot-toast';
function AdminUsers({ user }) {
    const navigate = useNavigate();
    
    useEffect(() => {
    if (user && user.mainrole !== "superadmin" && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

    const [users, setUsers] = useState([]);

    async function fetchUsers() {
        try {
            const { data } = await axios.get(`${server}/api/users`, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            })

            setUsers(data.users);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [])
    // console.log(users);

   
    const updateRole = async (id) => {
    if (confirm("are you sure you want to update this user's role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
    return (
  <Layout>
    <div className="users-page">
      <div className="users-table-container">
        <h1>All Users</h1>
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Update Role</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.role}</td>
                <td>
                  <button className='common-btn' onClick={() => updateRole(e._id)}>
                    Update Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
);
}

export default AdminUsers
