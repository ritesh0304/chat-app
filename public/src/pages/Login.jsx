import React, { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import {ToastContainer,toast} from "react-toastify"
import { useState } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import {loginRoute } from "../utils/APIRoutes";

function Login() {
  const navigate=useNavigate();
  const [formData,setFormData]=useState({
    email:"",
    password:"",
  })
  const toastOptions= {
    position:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"

  }

  useEffect(()=>{
    if(localStorage.getItem("chat-app-user")){
      navigate('/');
    }
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (handleValidation()) {
      const { email, password } = formData;
  
      try {
        const response = await axios.post(loginRoute, {
          email,
          password        
        });
            
          // console.log(response)
          if(response.data.status === false){
            toast.error(response.data.msg, toastOptions);
          }
          if(response.data.status === true){
            localStorage.setItem('chat-app-user',JSON.stringify(response.data.existedUser))
            navigate('/');
            console.log('login successful:', response.data.existedUser);
          }
        // Handle the response, e.g., show a success message

      } catch (error) {
        // Handle error, e.g., show an error message
        console.error('Error logging user:', error.response ? error.response.data : error.message);
      }
    } else {
      // Handle validation failure, e.g., show an error message
      console.error('Validation failed');
    }
  };


  const handleValidation=()=>{
   const { email,password,}=formData;
   if(password.length<8){
    toast.error("password should be greater then 8 characters",toastOptions);
    return false;
   }else if(email.length<3){
    toast.error("email should be greater then 3 characters",toastOptions);
    return false;
   }
   return true;
  }

  function handleChange(e) {
    const {name,value}=e.target;
    setFormData((prevFormData)=>{
           return {
            ...prevFormData,
             [name]:value,
           }
    })
  }
  return (
    <>
      <FormContainer>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h1>snappy</h1>
        </div>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e)}
        />
        <button type="Submit">Login </button>
        <span>
          Don't have an account ?<Link to="/register"> Register</Link>
        </span>
      </form>
    </FormContainer>
    <ToastContainer/>
    </>
  );
}

const FormContainer = styled.div`
   height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Login;
