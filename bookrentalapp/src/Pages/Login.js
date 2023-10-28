import React,{useState} from "react";
import {useNavigate} from "react-router-dom"

import {newuser} from "../Api/user"
// import { ToastContainer,toast} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import IconButton from "@mui/material/IconButton";
import { Button, TextField, OutlinedInput } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Visibility,VisibilityOff}from "@mui/icons-material";
import {PhotoAlbumOutlined} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [user,setUser]=useState({
        fname:"",
        lname:"",
        password:"",
        confirmpassword:"",
        email:"",
        profilePic:"",
        phonenumber:"",
        age:""
      })
      const navigate=useNavigate()
    
      const handleSubmit = async (event) => {
        console.log(user)
        if(user.password===user.confirmpassword){
             const x=await newuser(user);
            //  console.log()
             const error="error"
             if(x.data.status===error){
              console.log("user is alredy exist")
             }
             else{
               navigate("/");             
             }
        }
        else{
          console.log("password and r-password differ");
        }
    };
    
      const imgUplode = (e)=>{
        setUser({...user,profilePic:e.target.files[0]})
      }
      
      const handlechange=(e)=>{
        console.log(e.target);
           const {name,value}=e.target;
          setUser({...user,[name]:value})
      }
      
  return (
    <div className="">
    <div className=" p-5  bg-white flex ">
      <div className="md:w-1/4 bg-white p-5 flex flex-col mx-auto rounded my-6 shadow-md">
        <div className="head text-3xl text-green-600  font-serif font-semibold mx-auto  text-shodow-md">
          Registration
        </div>
        <form action="" className=" w-full my-2 flex flex-col gap-4 px-4">
          <div className="flex md:flex-row flex-col gap-4">
          <div className="flex flex-col gap-1 ">
            <label htmlFor="" className=" text-sm text-black font-serif font-semibold ">First Name </label>
            <TextField fullWidth label="Name" id="fullWidth" color="warning"  name="fname"  onChange={(e)=>{handlechange(e)}} />
          </div>
          <div className="flex flex-col gap-1 ">
            <label htmlFor="" className=" text-sm text-black font-serif font-semibold "> Last Name </label>
            <TextField fullWidth label="Last name" id="fullWidth"  name="lname" variant="outlined" color="warning" onChange={(e)=>{handlechange(e)}} />
      
          </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className=" text-sm text-black font-serif font-semibold ">Contact</label>
            <TextField fullWidth label="Contact" id="fullWidth" name="phonenumber"  onChange={(e)=>{handlechange(e)}} color="warning" />
          </div>
          <div className="flex flex-col gap-2">
            <label  htmlFor=""  className=" text-sm text-black font-serif font-semibold ">
              Email Address</label>
            <TextField fullWidth label="Email Address" id="fullWidth" color="warning" name="email"  onChange={(e)=>{handlechange(e)}} />
          </div>
          
          <div className="flex flex-col gap-2">
            <label  htmlFor=""  className=" text-sm text-black font-serif font-semibold "> Password</label>
            <FormControl fullWidth sx={{ my: 0 }} variant="outlined" color="warning">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput 
          id="outlined-adornment-password"
          name="password"  onChange={(e)=>{handlechange(e)}}
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                // onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password" />
      </FormControl>             
        </div>
        <div className="flex flex-col gap-2">
            <label  htmlFor=""  className=" text-sm text-black font-serif font-semibold ">
              Confirm Password</label>
            <TextField fullWidth label=" Confirm Password" id="fullWidth" color="warning" name="confirmpassword" placeholder="Confirm password" onChange={(e)=>{handlechange(e)}} />
          </div>
         <div className="w-full flex flex-row gap-4">
          <Button variant="outlined" component="label" sx={{ width:'50%',height:'60px'}}>upload<input hidden accept="image/*" multiple type="file"  name="profilePic"  onChange={(e)=>{imgUplode(e)}} /> <PhotoAlbumOutlined/></Button>
            <div  className="">
           
            <TextField fullWidth label="Age" id="fullWidth" name="age" placeholder="DD/MM/YYYY"   onChange={(e)=>{handlechange(e)}} color="warning" />
            </div>
          </div>
        <div>
        <Button variant="contained" color="warning" fullWidth sx={{height:'60px'}} onClick={()=>{handleSubmit()}}> Register</Button>
        </div>  
        </form>
      </div>
    </div>
    <ToastContainer/>
  </div>

  );
}
