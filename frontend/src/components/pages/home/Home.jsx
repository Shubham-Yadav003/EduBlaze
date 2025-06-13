import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./home.css"
import Testimonials from '../../testimonials/Testimonial.jsx'

function home() {
  const navigate = useNavigate(); // used in button for navigation
  return (
    <div>
     <div className='home'>
      <div className='home-content'>
        <h1> Welcome to your digital learning space!</h1>
        <p> Learn, Grow, Excel</p>
        <button onClick={()=>navigate("/courses")} 
        className='common-btn'> Get Started!</button>

      </div>
     </div>

     <Testimonials/>
    </div>
  )
}

export default home
