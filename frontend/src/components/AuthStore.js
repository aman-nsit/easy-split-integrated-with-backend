import React from 'react';
import {create} from "zustand" ;
import  axios from "axios";
import { Navigate } from 'react-router-dom';
const authStore = create((set) => ({
    loggedIn : null ,

    loginForm:{
        email:"",
        password : "",
    },
    updateLoginForm :(e) => {
        const {name , value} = e.target ;
        set((state) => {
            return{
                loginForm:{
                    ...state.loginForm,
                    [name] : value
                },
            };
        });
    },
    login : async () =>{
        try{
            const {loginForm} = authStore.getState();
            const item =localStorage.getItem('accesstoken');
            console.log(item)
            const res = await axios.post("/login",loginForm)  
            // localStorage.setItem(res.data)
            // console.log(res.data.accesstoken);
            localStorage.setItem("accesstoken",res.data.accesstoken)
            set(
                {loggedIn:true ,    
                loginForm : {
                    email : "",
                    password : ""
                }
            });
            
        }catch(err){
            console.log(err);
        }
    } , 
    checkAuth : async () =>{
        try{
            await axios.get("/check-auth", {withCredentials: true});
            set({loggedIn : true});
        }catch(err){
            
            set({loggedIn : false});
            console.log(err);
            return (
                <Navigate to="/login" />
            )
        }
        
    } ,

    signUpForm:{
        email:"",
        password : "",
    },
    updateSignUpForm :(e) => {
        const {name , value} = e.target ;
        set((state) => {
            return{
                signUpForm:{
                    ...state.signUpForm,
                    [name] : value
                },
            };
        });
    },
    signUp : async () => {
        try{
            const {signUpForm} = authStore.getState();
            const res = await axios.post("/signup",signUpForm,{
                withCredentials: true
            })  
            set({
                signUpForm : {
                    email : "",
                    password : ""
                }
            });
            console.log(res);
        }catch(err){
            console.log(err);
        }
    } ,
    logOut : async () =>{
        try{
            // const res = await axios.get("/logout");
                localStorage.clear();
                set({loggedIn : false});
        }catch(err){
            console.log(err);
        }
    }

}));
export default authStore;
