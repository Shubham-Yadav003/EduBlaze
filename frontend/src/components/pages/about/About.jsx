// import React from 'react'
// import "./about.css"


// function About() {
//   return (
//     <div className="about">
//     <div className="about-content">
//       <h2>About Us</h2>
//       <p>
//         We are dedicated to providing high quality online courses to help
//         individuals learn and grow in their desired fields. Our experienced
//         instruction ensure that each course is tailored for effective learning
//         and practical application.
//       </p>
//     </div>
//   </div>
// );

// };


// export default About


import React from 'react';
import "./about.css";

function About() {
  return (
    <div className="about">
      <div className="about-hero">
        <h1>Welcome to EduBlaze</h1>
        <p>
          Empowering your learning journey with expertly crafted online courses.
        </p>
      </div>
      <div className="about-content">
        <h2>About Us</h2>
        <p>
          At <span className="brand">EduBlaze</span>, we are passionate about delivering high-quality online education to help individuals grow in their careers and personal lives. Our platform features a diverse range of courses, each designed by experienced instructors to ensure effective learning and practical application.
        </p>
        <div className="about-features">
          <div className="feature-card">
            <img src="/img1.jpg" alt="Quality" />
            <h3>Quality Content</h3>
            <p>All courses are curated and reviewed by industry experts.</p>
          </div>
          <div className="feature-card">
            <img src="/img2.jpg" alt="Flexible" />
            <h3>Flexible Learning</h3>
            <p>Learn at your own pace, anytime and anywhere.</p>
          </div>
          <div className="feature-card">
            <img src="/img3.jpg" alt="Support" />
            <h3>24/7 Support</h3>
            <p>Our team is always here to help you succeed.</p>
          </div>
        </div>
        <div className="about-cta">
          <h2>Join thousands of learners today!</h2>
          <button className="common-btn" onClick={() => window.location.href = "/courses"}>
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;