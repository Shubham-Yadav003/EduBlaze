import React, { useState } from 'react'
import './auth.css'
import { Link, useNavigate } from 'react-router-dom'
import { UserData } from '../../../context/UserContex.jsx';


function Register() {
  const navigate = useNavigate();

  const { btnLoading, registerUser } = UserData();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault(); // prevent default form submission
    await registerUser(name, email, password, navigate); // call registerUser function from context
  }

  return (
    <div className='auth-page'>
      <div className='auth-form'>
        <h2> Register </h2>
        <form onSubmit={submitHandler}>
          <label htmlFor='name'>Name</label>
          <input type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required />

          <label htmlFor='email'>Email</label>
          <input type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor='password'>Password</label>
          <input type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />

          <button type='submit' disabled={btnLoading} className='common-btn'>
            {btnLoading ? "Please Wait.." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <Link to='/login'>Login </Link>
        </p>
      </div>

    </div>
  )
}

export default Register
