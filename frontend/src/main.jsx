import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContex.jsx'
import { CourseContextProvider } from './context/CourseContext.jsx';


export const server = "https://edublaze-1.onrender.com";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
    <App />
    </CourseContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
