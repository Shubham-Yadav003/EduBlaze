import React, { useEffect, useState } from 'react'
import './dashboard.css';
import { useNavigate } from 'react-router-dom'
import Layout from '../utils/Layout';
import axios from 'axios';
import { server } from '../../main';
import './dashboard.css';


function AdminDashboard({ user }) {
    const navigate = useNavigate();

    // if (user && user.role !== 'admin' && user.mainrole !== 'superadmin') {
    //     return navigate("/");
    // }

    useEffect(() => {
  if (user && user.role !== 'admin' && user.mainrole !== 'superadmin') {
    navigate("/");
  }
}, [user, navigate]);

    const [stats, setStats] = useState([]);

    async function fetchStats() {
        try {
            const { data } = await axios.get(`${server}/api/stats`, {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
            setStats(data.stats);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchStats();
    }, [])
    return (


        <div>
            <Layout>
                <h1 style={{textAlign: 'center', margin: '20px 0'}}>
                  {user && user.mainrole === 'superadmin' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
                </h1>
                <div className="main-content">
                    <div className="box">
                        <p>Total Courses</p>
                        <p>{stats.totalCourses}</p>
                    </div>
                    <div className="box">
                        <p>Total Lectures</p>
                        <p>{stats.totalLectures}</p>
                    </div>
                    <div className="box">
                        <p>Total Users</p>
                        <p>{stats.totalUsers}</p>
                    </div>
                </div>
            </Layout>
        </div>

    )
}

export default AdminDashboard
