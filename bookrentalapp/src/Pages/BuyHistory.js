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
      const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'; // Replace with your dummy image URL

      // Function to handle image error
      const handleImageError = (event) => {
        event.target.src = dummyImageUrl;
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
<div class=" flex flex-row  border   mt-[0px]">
    <div class=" w-1/5 h-screen  max-[900px]:hidden ">
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
  <div class=" w-full  ">
 <div class="">
 <div class="Header pt-5">
   <h3 class="Heading  ">Purchesed Book</h3>
   <h5 class="Action"> All Books</h5>
 </div >
<div className='overflow-y-scroll h-[80vh]'>
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
      <div class="flex flex-row justify-around pt-5  " key={key}>
        <div class="w-[20%] h-[200px] max-[500px]:hidden  flex flex-col  item-center justify-center" >
          <img src={`${data.image}`} class="painting-image h-full  object-fit: contain;" onError={handleImageError}  />
        </div>
        <div class="  flex flex-col gap-1 max-[400px]:gap-[0px]">
          <h1 class=" title text-red-800">
            {data.title}
          </h1>
          <h3 className="text-red-800 font-bold text-md text-xl flex flex-row">
      <span className="text-red-600 text-md font-bold">Book Id:</span>
      <h1 class="text-[15px] text-red-800">
            {data.id}
        </h1>
      {/* <span className='px-2'>
        <Button size="small" startIcon={<ContentCopyIcon />} onClick={()=>handleCopyClick(data.id)}>
        
        </Button>
      </span> */}
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
          <h3 class=" text-red-800 font-bold text-md"><span className='text-red-600 text-md font-bold'>Price</span> {Math.floor(data.dprice)} &#8377;</h3>
        </div>
        
        <div class="prices max-[900px]:hidden">
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
</div>

  )
}
