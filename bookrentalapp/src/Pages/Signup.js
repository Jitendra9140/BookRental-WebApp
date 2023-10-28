import React,{useEffect, useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { findUser } from '../Api/user';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import IconButton from "@mui/material/IconButton";
import Checkbox from '@mui/material/Checkbox';
import { Button, TextField, OutlinedInput } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Visibility,VisibilityOff}from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import {signInWithPopup} from "firebase/auth"
import { DataContext } from './Resetconteexr';
export default function Signup() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [user, setUser] = useState({
        email: "",
        password: "",
        name:""
      });  
      const {userd ,setuserd} =useContext(DataContext);  
      const navigate = useNavigate();
      const handlechange = (e)=>{
           const {name,value}=e.target;
           setUser({...user,[name]:value})
      }
      useEffect(() => {
        console.log(userd); // This will show the updated value when it changes
      }, [userd]);

      const handleSubmit = async (event) => {
        try {
          if (!user.email) {
            toast.error('Please enter your email!', { position: toast.POSITION.TOP_RIGHT });
          } else if (!user.password) {
            toast.error('Please enter your password!', { position: toast.POSITION.TOP_RIGHT });
          } else if (!user.email.includes('@')) {
            toast.error('Invalid email address!', { position: toast.POSITION.TOP_RIGHT });
          } else {
            const data = await findUser(user);
      
            if (data && data.data) {
              if (data.data.status === 404) {
                // User not found, display an error message
                toast.error(data.data.data);
              } else {
                // Login successful
                const token = data.data.token;
                toast.success("Login Successfully");
                window.localStorage.setItem("token", token);
                setTimeout(() => {
                  navigate("/home");
                }, 1500);
              }
            } else {
              // Handle the case where data is undefined or doesn't contain the expected structure
              console.error("Error: 'data' is undefined or does not contain the expected structure");
              toast.error("User not found");
            }
          }
        } catch (error) {
          // Handle any other unexpected errors, e.g., network issues, in the 'findUser' call
          console.error("An error occurred during login:", error);
          toast.error("An error occurred during login. Please try again later.");
        }
      };
  return (
    // <div className=' h-screen'>
    //   <div className='w-[60%] flex  flex-row m-auto   justify-center	items-center h-[80%] rounded-2xl overflow-hidden shadow'>
    //     <div className='w-2/5 h-full'>
    //       <div className='bg-red-600'>
    //       <img src="images/bookguy.png" className='w-full h-full object-fit:contain; overflow-hidden ' alt="" />
    //       </div>
    //     </div>
    //     <div className="w-3/5 bg-white flex flex-col mx-auto  ">
        
    //     <form action="" className=" w-full my-2 flex flex-col gap-4">
    //       <div className="flex flex-col gap-2">
    //         <label  htmlFor=""  className=" text-sm text-black font-serif font-semibold ">
    //           Email Address</label>
    //         <TextField fullWidth label="Email Address" id="fullWidth" color="warning" name="email"  onChange={(e)=>{handlechange(e)}} />
    //       </div>
    //       <div className="flex flex-col gap-2">
    //         <label  htmlFor=""  className=" text-sm text-black font-serif font-semibold "> Password</label>
    //         <FormControl fullWidth sx={{ my: 0 }} variant="outlined" color="warning">
    //     <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
    //     <OutlinedInput 
    //       id="outlined-adornment-password"
    //       name="password"  onChange={(e)=>{handlechange(e)}}
    //       type={showPassword ? 'text' : 'password'}
    //       endAdornment={
    //         <InputAdornment position="end">
    //           <IconButton
    //             aria-label="toggle password visibility"
    //             onClick={handleClickShowPassword}
    //             // onMouseDown={handleMouseDownPassword}
    //             edge="end"
    //           >
    //             {showPassword ? <VisibilityOff /> : <Visibility />}
    //           </IconButton>
    //         </InputAdornment>
    //       }
    //       label="Password" />
    //   </FormControl> 
    //        <div>
    //         <Link to="/reset-password">
    //        <label  htmlFor=""  className=" text-m  text-black font-serif font-semibold ">Forget Password ?</label>
    //        </Link>
    //       </div>       
    //     </div>
    //     <div>
    //     <Button variant="contained" color="warning" fullWidth sx={{height:'60px'}} onClick={()=>{handleSubmit()}}> Register</Button>
    //     </div>   
    //     </form>
    //     <div className="head text-xl text-green-600 my-[20px] font-serif font-semibold mx-auto  text-shodow-md">
    //       Don't Have Account ? <span ><Link to="/login"><a href="" className='text-xl text-yellow-600  font-serif font-semibold  text-shodow-md'>signup here</a></Link></span>
    //     </div>
    //   </div>
    //   </div>
       
  
    // <ToastContainer />
    // </div>
<div class="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
    <div class="bg-white-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{maxWidth:"1000px"}}>
        <div class="md:flex w-full">
            <div class="hidden md:block w-1/2 bg-red-600 ">
                <img src="images/bookguy.png" className='w-full h-full object-fit:contain;' alt="" />
            </div>
            <div class="w-full md:w-1/2 py-10 px-5 flex flex-col justify-center md:px-10">
                <div class="text-center mb-10">
                    <h1 class="font-extrabold text-3xl text-red-900 text-4xl ">Welcome Back</h1>
                </div>
                <div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center "><EmailIcon className='text-red-600 text-xl'/></div>
                                <input type="email" class="w-full -ml-10 pl-10 pr-3 py-4 text-lg font-bold rounded-lg border-2 border-gray-200 outline-none focus:border-red-800" placeholder="example@example.com" name="email"  onChange={(e)=>{handlechange(e)}}/>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 py-4 mb-12">
                            <div class="flex">
                                <div class="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><KeyIcon className='text-red-600'/></div>
                                <input type="password" class="w-full -ml-10 pl-10 pr-3 py-4 text-md rounded-lg border-2 border-gray-200 outline-none focus:border-red-600" placeholder="************"  name="password"  onChange={(e)=>{handlechange(e)}}/>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-12">
                            <div class="flex flex-row justify-between">
                                <div className=" text-black text-lg font-serif font-bold ">Remember me <span> <Checkbox  className=' ' color='error' /></span></div>
                                <Link to="/reset-password">
                                <div className="text-black text-lg font-serif font-bold"> Forget Password</div>   
                                 </Link>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-12">
                            <div class="flex ">
                                <div className=" text-black text-lg font-serif font-bold ">Don't have account ?  <span className='text-red-800'><Link to="/login" className='text-red-800 text-md'> Sign Up ! </Link></span></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <button class="block  px-5 max-w-xs mx-auto bg-white border border-3 text-2xl  font-serif border-red-600 text-red-800 rounded-lg px-3 py-3 font-bold" onClick={()=>{handleSubmit()}}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
     <ToastContainer />
</div>
  )
}