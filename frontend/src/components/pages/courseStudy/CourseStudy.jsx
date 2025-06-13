import React, {useEffect} from 'react'
import "./coursestudy.css"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CourseData } from '../../../context/CourseContext';
import { server } from '../../../main';
function CourseStudy({user}) {
    const params = useParams();
    

    const {fetchCourse, course} = CourseData(); 
    const navigate = useNavigate();
    if(user && user.role !== "admin" && !user.subscription.includes(params.id)) 
        return navigate("/");


    useEffect(()=>{
        fetchCourse(params.id)
    },[])  
  return (
    <>
    {
     course && <div className='course-study-page'>
        <img src={`${server}/${course.image}`} alt=""  width={150}/>
        <h2> {course.title}</h2>
        <h4>{course.description}</h4>
        <h5>By: {course.createdBy}</h5>
        <h5>Duration: {course.duration}</h5>
        <Link to={`/lecture/${course._id}`}>
        <h3>Lectures</h3>
        </Link>
     </div>
    }
    </>
  )
}

export default CourseStudy
