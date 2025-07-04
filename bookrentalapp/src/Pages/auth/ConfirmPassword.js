import React, { useState } from "react";
import { useContext } from "react";
import { DataContext } from "./Resetconteexr";
import { Button, TextField, OutlinedInput ,FormControl,InputLabel,IconButton,InputAdornment} from "@mui/material";
import { Visibility,VisibilityOff}from "@mui/icons-material";
import { Link ,useNavigate} from "react-router-dom";
import { updatepass } from "../../Api/user";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Reset() {
  const { email,setemail } = useContext(DataContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const[password,setpassword]=useState(
   { password:"",
     cpassword:"",
     email:""
  }
)
 const navigate=useNavigate();
  const handlechange = (e)=>{
    const {name,value}=e.target;
    setpassword({...password,[name]:value})
}
React.useEffect(() => {
  setpassword((prevPassword) => ({
    ...prevPassword,
    email: email // Assuming your email property has the same name
  }));
}, [email]);
const handleSubmit = async () => {
  if (password.password !== password.cpassword) {
    toast.error('Confirmed password should match');
  } else {
    try {
      const updateResponse = await updatepass(password);
      console.log('Update response:', updateResponse);
      setTimeout(() => {
        navigate("/");
      }, 1500);
      // Display a success message using toast
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      // Display an error message using toast
      toast.error('Error updating password');
    }
  }
};

  return (
    <div className="  bg-white flex  flex-col h-screen items-center justify-center ">
    <div className="w-1/4 bg-white p-5 flex flex-col shadow-2xl mx-auto rounded-2xl ">
    <div className="head text-3xl text-black  font-serif my-3 font-semibold text-shodow-md">
          Reset Password
        </div>
      <form action="" className=" w-full my-2 flex flex-col gap-4">
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
          <TextField fullWidth label="Confirm Password" id="fullWidth" color="warning" name="cpassword"  onChange={(e)=>{handlechange(e)}} />
        </div>
      <div>
      <Button variant="contained" color="warning" fullWidth sx={{height:'60px'}} onClick={()=>{handleSubmit()}}> Register</Button>
      </div>   
      <div>
      </div>   
      </form>
    </div>
    <ToastContainer/>
  </div>
  );
}