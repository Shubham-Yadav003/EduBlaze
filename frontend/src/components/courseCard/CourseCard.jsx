import React from 'react'
import './courseCard.css'
import { server } from '../../main'
import { UserData } from '../../context/UserContex'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { CourseData } from '../../context/CourseContext'
function CourseCard({ course }) {
    const navigate = useNavigate();
    const { user, isAuth } = UserData();

    const {fetchCourses} = CourseData();
    
    const deleteHandler = async(id)=>{
       if(confirm("Are you sure you want to delete this course?")) { // javascript
          try{
        const {data} = await axios.delete(`${server}/api/course/${id}` ,{
          headers:{
            token: localStorage.getItem("token")
          },
        });
        toast.success(data.message);
        fetchCourses(); // to update the course list after deletion
        }
        catch(err){
            toast.error(err.response.data.message );
        }
       }
    } 
    return (
        <div className='course-card'>
            <img src={`${server}/${course.image}`} alt='' className='course-image' />
            <h3> {course.title}</h3>

            <p> Instructor: {course.createdBy}</p>
            <p>Duration: {course.duration} weeks</p>
            <p> Price: ₹{course.price}</p>
            {isAuth ? (
                <>
                    {user && user.role !== "admin" ? (
                        <>
                            {user.subscription.includes(course._id) ? (
                                <button
                                    onClick={() => navigate(`/course/study/${course._id}`)}
                                    className="common-btn1"
                                >
                                    Study
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate(`/course/${course._id}`)}
                                    className="common-btn1"
                                >
                                    Get Started
                                </button>
                            )}
                        </>
                    ) : (
                        <button
                            onClick={() => navigate(`/course/study/${course._id}`)}
                            className="common-btn1"
                        >
                            Study
                        </button>
                    )}
                </>
            ) : (
                <button onClick={() => navigate("/login")} className="common-btn1">
                    Get Started
                </button>
            )}
   
          <br/>

            {
                user && user.role == "admin" && <button className='common-btn2' onClick={()=>deleteHandler(course._id)} >Delete</button>
            }

        </div>
    )
}

export default CourseCard
