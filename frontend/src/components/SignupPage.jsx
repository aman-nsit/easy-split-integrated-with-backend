import React from 'react'
import { Link , useNavigate } from 'react-router-dom'
import authStore from './AuthStore'
export default function SignupPage() {
    const store= authStore();
    const navigate = useNavigate();
    const handleSignUp = async (e) =>{
        e.preventDefault();
        store.signUp();

        navigate("/login");
    }
  return (
    <div className='form-container'>
    <h1 className='form-heading'>SignUp Page</h1>
    <form onSubmit={handleSignUp}>
        <input 
            className='form-input' 
            placeholder='Enter Email' 
            value={store.signUpForm.email} 
            onChange={store.updateSignUpForm} 
            type="email" 
            name="email" 
            required
        />
        <input 
            className='form-input' 
            placeholder='Enter Password'
            value={store.signUpForm.password} 
            onChange={store.updateSignUpForm} 
            type="password" 
            name="password" 
            required
        />
        <button className='form-button'>SignUp</button>
    </form>
  <div className='form-link'>Are you already registered?<Link to="/login">Login</Link></div>
</div>
  )
}
