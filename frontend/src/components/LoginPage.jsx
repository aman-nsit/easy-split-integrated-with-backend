import React,{useState} from 'react'
import { Link , useNavigate } from 'react-router-dom'
import authStore from './AuthStore';
import loadingImg from "../loading.png" ;
export default function LoginPage() {
    const [isLoading,setIsLoading] = useState(false);
    const store = authStore();
    const navigate = useNavigate();
    const handleLogin = async (e) =>{
        setIsLoading(true);
        e.preventDefault();
        await store.login();

        setIsLoading(false);
        navigate("/");
    }
  return (
    <div className='form-container'>
      {isLoading && <div className='loading-form-div'>
            <img src={loadingImg} className='loading-img' alt='Loading...'/>
            </div>}
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
      <div className='form-link'>Are you not registered?<Link to="/users/signup">SignUp</Link></div>
    </div>
  )
}
