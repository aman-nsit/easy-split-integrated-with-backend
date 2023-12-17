import React  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
let token=localStorage.getItem("accesstoken")

axios.defaults.baseURL="http://localhost:5000";
axios.defaults.withCredentials = true;
axios.defaults.headers.common['token'] = token ;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
