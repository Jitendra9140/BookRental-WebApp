import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { findUserByID, cart } from '../Api/user';
import '../Style/cart.css';
import { addToCart, removeFromCart, updateCartItem } from '../Redux/Action/cartSlice';
import Navbar from './Navbar';
import { useDispatch, useSelector } from 'react-redux';
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

const addQuantity = (item) => {
  const updatedItem = { ...item, quantity: item.quantity + 1 };
  dispatch(addToCart(updatedItem));
};

const subtractQuantity = (item) => {
  if (item.quantity > 1) {
    const updatedItem = { ...item, quantity: item.quantity - 1 };
    dispatch(updateCartItem(updatedItem));
  } else {
    dispatch(removeFromCart(item));
  }
};

const handleBlur = (e) => {
  const value = parseInt(e.target.value);
  setQuantity(value);
  calcPrice(value);
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
   <h3 class="Heading">Shopping Cart</h3>
   <h5 class="Action">Remove all</h5>
 </div>
 { carts.map((data,key)=> 
 <div class="Cart-Items" key={key} >
     <div class="image-box">
<img src={`${data.image}`}  class="painting-image"/>
  </div>
     <div class="about flex flex-col ">
     <h1 className='title text-red-800'> {data.Subject} </h1>
     <h2 className='text-red-800 font-bold text-md'>{data.publisher}</h2>
     
       <h3 class=" text-red-800 "><span className='text-red-600 text-md font-bold'> Pages:</span>{ data.pages}</h3>
       <h3 class=" text-red-800 font-bold text-md"><span className='text-red-600 text-md font-bold'> Original Price:</span>  ⟨₹⟩ { data.price}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'> Discount Price:</span>  ⟨₹⟩ { data.price*75/100}</h3>
     </div>
     <div class="counter">
       <div class="btn" onClick={()=>addQuantity(data)}>+</div>
       <div class="count">
    
                   {data.quantity}
                    </div>
       <div class="btn" onClick={()=>subtractQuantity(data)}>-</div>
     </div>
     <div class="prices">
       <div class="amount " >{Math.floor(data.price * data.quantity * 75 / 100)} &#8377;</div>
     </div>
 </div>
 )
 }

<hr/> 
<div class="checkout">
<div class="total">
 <div>
   <div class="Subtotal">Sub-Total</div>
   <div class="items">2 items</div>
 </div>
 <div class="total-amount">{Math.floor(price)}</div>
</div>
<button class="button bg-red-800" onClick={checkout}>Checkout</button></div>
</div>
</div>
</div>
</div>
  )
}
