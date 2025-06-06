import React from 'react'
import './Login.css'
import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'
const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setpassword] = useState('')
    const { signup, isLoading, error } = useSignup()
    const handleSubmit = (e) => {
        e.preventDefault()
        signup(email, password)
    }

  return (
    <form className='login' onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label>Email :</label>
      <input 
      className='input-login'
      type="text"
      onChange={(e) => setEmail(e.target.value)}
      value={email}
      />
      <label>password :</label>
      <input 
      className='input-login'
      type="password"
      onChange={(e) => setpassword(e.target.value)}
      value={password}
       />
       <button>Sign Up</button>
       {error && <p className='error'>{error}</p>}
    </form>
  )
}

export default Signup