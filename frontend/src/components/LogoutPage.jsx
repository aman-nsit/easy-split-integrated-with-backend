import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import authStore from './AuthStore';

export default function LogoutPage() {
  const store = authStore();
  const navigate = useNavigate(); // Get the navigate function for redirection
  useEffect(() => {
    // Perform logout logic
    store.logOut();

    // Redirect to the login page
    
  }, [store]);
  function navi(){
    navigate('/users/login');
  }
  return (
    <div>
      {navi()}
    </div>
  );
}
