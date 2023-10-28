import React,{useEffect, useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, TextField, OutlinedInput } from "@mui/material";
import { Link } from "react-router-dom";
import DataContextProvider ,{DataContext} from './Resetconteexr';
import axios from 'axios';
export default function Resetpass() {
  const {   setOTP,email,setEmail,setOtp} = useContext(DataContext);
      const navigate = useNavigate();
    
      const handlechange = (e)=>{
            setEmail(e.target.value);
      }
    
      const handleSubmit = async (event)=>{
        if (email) {
            const OTP = Math.floor(Math.random() * 9000 + 1000);
            console.log(OTP);
            setOtp(OTP);
            axios
              .post("http://localhost:8000/resetpass", {
                OTP,
                recipient_email: email,
              })
              .then(() => navigate("/otpvarify"))
              .catch(console.log);
            return;
          }
          return alert("Please enter your email");
      }
  return (
 <div className="  bg-white flex  flex-col h-screen items-center justify-center ">

      <div className="w-1/4 bg-white p-5 flex flex-col shadow-2xl mx-auto rounded-2xl ">
       
        <div className='h-48 mt-[6px] rounded-full w-48 bg-black flex flex-col mx-auto'>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt=""  className='w-full h-full object-fit:contain;' />
        </div>
        <form action="" className=" w-full my-2 flex flex-col gap-4">
         
          <div className="flex flex-col gap-2">
            <label  htmlFor=""  className=" text-sm text-black font-serif font-semibold ">
              Email Address</label>
            <TextField fullWidth label="Email Address" id="fullWidth" color="warning" name="email"  onChange={(e)=>{handlechange(e)}} />
          </div>
        <div>
        <Button variant="contained" color="warning" fullWidth sx={{height:'60px'}} onClick={()=>{handleSubmit()}}> Register</Button>
        </div>   
        <div>
        <Link to="/otpvarify">Otp</Link>
        </div>   
        </form>
      </div>
    </div>
  )
}
