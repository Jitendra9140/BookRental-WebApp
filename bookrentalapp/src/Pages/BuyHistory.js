import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { useState,useRef } from 'react';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { findUserByID } from '../Api/user';

export default function BuyHistory() {
    const [user, setUser] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        profilePic: '',
      });
      const [book,setBook]=useState()
      const id = window.localStorage.getItem('Id');
      console.log(id);
      const getuser = async () => {
        const response = await findUserByID(id);
        setUser(response.data);
      };
      // setBook(user.cart[0])
      const idRef = useRef(null);

      const handleCopyClick = (val) => {
        if (idRef.current) {
          idRef.current.select();
          document.execCommand('copy');
          window.getSelection().removeAllRanges();
          alert('Copied to clipboard: '+val );
        console.log(val);
        }
        
        

      };
    console.log(user)
    useEffect(()=>{
     getuser()
      },[id]);
    
  return (
    <div>
       <div className="sticky absolute top-0 left-0 z-20 shadow-md">
    <Navbar/>
</div>  
<div class="container flex flex-row">
  
    <div class=" w-1/5 h-screen p-5">
        <div class="max-w-2xl py-10   sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto  bg-white shadow-xl rounded-lg text-gray-900">
            <div class="rounded-t-lg h-32 overflow-hidden">
              <img class="object-cover object-top w-full" src={`http://localhost:8000/${user.profilePic}`} alt='Mountain'/>
            </div>
            <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
              <img class="object-cover object-center h-32" src={`http://localhost:8000/${user.profilePic}`} alt='Woman looking front'/>
            </div>
            <div class="text-center mt-2">
              <h2 class="font-semibold">{user.fname}</h2>
              <p class="text-gray-500">{user.email}</p>
            </div>
          </div> 
    </div>
    <div class="w-4/5 flex flex-wrap p-5 gap-5">
 <div class="CartContainer">
 <div class="Header">
   <h3 class="Heading">Purchesed Book</h3>
   <h5 class="Action"> All Books</h5>
 </div >

 {user.cart ? (
  user.cart.map((data, key) => {
    // Calculate the date one year from the current item's timestamp
    const timestamp = data.timestamp;
    const currentDateTime = new Date(timestamp);
    const oneYearFromNow = new Date(currentDateTime);
    oneYearFromNow.setFullYear(oneYearFromNow.getUTCFullYear() + 1);

    // Format the result as a human-readable string in IST
    const formattedDate = oneYearFromNow.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'long',
    });

    return (
      <div class="flex flex-row justify-between shadow-md  m-5" key={key}>
        <div class="w-[20%] " >
          <img src={`${data.image}`} class="painting-image w-full h-full object-fit: contain;" />
        </div>
        <div class="about flex flex-col gap-1">
          <h1 class=" title text-red-800">
            {data.title}
          </h1>
          <h3 className="text-red-800 font-bold text-md text-xl">
      <span className="text-red-600 text-md font-bold">Book Id:</span>
      <input
        type="text"
        value={data.id}
        ref={idRef}
        style={{ display: 'none' }}
        readOnly
      />
      {data.id}
      <span className='px-2'>
        <Button size="small" startIcon={<ContentCopyIcon />} onClick={()=>handleCopyClick(data.id)}>
        
        </Button>
      </span>
    </h3>
           
          <h3 class=" text-red-800 py-2"> <span className='text-red-600 text-md font-bold'>Purchesed Time:</span> 
  {new Date(data.timestamp).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', // Set the time zone to Indian Standard Time (IST)
    dateStyle: 'long',
  })}
</h3>
          <h3 class=" text-red-800"> <span className='text-red-600 text-md font-bold'>Valid Return Time:</span>
            {formattedDate}
          </h3>
          <h3 class=" text-red-800 font-bold text-md"><span className='text-red-600 text-md font-bold'> Quantity:</span>  { data.quantity}</h3>
        </div>
        
        <div class="prices">
          <div class="amount">{Math.floor(data.dprice)} &#8377;</div>
        </div>
      </div>
    );
  })
) : (
  <p>Loading cart...</p>
)} 
</div>
</div>
</div>
</div>

  )
}
