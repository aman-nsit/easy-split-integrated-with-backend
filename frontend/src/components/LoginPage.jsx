import React from 'react'
import { Link , Navigate, useNavigate } from 'react-router-dom'
import authStore from './AuthStore'
export default function LoginPage() {
    const store = authStore();
    const navigate = useNavigate();
    const handleLogin = async (e) =>{
        e.preventDefault();
        await store.login();

        navigate("/");
    }
  return (
    <div className='form-container'>
        <h1 className='form-heading'>Login Page</h1>
        <form onSubmit={handleLogin}>
            <input 
                className='form-input' 
                placeholder='Enter Email' 
                value={store.loginForm.email} 
                onChange={store.updateLoginForm} 
                type="email" 
                name="email" 
                required
            />
            <input 
                className='form-input' 
                placeholder='Enter Password'
                value={store.loginForm.password} 
                onChange={store.updateLoginForm} 
                type="password" 
                name="password" 
                required
            />
            <button className='form-button'>Login</button>
        </form>
      <div className='form-link'>Are you not registered?<Link to="/signup">SignUp</Link></div>
    </div>
  )
}
