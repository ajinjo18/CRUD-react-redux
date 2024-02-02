import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import $ from 'jquery';
import {jwtDecode} from 'jwt-decode';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux'
import { setUserData,userLogout } from '../../Redux/userData/userDataSlice';

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (token) {
      const isTokenValid = jwtDecode(token);
      if (isTokenValid) {
        navigate('/home')
      } 
      else {
        navigate('/')
        dispatch(userLogout())
      }
    } 
    else {
      dispatch(userLogout())
      navigate('/')
    }
    
  },[])

  useEffect(() => {
    $(document).ready(function() {
      $("#signup_btn").click(function() {
      $("#main").animate({left:"22.5%"},400);
      $("#main").animate({left:"30%"},500);
      $("#loginform").css("visibility","hidden");
      $("#loginform").animate({left:"25%"},400);

      $("#signupform").animate({left:"17%"},400);
      $("#signupform").animate({left:"30%"},500);
      $("#signupform").css("visibility","visible");
      });

      $("#login_btn").click(function() {
      $("#main").animate({left:"77.5%"},400);
      $("#main").animate({left:"70%"},500);
      $("#signupform").css("visibility","hidden");
      $("#signupform").animate({left:"75%"},400);

      $("#loginform").animate({left:"83.5%"},400);
      $("#loginform").animate({left:"70%"},500);
      $("#loginform").css("visibility", "visible");
      });
    });
  }, []); 


// ----------------signup start-----------------

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  
  const data = {
    name: userName,
    email: userEmail,
    password: userPassword
  }

  const notify = () => toast("Successfully Registered");

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  const validateName = () => {
    if (!userName) {
      setNameError('Name required');
      return true
    } 
    else {
      setNameError('');
      return false
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setEmailError('Valid email required.');
      return true
    }
    else {
      setEmailError('');
      return false
    }
  };

  const validatePassword = () => {
    if (userPassword.length < 6) {
      setPasswordError('Use a strong password');
      return true
    } 
    else {
      setPasswordError('');
      return false
    }
  };

  const register = async () =>{

    const vn = validateName();
    const ve = validateEmail();
    const vph = validatePassword();

    if (!vn && !ve && !vph) {
      try{
        await axios.post('http://localhost:3001/signup',data)
        notify()
        setUserName('')
        setUserEmail('')
        setUserPassword('')
      }
      catch (err){
        console.log(err);
      }
    }
    else{
      console.log('validation error');
    }
    
  }

// ----------------signup ends-----------------



// ------------------login start----------------

  const invalidUser = () => {
    toast.error("Invalid credentials", {
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });

      const token = response.data.token;
      dispatch(setUserData({value:response.data.user}))
      localStorage.setItem('token', token);
      sessionStorage.setItem('email',email)
      navigate('/home')
    } 
    catch (error) {
      if (error.response.data.message == 'Invalid credentials') {
        invalidUser()
      } 
      else {
        console.error('Error during login:', error);
      }
    }
  };

// ------------------login ends----------------




  return (
    <>
      <ToastContainer />
      <div id="box">
      <div id="main"></div>

      <div id="loginform">
        <h1>LOGIN</h1>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"/><br/>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"/><br/>
        <button onClick={submit} >Login</button>
      </div>

      <div id="signupform">
        <h1>SIGN UP</h1>
        <input onBlur={validateName} value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Full Name"/><br/>
        {nameError && <div style={{color:'red',height:'5px'}} className="error">{nameError}</div>}<br/>
        <input onBlur={validateEmail} value={userEmail} onChange={(e) => setUserEmail(e.target.value)} type="email" placeholder="Email"/><br/>
        {emailError && <div style={{color:'red',height:'5px'}} className="error">{emailError}</div>}<br/>
        <input onBlur={validatePassword} value={userPassword} onChange={(e) => setUserPassword(e.target.value)} type="password" placeholder="Password"/><br/>
        {passwordError && <div style={{color:'red',height:'5px'}} className="error">{passwordError}</div>}<br/>
        <button onClick={register} >Sign Up</button>
      </div>

      <div id="login_msg">Have an account?</div>
      <div id="signup_msg">Don't have an account?</div>

      <button id="login_btn">Login</button>
      <button id="signup_btn">Sign Up</button>
    </div>
    </>
  );
};

export default Login;
