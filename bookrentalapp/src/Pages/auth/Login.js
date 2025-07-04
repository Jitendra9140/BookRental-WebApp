import React,{useEffect, useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { findUser } from '../../Api/user';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import Checkbox from '@mui/material/Checkbox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { DataContext } from '../../contexts/ResetContext';
import loginimage from "../../images/bookguy.png"
export default function Login() {
  
    const [user, setUser] = useState({
        email: "",
        password: "",
        name:""
      });  
      const {userd} =useContext(DataContext);  
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
<div class="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
    <div class="bg-white-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{maxWidth:"1000px"}}>
        <div class="md:flex w-full">
            <div class="hidden md:block w-1/2 bg-red-600 ">
                <img src={loginimage} className='w-full h-full object-fit:contain;' alt="" />
            </div>
            <div class="w-full md:w-1/2 py-10 px-5 flex flex-col justify-center md:px-10 ">
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
                                <div className=" text-black text-lg font-serif font-bold ">Don't have account ?  <span className='text-red-800'><Link to="/register" className='text-red-800 text-md'> Sign Up ! </Link></span></div>
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