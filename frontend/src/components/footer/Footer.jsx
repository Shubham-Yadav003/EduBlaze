import React from 'react'
import "./footer.css"
import { FaInstagram,FaTwitter,FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer>
        <div className="footer-content">
            <p> 
                &copy; 2025 EduBlaze. All rights reserved.
                Made with ❤️ <a href="https://github.com/Shubham-Yadav003"> Shubham Yadav</a>
            </p>

            <div className="social-links">
                <a href=''>
                    <FaInstagram/>
                </a>
                <a href=''>
                    <FaTwitter/>
                </a>
                <a href=''>
                    <FaGithub/>
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer
