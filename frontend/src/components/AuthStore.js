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
            // console.log(loginForm);
            const {loginForm} = authStore.getState();
            const item =localStorage.getItem('accesstoken');
            // console.log(item)
            const res = await axios.post("/users/login",loginForm) 
            // console.log(res); 
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
            console .log(err);
        }
    } , 
    checkAuth : async () =>{
        try{
            // await axios.get("/check-auth", {withCredentials: true}); // not rquire set default in index.js
            // await axios.get("/check-auth");
            // set({loggedIn : true});
            await axios.get("/users/check-auth");

            set({loggedIn : true});
        }catch(err){
            set({loggedIn : false});
            console.log(err);
            return (
                <Navigate to="/users/login" />
            )
        }
        
    } ,

    signUpForm:{
        name:"",
        user_name:"",
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
            console.log(signUpForm);
            const res = await axios.post("/users/signup",signUpForm,{
                withCredentials: true
            })  
            set({
                signUpForm : {
                    user_name:"",
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
            // const res = await axios.get("/users/logout");
                localStorage.clear();
                set({loggedIn : false});
                console.log("logged_out");
        }catch(err){
            console.log(err);
        }
    }
}));
export default authStore;
