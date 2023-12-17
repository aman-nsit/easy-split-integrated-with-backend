import React , {useState} from 'react'
import { Link , useNavigate } from 'react-router-dom'
import authStore from './AuthStore'
import loadingImg from "../loading.png" ;
export default function SignupPage() {
  const [isLoading,setIsLoading] = useState(false);
  const [exist,setExist]=useState(false);
    const store= authStore();
    const navigate = useNavigate();
    const handleSignUp = async (e) =>{
      setIsLoading(true);
        e.preventDefault();
        let res = store.signUp();
        setIsLoading(false);
        console.log(res.data);
        navigate("/users/login");
    }
  return (
    <div className='form-container'>
    <h1 className='form-heading'>SignUp Page</h1>
    {isLoading && <div className='loading-form-div'>
            <img src={loadingImg} className='loading-img' alt='Loading...'/>
            </div>}
    <form onSubmit={handleSignUp}>
        <input 
                className='form-input' 
                placeholder='Enter Your Name'
                value={store.signUpForm.name} 
                onChange={store.updateSignUpForm} 
                name="name" 
                required
        />
        <input 
                className='form-input' 
                placeholder='Enter User Name'
                value={store.signUpForm.user_name} 
                onChange={store.updateSignUpForm} 
                name="user_name" 
                required
        />
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
    {
      exist &&   <div className='warning'>* username already exist*</div>
    }
  <div className='form-link'>Are you already registered?<Link to="/users/login">Login</Link></div>
  <div className='warning'>* username should be unique *</div>

</div>
  )
}
