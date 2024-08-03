import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { findUserByID, cart } from '../Api/user';
import { getbook} from '../Api/book';
import '../Style/cart.css';
import { addToCart, removeFromCart, updateCartItem } from '../Redux/Action/cartSlice';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Cart() {
const { id } = useParams();
const [price, setPrice] = useState();
const [user, setUser] = useState({
  fname: '',
  lname: '',
  email: '',
  password: '',
  profilePic: '',
});

const [purbook, setPurbook] = useState([
  {
    id: '',
    title: '',
    quantity: '',
    price: '',
    dprice: '',
    image: '',
  },
]);

const getuser = async () => {
  const response = await findUserByID(id);
  setUser(response.data);
};

const { carts } = useSelector((state) => state.cart);
const [quantity, setQuantity] = useState(1);

const calcPrice = () => {
  let totalprice = 0;
  carts.forEach((ele) => {
    totalprice = ele.price * 75/100*ele.quantity + totalprice;
  });
  setPrice(totalprice);
};
const dispatch = useDispatch();
const getQuantity= async (id)=>{
 const response= await getbook(id);
   return response.data.quantity;
}

const addQuantity = async (item) => {
  try {
    const originalQuantity = await getQuantity(item._id);
    console.log("Original Quantity:", originalQuantity);

    if (item.quantity < originalQuantity) {
      const updatedItem = { ...item, quantity: item.quantity + 1 };
      dispatch(addToCart(updatedItem));
      console.log("Updated Item:", updatedItem);
    } else {
      toast.error("Cannot add more items than available in stock.", { position: toast.POSITION.TOP_RIGHT });
    }
  } catch (error) {
    console.error("Error fetching quantity:", error);
  }
};

const subtractQuantity = (item) => {
  if (item.quantity > 1) {
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    dispatch(updateCartItem(updatedItem));
  } else {
    dispatch(removeFromCart(item));
  }
};



const checkPurchase = () => {
  const purchases = carts.map((ele) => ({
    id: ele._id,
    image: ele.image,
    price: ele.price,
    quantity: ele.quantity,
    dprice: (ele.price * 75) / 100, // Corrected the discount calculation
    title: ele.title,
  }));
  setPurbook(purchases);
};

const checkout = async () => {
  try {
    console.log("Jitendra")
    const amount = price;
    const requestData = {
      amount: amount,
      userId: id,
      userName: user.fname,
    };

    const { data: { key } } = await axios.get('http://localhost:8000/pay/getkey');
    const { data: { order } } = await axios.post('http://localhost:8000/checkout', requestData);

    const options = {
      key,
      amount: order.amount,
      currency: 'INR',
      name: 'Jitendra Yadav',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo',
      order_id: order.id,
      callback_url: 'http://localhost:8000/payvarify',
      prefill: {
        name: 'Jitendra Yadav',
        email: 'yadavjayup72@example.com',
        contact: '9137299206',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const razor = new window.Razorpay(options);
      cart(purbook, id);
    // Open the Razorpay payment window
    razor.open();
  } catch (error) {
    console.log('Error Occurred in checkout: ' + error);
  }
};
const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'; // Replace with your dummy image URL

// Function to handle image error
const handleImageError = (event) => {
  event.target.src = dummyImageUrl;
};

useEffect(() => {
  calcPrice();
  checkPurchase();
  getuser();
}, [carts, id]);

  return (
<div>
<div className="sticky absolute top-0 left-0 z-20 shadow-md">
    <Navbar/>
</div>
<div class="w-full flex flex-row">
    <div class=" w-1/5 h-screen max-[900px]:hidden">
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
    <div class="w-full px-5 pt-5">
 <div class="">
 <div class="Header">
   <h3 class="Heading">Shopping Cart</h3>
   <h5 class="Action">Remove all</h5>
 </div>
 { carts.map((data,key)=> 
 <div class="Cart-Items " key={key} >
     <div class="image-box">
<img src={`${data.image}`} alt='img'  class="painting-image" onError={handleImageError}/>
  </div>
     <div class="about flex flex-col ">
     <h1 className='title text-red-800 '> {data.Subject} </h1>
     <h2 className='text-red-800 font-bold text-md'>{data.publisher}</h2>
     
       <h3 class=" text-red-800 "><span className='text-red-600 text-md font-bold'> Pages:</span>{ data.pages}</h3>
       <h3 class=" text-red-800 font-bold text-md"><span className='text-red-600 text-md font-bold'> Original Price:</span>  ⟨₹⟩ { data.price}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'> Discount Price:</span>  ⟨₹⟩ { Math.floor(data.price*75/100)}</h3>
       <h3 class=" text-red-800 font-bold flex gap-5 flex-row min-[650px]:hidden"><span className='text-red-600 text-md font-bold'> Quantity:</span>  
       <div class="counterm ">
       <div class="btn" onClick={()=>subtractQuantity(data,key)}> <ArrowLeftIcon /></div>
       <div class="count">
    
                   {data.quantity} 
                    </div>
       <div class="btn" onClick={()=>addQuantity(data,key)}> <ArrowRightIcon /></div>
     </div>
       </h3>
     </div>
     <div class="counter max-[650px]:hidden">
       <div class="btn" onClick={()=>subtractQuantity(data,key)}> <ArrowLeftIcon /></div>
       <div class="count">
    
                   {data.quantity} 
                    </div>
       <div class="btn" onClick={()=>addQuantity(data,key)}> <ArrowRightIcon /></div>
     </div>
     <div class="prices max-[500px]:hidden">
       <div class="amount " >{Math.floor(data.price * data.quantity * 75 / 100)} &#8377;</div>
     </div>
 </div>
 )
 }
<hr/> 
<div class="checkout">
<div class="total">
  <div class="Subtotal mt-2">SubTotal :</div>
 <div class="total-amount">{Math.floor(price)} &#8377;</div>
</div>
<button class="button bg-red-800" onClick={checkout}>Checkout</button></div>
</div>
</div>
</div>
<ToastContainer/>
</div>
  )
}
