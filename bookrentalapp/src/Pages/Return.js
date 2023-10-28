import React, { useEffect, useState,useContext } from 'react'
import Navbar from './Navbar'
import { Button, TextField} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {findinCart,deletcartbook} from "../Api/user"
import {addToBookCart, removeFromBookCart, updateBookCartItem } from '../Redux/Action/bookSlice';
import { useDispatch , useSelector  } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DataContextProvider ,{DataContext} from './Resetconteexr';
export default function Return() {
  const {  setbookdel } = useContext(DataContext);
  const navigate=useNavigate()
   const [bookid,setbookid]=useState();
   const handlechange = (e) => {
    setbookid(e.target.value);
    console.log(e.target.value)
  };
  const [bookCart,setbookcart]=useState([])
  const [price ,setPrice]=useState();
  const { books } = useSelector((state) => state.bookcart);
  
  const dispatch = useDispatch();
  const userId=window.localStorage.getItem("Id")
   const findbook = async()=>{
    if(bookid){
      const response=await findinCart({userId,bookid});
      // console.log(response.data)
      dispatch(addToBookCart(response.data))
      console.log(books)
    }
   }

   console.log(books);
   const deletebook =async()=>{
       const userId=window.localStorage.getItem("Id");
       const bookIdsToDelete = books.map((book) => book.id);
       console.log(bookIdsToDelete)
       const response = await deletcartbook({userId,bookIdsToDelete})
       setTimeout(()=>{
       navigate('/invoice')
       },5000)
      //  setbookdel(bookIdsToDelete)
      //  console.log(response.data.message);
   }
   const calcPrice = () => {
    let totalprice = 0;
    books.forEach((ele) => {
      console.log(ele.price)
      totalprice = ele.price*50/100  + totalprice;
    });
    setPrice(totalprice);
    console.log(totalprice)
  };
   const clearbook = () => {
    // Clear the bookid state
    setbookid('');
  };
  useEffect(() => {
    calcPrice();
  }, [books]);
  return (
    <div>
      <div className="sticky absolute top-0 left-0 z-20 shadow-md">
        <Navbar/>
        </div>
        
        <div className='flex flex-col items-center '>
          

       <div className='flex flex-row gap-2 w-100'>
       <TextField fullWidth className='bookid' label="Book Id" id="fullWidth" color="warning" name="id" value={bookid}  onChange={(e)=>{handlechange(e)}} />
      <div>
      <Button variant="outlined" color='secondary' className='w-[100px] h-[50px]' onClick={findbook} endIcon={<SendIcon />}>
  Send
</Button>
</div>
        <div className="">
        <Button variant="outlined" color='error' className='w-[100px] h-[50px]' onClick={clearbook} startIcon={<DeleteIcon />}>
        Delete
      </Button>
        </div>
        </div>
       <div className='w-[80%] flex flex-col item-ceter'>
       <div className="">
 <div class="Header flex  flex-row justify-between">
   <h3 class="Heading">Shopping Cart</h3>
   <h5 class="Action">Remove all</h5>
 </div >
 {books?(
  books.map((data, key) => ( 
    <div class=" flex flex-row   justify-around shadow-md  py-3" key={key}>
      <div class="image-box">
        <img src={`${data.image}`} class="painting-image" />
      </div>
      <div class="about flex flex-col">
      <h1 class=" title text-red-800">
            {data.title}
          </h1>
          <h3 className="text-red-800 font-bold text-md text-xl">
      <span className="text-red-600 text-md font-bold">Book Id:</span>
      <input
        type="text"
        value={data.id}
        readOnly
      />
      {data.id}
    </h3>
    <h3 class=" text-red-800 font-bold text-md"><span className='text-red-600 text-md font-bold'> Original Price:</span>  ⟨₹⟩ { data.price}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'> Discount Price:</span>  ⟨₹⟩ { Math.floor(data.price*75/100)}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'>After Return:</span>  ⟨₹⟩ { Math.floor(data.price*50/100)}</h3>
       
      </div>

      <div class="prices">
        <div class="amount ">{Math.floor(data.price*50/100)} &#8377;</div>
      </div>
    </div>
  ))
) : (
  <div>No books in the cart</div>
)}
<hr/> 
<div class="checkout mb-10">
<div class="total ">
 <div>
   <div class="Subtotal">Sub-Total</div>
 </div>
 <div class="total-amount">
  {price}
  </div>
</div>
<button class="button bg-red-800" 
onClick={deletebook}
>Return</button></div>
        </div>
       </div>
        </div>
</div>
   
  )
}
