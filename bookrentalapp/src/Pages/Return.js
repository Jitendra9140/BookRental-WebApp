import React, { useEffect, useState,useContext } from 'react'
import Navbar from './Navbar'
import { Button, TextField} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SendIcon from '@mui/icons-material/Send';
import {findinCart,deletcartbook} from "../Api/user"
import {addToBookCart, removeFromBookCart, updateBookCartItem  ,clearBookCart} from '../Redux/Action/bookSlice';
import { useDispatch , useSelector  } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {DataContext} from './Resetconteexr';
import { getbook} from '../Api/book';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Return() {
  const navigate=useNavigate()
  const {  setbookdel } = useContext(DataContext);
   const [bookid,setbookid]=useState();
   const [ returnBook ,setReturnBook]=useState([]) 
   const handlechange = (e) => {
    setbookid(e.target.value);
    console.log(e.target.value)
  };
  const [bookCart,setbookcart]=useState([])
  const [price ,setPrice]=useState();
  const { books } = useSelector((state) => state.bookcart);
  const [quantity,setQuantity]=useState(1);
  
  const dispatch = useDispatch();
  const userId=window.localStorage.getItem("Id")
   const findbook = async()=>{
    if(bookid){
      const response=await findinCart({userId,bookid});
      dispatch(addToBookCart(response.data))
      console.log(books);
    }
   }

   const deletebook =async()=>{
       const userId=window.localStorage.getItem("Id");
       const bookIdsToDelete = books.map((book) => book.id); 
       console.log(books)
       const response = await deletcartbook({userId,bookIdsToDelete,books})
       setTimeout(()=>{
       navigate('/invoice')
       },5000)
   }
   const calcPrice = () => {
    let totalprice = 0;
    books.forEach((ele) => {
      // console.log(ele.price)
      totalprice = Math.floor((ele.price*50/100)*(ele.aquantity)  + totalprice);
    });
    setPrice(totalprice);
    // console.log(totalprice)
  };
   const clearbook = () => {
    // Clear the bookid state
    setbookid('');
  };
  
  const addQuantity = async (item) => {
    try {
       console.log(books)
      console.log(item.aquantity);
      if (item.quantity>item.aquantity) {
        const updatedItem = { ...item, aquantity: item.aquantity +1 };
        dispatch(updateBookCartItem(updatedItem));
        console.log("Updated Item:", updatedItem);
      } else {
        toast.error("Cannot add more items than available in quantity.", { position: toast.POSITION.TOP_RIGHT });
      }
    } catch (error) {
      console.error("Error fetching quantity:", error);
    }
  };
  
  const subtractQuantity = (item) => {
    console.log(item.aquantity);
    if (item.aquantity >1) {
      const updatedItem = { ...item, aquantity: item.aquantity - 1 };
      console.log("Updated Item:", updatedItem);
      dispatch(updateBookCartItem(updatedItem));
    }
    else if(item.aquantity==1){
      alert("You want to not return this book")
      dispatch(removeFromBookCart(item));
    }
    else {
      toast.error("Cannot add more items than available in quantity.", { position: toast.POSITION.TOP_RIGHT });
    }
  };
  const removeAllBook =()=>{
    alert("You want to Remove all")
    dispatch(clearBookCart());
  }

  const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'; // Replace with your dummy image URL

  // Function to handle image error
  const handleImageError = (event) => {
    event.target.src = dummyImageUrl;
  };
  useEffect(() => {
    calcPrice(); 
  }, [books]);
  return (
    <div>
      <div className="sticky  top-0 left-0 z-20 shadow-md">
        <Navbar/>
        </div>
        <div className='flex flex-col items-center w-full '>
       <div className='flex flex-row gap-2 mt-5'>
       <TextField fullWidth className='bookid ' sx={{width: 200, color: 'success.main'}} label="Book Id" id="fullWidth" color="warning" name="id" value={bookid}  onChange={(e)=>{handlechange(e)}} />
      <div>
      <Button variant="outlined" color='secondary' sx={{width: 20, color: 'success.main'}} className='w-[100px] h-[50px]' onClick={findbook} endIcon={<SendIcon />}>

</Button>
</div>
        <div className="">
        <Button variant="outlined" color='error' className='w-[100px] h-[50px]' sx={{width: 20, color: 'error.main'}}  onClick={clearbook} startIcon={<DeleteIcon />}>
    
      </Button>
        </div>
        </div>
       <div className='w-full flex flex-col item-ceter'>
       <div className="">
 <div class="Header flex  flex-row justify-between">
   <h3 class="Heading">Return Book</h3>
   <h5 class="Action cursor-pointer" onClick={()=>{removeAllBook()}}>Remove all</h5>
 </div >
 {books?(
  books.map((data, key) => ( 
    <div class=" flex flex-row   justify-around shadow-md  py-3 px-3" key={key}>
      <div class="image-box flex flex-col  max-[480px]:hidden">
        <img src={`${data.image}`} onError={handleImageError} class="img" />
      </div>
      <div class="about flex flex-col">
      <h1 class=" title max-[450px:]text-[3px]  text-red-800">
            {data.title}
          </h1>
          <h3 className="text-red-800 font-bold text-md text-xl">
      <span className="text-red-600 text-md font-bold">Book Id:</span>
        {data.id}
    </h3>
    <h3 class=" text-red-800 font-bold text-md"><span className='text-red-600 text-md font-bold'> Original Price:</span>  ⟨₹⟩ { data.price}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'> Discount Price:</span>  ⟨₹⟩ { Math.floor(data.price*75/100)}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'>After Return:</span>  ⟨₹⟩ { Math.floor(data.price*50/100)}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'>Available Quantity:</span>{data.quantity}</h3>
       <h3 class=" text-red-800 font-bold flex flex-row  min-[650px]:hidden"><span className='text-red-600 text-md font-bold'>Return Quantity:</span>
       <div className='flex flex-row'>
                    <div className="product-quantity-subtract btn" onClick={()=>subtractQuantity(data,key)} >
                    <ArrowLeftIcon />
                  </div>
                  <div className="bg-white  h-20px  flex items-center text-center " >{data.aquantity}</div>
                  <div className="product-quantity-add btn" onClick={()=>addQuantity(data,key)}>
                    <ArrowRightIcon />
                  </div>
        </div>
       </h3>
       
      </div>

      <div class="prices max-[650px]:hidden">
        <div class="amount ">{Math.floor(data.price*50/100)} &#8377;</div>
         <div className='flex flex-row'>
                    <div className="product-quantity-subtract btn" onClick={()=>subtractQuantity(data,key)} >
                    <ArrowLeftIcon />
                  </div>
                  <div className="bg-white  h-20px  flex items-center text-center " >{data.aquantity}</div>
                  <div className="product-quantity-add btn" onClick={()=>addQuantity(data,key)}>
                    <ArrowRightIcon />
                  </div>
        </div>
      </div>
            
    </div>
  ))
) : (
  <div>No books in the cart</div>
)}
<hr/> 
<div class="checkout mb-10">
<div class="total  mt-5">
 <div>
   <div class="text-3xl text-red-500 font-extrabold">SubTotal :</div>
 </div>
 <div class="total-amount">
  {price} &#8377;
  </div>
</div>
<button class="button bg-red-800" 
onClick={deletebook}
>Return</button></div>
        </div>
       </div>
        </div>
        <ToastContainer/>
</div>
   
  )
}





