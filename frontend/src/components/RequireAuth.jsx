import React, { useEffect } from 'react'
import authStore from './AuthStore'
import { Navigate } from 'react-router-dom';
import loadingImg from "../loading.png" ;
export default function RequireAuth(props) {
    const store = authStore();
    useEffect (()=>{
        if(store.loggedIn===null){
            store.checkAuth();
        }
    },[])
    if(store.loggedIn === null){
        return (
            <div className='loading-div'>
            <img src={loadingImg} alt='Loading...'/>
            </div>
        )
    }
    if(store.loggedIn === false){
        return (
            <Navigate to="/users/login" />
        )
    }
    return(
        <div>{props.children}</div>
    )
}
