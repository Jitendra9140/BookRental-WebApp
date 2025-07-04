import React,{useState} from "react";
import {useNavigate} from "react-router-dom"
import {newuser} from "../../Api/user"
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from "@mui/material/IconButton";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Link } from "react-router-dom";
import Select from '@mui/material/Select';
import { Button, TextField, OutlinedInput } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility,VisibilityOff}from "@mui/icons-material";
import {PhotoAlbumOutlined} from "@mui/icons-material";
import { ToastContainer, toast } from 'react-toastify';
import signinimage from '../../images/bookguy.png'
import 'react-toastify/dist/ReactToastify.css';
export default function Register() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [user,setUser]=useState({
        fname:"",
        lname:"",
        password:"",
        confirmpassword:"",
        email:"",
        profilePic:"",
        phonenumber:"",
        year:""
      })
      const navigate=useNavigate()
    
      const handleSubmit = async (event) => {
        console.log(user)
        if (!user.email) {
          toast.error('Please enter your email!', { position: toast.POSITION.TOP_RIGHT });
        } else if (!user.password) {
          toast.error('Please enter your password!', { position: toast.POSITION.TOP_RIGHT });
        } 
        else if (!user.fname) {
          toast.error('Please enter your fname!', { position: toast.POSITION.TOP_RIGHT });
        } 
        else if (!user.lname) {
          toast.error('Please enter your lname!', { position: toast.POSITION.TOP_RIGHT });
        } 
         
        else if (!user.confirmpassword) {
          toast.error('Please enter your confirm password!', { position: toast.POSITION.TOP_RIGHT });
        } 
        else if (!user.phonenumber) {
          toast.error('Please enter your phonenumber!', { position: toast.POSITION.TOP_RIGHT });
        } 
         
        else if (!user.year) {
          toast.error('Please enter your year!', { position: toast.POSITION.TOP_RIGHT });
        } 
        else if (!user.profilePic) {
          toast.error('Please enter your profilepic!', { position: toast.POSITION.TOP_RIGHT });
        } 
          else {
             const x=await newuser(user);
            //  console.log()
             const error="error"
             if(x.data.status===error){
              toast.success("User is allredy exist");
              console.log("user is alredy exist")
             }
             else{
              toast.success("Successfully Created account");
              setTimeout(() => {
                navigate("/");
              }, 1500);            
             }
        }
    };
    
      const imgUplode = (e)=>{
        setUser({...user,profilePic:e.target.files[0]})
      }
      

      const handlechange= (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
      
        if (name === "phonenumber") {
          if (!/^\d{0,10}$/.test(value)) {
            setPhoneError("Phone number should be a maximum of 10 digits and contain only numbers.");
          } else {
            setPhoneError("");
          }
        }
      
        if (name === "email") {
          if (!isValidEmail(value)) {
            setEmailError("Invalid email address");
          } else {
            setEmailError("");
          }
        }
      
        if (name === "password") {
          if (!isValidPassword(value)) {
            setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, and one special character");
          } else {
            setPasswordError("");
          }
        }

        if (name === "confirmpassword") {
          if (value !== user.password) {
            setConfirmPasswordError("Passwords do not match");
          } else {
            setConfirmPasswordError("");
          }
        }
      };
      
     

      const isValidPassword = (password) => {
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const specialCharacterRegex = /[@$!%*?&#]/;
      
        return (
          uppercaseRegex.test(password) &&
          lowercaseRegex.test(password) &&
          specialCharacterRegex.test(password)
        );
      };
      
      const isValidEmail = (email) => {
        // Basic email format validation
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
      };
  return (
    <div className="">
      <div class="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
    <div class="bg-white-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{maxWidth:"1000px"}}>
        <div class="md:flex w-full">
            <div class="hidden md:block w-1/2 bg-red-600 ">
                <img src={signinimage} className='w-full h-full object-fit:contain;' alt="" />
            </div>
            <div class="w-full md:w-1/2 py-10 px-5 flex flex-col justify-center md:px-10 ">
                <div class="text-center mb-10">
                    <h1 class="font-extrabold text-3xl text-red-900 text-4xl ">Create Your Account</h1>
                </div>
                <div>
                <div className="flex md:flex-row flex-col gap-4">
          <div className="flex flex-col gap-1 my-2">
            <label htmlFor="" className=" text-sm text-red-800 text-md font-serif font-semibold ">First Name </label>
            <TextField fullWidth label="Name" id="fullWidth" color="warning"  name="fname"  onChange={(e)=>{handlechange(e)}} />
          </div>
          <div className="flex flex-col gap-1 my-2">
            <label htmlFor="" className=" text-sm text-red-800  font-serif font-semibold "> Last Name </label>
            <TextField fullWidth label="Last name" id="fullWidth"  name="lname" variant="outlined" color="warning" onChange={(e)=>{handlechange(e)}} />
          </div>
          </div>
          <div className="flex flex-col gap-2 my-2">
            <label htmlFor="" className="  text-red-800 text-md font-serif font-semibold ">Contact</label>
            <TextField
    fullWidth
    label="Contact"
    id="fullWidth"
    name="phonenumber"
    onChange={(e) => {
      handlechange(e);
    }}
    color="warning"
    error={phoneError !== ""}
    helperText={phoneError}
  />
          </div>
          <div className="flex flex-col gap-2 my-2">
            <label  htmlFor=""  className="text-red-800 text-sm font-serif font-semibold ">
              Email Address</label>
              <TextField
  fullWidth
  label="Email Address"
  id="fullWidth"
  color="warning"
  name="email"
  onChange={(e) => {
    handlechange(e);
  }}
  error={emailError !== ""}
  helperText={emailError}
/>
          </div>
          
          <div className="flex flex-col gap-2 my-2">
            <label  htmlFor=""  className=" text-red-800 text-sm font-serif font-semibold "> Password</label>
            <FormControl fullWidth sx={{ my: 0 }} variant="outlined" color="warning">
  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
  <OutlinedInput
    id="outlined-adornment-password"
    name="password"
    onChange={(e) => { handlechange(e) }}
    type={showPassword ? 'text' : 'password'}
    error={passwordError !== ""}
    label="Password"
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    }
  />
  {passwordError && (
    <FormHelperText error>{passwordError}</FormHelperText>
  )}
</FormControl> 
        </div>
        <div className="flex flex-col gap-2 my-2">
            <label  htmlFor=""  className=" text-red-800 text-sm font-serif font-semibold ">
              Confirm Password</label>
              <TextField
  fullWidth
  label="Confirm Password"
  id="fullWidth"
  color="warning"
  name="confirmpassword" // Make sure the name is "confirmpassword"
  placeholder="Confirm password"
  onChange={(e) => { handlechange(e) }} // Use the same handlechange function
  error={confirmPasswordError !== ""} // Display error if passwordError is not empty
  helperText={confirmPasswordError} // Show the error message
/>
          </div>
         <div className="w-full flex flex-row py-3 gap-4 my-5">
          
          <Button variant="outlined" color="error" style={{'padding':"14px 14px"}}  component="label" fullWidth>upload<input hidden accept="image/*" multiple type="file"  name="profilePic"  onChange={(e)=>{imgUplode(e)}} /> <PhotoAlbumOutlined/></Button>
            <div  className=" w-full ">
           
            <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Year</InputLabel>
  <Select
 
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={user.year}
    label="Year"
    name="year"
    onChange={handlechange}
  >
    <MenuItem value={1}>First Year</MenuItem>
    <MenuItem value={2}>Second Year</MenuItem>
    <MenuItem value={3}>Third Year</MenuItem>
    <MenuItem value={4}>Fourth Year</MenuItem>
  </Select>
</FormControl>
            </div>
          </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-12">
                            <div class="flex ">
                                <div className=" text-black text-lg font-serif font-bold ">All ready have account ?  <span className='text-red-800'><Link to="/" className='text-red-800 text-md'>Login ! </Link></span></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex -mx-3">
                        <div class="w-full px-3 mb-5">
                            <button class="block  px-5 max-w-xs mx-auto bg-white border border-3 text-2xl  font-serif border-red-600 text-red-800 rounded-lg px-3 py-3 font-bold"  onClick={()=>{handleSubmit()}}>Sign up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
     <ToastContainer />
</div>
  </div>

  );
}
