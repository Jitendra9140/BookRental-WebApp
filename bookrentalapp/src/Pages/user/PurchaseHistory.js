import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../../Components/common/Navbar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import '../../Style/history.css';
import { Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { UserContext } from '../../contexts/UserContext';

export default function PurchaseHistory() {
    const { user, loading: userLoading } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const id = user ? user._id : window.localStorage.getItem('Id');
    
    useEffect(() => {
      if (user) {
        setLoading(false);
      }
    }, [user]);
      
      const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'; // Replace with your dummy image URL

      // Function to handle image error
      const handleImageError = (event) => {
        event.target.src = dummyImageUrl;
      };
      // setBook(user.cart[0])
      const [copySuccess, setCopySuccess] = useState('');
      const [copiedId, setCopiedId] = useState(null);
      
      const handleCopyClick = (val) => {
        navigator.clipboard.writeText(val)
          .then(() => {
            setCopySuccess('Copied!');
            setCopiedId(val);
            setTimeout(() => {
              setCopySuccess('');
              setCopiedId(null);
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      };
      
    console.log(`User Cart: ${JSON.stringify(user.cart, null, 2)}`);

    useEffect(() => {
      // Loading state is now managed by the UserContext
      setLoading(userLoading);
    }, [userLoading]);
    
  return (
    <div>
       <div className="sticky absolute top-0 left-0 z-20 shadow-md">
    <Navbar/>
</div>  
<div class=" flex flex-row  border   mt-[0px]">
    <div class=" w-1/5 h-screen  max-[900px]:hidden ">
        <div class="max-w-2xl py-10   sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto  bg-white shadow-xl rounded-lg text-gray-900">
            <div class="rounded-t-lg h-32 overflow-hidden bg-gradient-to-r from-white to-red-700">
              <div class="h-full w-full flex items-center justify-center text-blue text-opacity-20 text-4xl font-extrabold">RentYourBook</div>
            </div>
            <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden shadow-lg">
              <img class="object-cover object-center h-32" src={user.profilePic} alt='User profile'/>
            </div>
            <div class="text-center mt-2">
              <h2 class="font-bold text-xl text-gray-800">{user.fname}</h2>
              <p class="text-gray-500 font-medium">{user.email}</p>
            </div>
          </div> 
    </div>
  <div class=" w-full  ">
 <div class="">
 <div class="Header pt-5 flex justify-between items-center px-4 mb-6">
    <h3 class="Heading text-3xl font-extrabold text-gray-800 tracking-tight font-serif">Purchased Books</h3>
    <h5 class="Action bg-white text-white px-4 py-2 rounded-md hover:bg-red-300 transition-colors cursor-pointer font-semibold shadow-sm">All Books</h5>
  </div >
<div className='overflow-y-scroll h-[80vh] px-4'>
 {loading ? (
   <div className="flex justify-center items-center py-10">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-red-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-36 bg-gray-100 rounded"></div>
      </div>
    </div>
 ) : user.cart && user.cart.length > 0 ? (
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
      <div class="flex flex-row justify-around pt-5 p-6 mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100" key={key}>
        <div class="w-[20%] h-[200px] max-[500px]:hidden  flex flex-col  item-center justify-center" >
          <img src={`${data.image}`} class="painting-image h-full  object-fit: contain;" onError={handleImageError}  />
        </div>
        <div class="  flex flex-col gap-1 max-[400px]:gap-[0px]">
          <h1 class="title text-xl font-bold text-gray-900 mb-3 font-serif tracking-tight">
            {data.title}
          </h1>
          <h3 className="text-gray-800 font-bold text-lg flex flex-row items-center gap-2 mb-2">
      <span className="text-red-600 text-md font-bold min-w-[150px]">Book Id:</span>
      <div class="flex items-center bg-gray-50 py-1 rounded-md border border-gray-200 transition-all duration-300 hover:shadow-md">
        <span className="text-[15px] font-mono text-gray-800 mr-2">{data.id}</span>
        <Tooltip title={copySuccess || "Copy to clipboard"} placement="top" arrow>
          <div onClick={() => handleCopyClick(data.id)} className="cursor-pointer hover:text-blue-500 transition-colors">
            {copiedId === data.id ? 
              <CheckCircleIcon fontSize="small" className="text-green-500" /> : 
              <ContentCopyIcon fontSize="small" />}
          </div>
        </Tooltip>
      </div>
    </h3>
           
          <h3 class="text-gray-800 py-2 flex flex-row items-center mb-1 hover:bg-gray-50 px-2 rounded transition-colors"> 
            <span className='text-red-600 text-md font-bold min-w-[150px]'>Purchased Time:</span> 
            <span className="text-gray-700  px-3 font-medium">
              {new Date(data.timestamp).toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                dateStyle: 'long',
              })}
            </span>
          </h3>
          <h3 class="text-gray-800 py-2 flex flex-row items-center mb-1 hover:bg-gray-50 px-2 rounded transition-colors"> 
            <span className='text-red-600 text-md font-bold min-w-[150px]'>Valid Return Time:</span>
            <span className="text-gray-700 px-2 font-medium">{formattedDate}</span>
          </h3>
          <h3 class="text-gray-800 py-2 flex flex-row items-center mb-1 hover:bg-gray-50 px-2 rounded transition-colors"> 
            <span className='text-red-600 text-md font-bold min-w-[150px]'>Quantity:</span>  
            <span className="text-gray-700 font-medium px-1 py-1 rounded-full">{ data.quantity}</span>
          </h3>
          <h3 class="text-gray-800 py-2 flex flex-row items-center mb-1 hover:bg-gray-50 px-2 rounded transition-colors"> 
            <span className='text-red-600 text-md font-bold min-w-[150px]'>Price:</span> 
            <span className="text-gray-900 font-bold px-3 py-1 ">{Math.floor(data.dprice)} &#8377;</span>
          </h3>
        </div>
        
        <div class="prices max-[900px]:hidden flex items-center">
          <div class="amount text-3xl font-extrabold text-red-600 bg-red-50 px-5 py-3 rounded-lg shadow-sm">{Math.floor(data.dprice)} &#8377;</div>
        </div>
      </div>
    );
  })
) : (
  <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="text-5xl mb-4">📚</div>
      <p className="text-xl font-semibold text-gray-700 mb-2">You haven't purchased any books yet.</p>
      <p className="text-gray-500">Your purchase history will appear here once you buy books.</p>
    </div>
)} 
</div>
</div>
</div>
</div>
</div>

  )
}
