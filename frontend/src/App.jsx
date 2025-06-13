import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/pages/home/Home.jsx'
import Header from './components/header/Header.jsx'
import Footer from './components/footer/Footer.jsx'
import Login from './components/pages/auth/Login.jsx'
import Register from './components/pages/auth/Register.jsx'
import Verify from './components/pages/auth/Verify.jsx'
import About from './components/pages/about/About.jsx'
import Account from './components/account/Account.jsx'
import { UserData } from './context/UserContex.jsx'
import Loading from './components/loading/Loading.jsx'
import Courses from './components/pages/courses/Courses.jsx'
import CourseDescription from './components/pages/courseDescription/CourseDescription.jsx'
import PaymentSuccess from './components/pages/paymentSuccess/PaymentSuccess.jsx'
import Dashboard from './components/pages/dashboard/Dashboard.jsx'
import CourseStudy from './components/pages/courseStudy/CourseStudy.jsx'
import Lecture from './components/pages/lecture/Lecture.jsx'
import AdminDashboard from './admin/dashboard/AdminDashboard.jsx'
import AdminCourses from './admin/courses/AdminCourses.jsx'
import AdminUsers from './admin/users/AdminUsers.jsx'

function App() {
  const { isAuth, user, loading } = UserData();

  return (
    <>
      {loading ? (<Loading />) : (
        <BrowserRouter>
          <Header isAuth={isAuth} />
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/about' element={<About />}></Route>
            <Route path='/courses' element={<Courses />}></Route>
            <Route path='/account' element={isAuth ? <Account user={user} /> : <Login />}></Route>
            <Route path='/login' element={isAuth ? <Home /> : <Login />}></Route>
            <Route path='/register' element={isAuth ? <Home /> : <Register />}></Route>
            <Route path='/verify' element={isAuth ? <Home /> : <Verify />}></Route>
            <Route path="/course/:id" element={isAuth ? <CourseDescription user={user} /> : <Login />}></Route>
            <Route path="/payment-success/:id" element={isAuth ? <PaymentSuccess user={user} /> : <Login />}></Route>
            <Route path="/:id/dashboard" element={isAuth ? <Dashboard user={user} /> : <Login />}></Route>
            <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user} /> : <Login />}></Route>
            <Route path="/lecture/:id" element={isAuth ? <Lecture user={user} /> : <Login />}></Route>
            <Route path="/admin/dashboard" element={isAuth ? <AdminDashboard user={user} /> : <Login />}></Route>
            <Route path="/admin/course" element={isAuth ? <AdminCourses user={user} /> : <Login />}></Route>
            <Route path="/admin/users" element={isAuth ? <AdminUsers user={user} /> : <Login />}></Route>

          </Routes>
          <Footer />
        </BrowserRouter>)}
    </>
  )
}

export default App
