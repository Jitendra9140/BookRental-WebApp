import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { findUserByID, cart } from '../../Api/user';
import { getbook} from '../../Api/book';
import { createPurchaseInvoice } from '../../Api/invoice';
import '../../Style/cart.css';
import { addToCart, removeFromCart, updateCartItem, clearCart  } from '../../Redux/Action/cartSlice';
import Navbar from '../../Components/common/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
export default function Cart() {
const { id } = useParams();
const [price, setPrice] = useState();
const navigate=useNavigate()
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
  try {
    if (!id || id === 'null' || id === 'undefined') {
      console.error("Invalid user ID provided to getuser");
      throw new Error("Invalid user ID");
    }
    
    const response = await findUserByID(id);
    
    if (!response || !response.data) {
      console.error("Invalid response from findUserByID API", response);
      throw new Error("Failed to fetch user data");
    }
    
    setUser(response.data.user || response.data);
  } catch (error) {
    console.error("Error in getuser function:", error);
    throw error; // Re-throw to be handled by the caller
  }
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
const getQuantity = async (id) => {
  try {
    if (!id) {
      console.error("Invalid book ID provided to getQuantity");
      return null;
    }
    
    const response = await getbook(id);
    
    // Check if response exists and has the expected structure
    if (!response || !response.data) {
      console.error("Invalid response from getbook API", response);
      return null;
    }
    
    // Check if the response contains book data with quantity
    if (response.data.book && response.data.book.quantity !== undefined) {
      return response.data.book.quantity;
    } else if (response.data.quantity !== undefined) {
      return response.data.quantity;
    } else {
      console.error("Quantity not found in response", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error in getQuantity function:", error);
    return null;
  }
}

const addQuantity = async (item) => {
  try {
    // Check if item._id exists
    if (!item || !item._id) {
      console.error("Invalid item or missing item ID");
      toast.error("Error: Cannot update item quantity", { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    const originalQuantity = await getQuantity(item._id);
    console.log("Original Quantity:", originalQuantity);

    // Check if originalQuantity is undefined or null
    if (originalQuantity === undefined || originalQuantity === null) {
      console.error("Could not retrieve original quantity");
      toast.error("Error: Could not check available stock", { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    // Ensure item.quantity is a number
    const currentQuantity = Number(item.quantity) || 0;

    if (currentQuantity < originalQuantity) {
      const updatedItem = { ...item, quantity: currentQuantity + 1 };
      dispatch(addToCart(updatedItem));
      console.log("Updated Item:", updatedItem);
    } else {
      toast.error("Cannot add more items than available in stock.", { position: toast.POSITION.TOP_RIGHT });
    }
  } catch (error) {
    console.error("Error fetching quantity:", error);
    toast.error("Error updating quantity", { position: toast.POSITION.TOP_RIGHT });
  }
};

const subtractQuantity = (item) => {
  try {
    // Check if item exists
    if (!item) {
      console.error("Invalid item provided to subtractQuantity");
      return;
    }
    
    // Ensure item.quantity is a number
    const currentQuantity = Number(item.quantity) || 0;
    
    if (currentQuantity > 1) {
      const updatedItem = { ...item, quantity: currentQuantity - 1 };
      dispatch(updateCartItem(updatedItem));
      console.log("Updated Item (decreased quantity):", updatedItem);
    } else {
      dispatch(removeFromCart(item));
      console.log("Removed item from cart:", item);
    }
  } catch (error) {
    console.error("Error in subtractQuantity function:", error);
    toast.error("Error updating quantity", { position: toast.POSITION.TOP_RIGHT });
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
    console.log("Processing checkout");
    const amount = price;
    const requestData = {
      amount: amount,
      userId: id,
      userName: user.fname,
      userEmail: user.email,
      userPhone: user.phone || '',
      cartItems: purbook
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
      // In the imports section, add clearCart
 
      
      // Then update the handler function in the checkout method
      handler: function (response) {
      // Payment successful, now call cart function
      console.log("Payment Successful", response);
      cart(purbook, id);
      
      // Create purchase invoice
      try {
        // Create invoice data
        const invoiceData = {
          userId: id,
          items: purbook.map(item => ({
            bookId: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            quantity: item.quantity || 1
          })),
          paymentId: response.razorpay_payment_id
        };
        
        // Call the invoice API using the imported function
        createPurchaseInvoice(invoiceData)
          .then(response => {
            if (response && response.data && response.data.success) {
              console.log('Purchase invoice created:', response.data);
            } else {
              console.warn('Invoice creation response not as expected:', response);
            }
          })
          .catch(err => console.error('Error creating purchase invoice:', err));
      } catch (err) {
        console.error('Error preparing invoice data:', err);
      }
      
      // Clear the cart after successful payment
      dispatch(clearCart());
      
      // Show success message to user
      toast.success("Payment successful! Your books have been purchased.", { 
        position: toast.POSITION.TOP_RIGHT 
      });
      
      // Redirect to purchase history page
      setTimeout(() => {
        navigate('/invoice');
      }, 2000);
      },
      modal: {
        ondismiss: function () {
          console.log("Payment popup closed by user");
        }
      }
    };

    const razor = new window.Razorpay(options);
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
  // Check if ID is valid before proceeding
  if (!id || id === 'null' || id === 'undefined') {
    toast.error("Please login to view your cart");
    navigate("/"); // Redirect to login page
    return;
  }
  
  // Proceed with existing code
  calcPrice();
  checkPurchase();
  
  // Fetch user data with error handling
  const fetchUserData = async () => {
    try {
      await getuser();
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error loading user information");
    }
  };
  
  fetchUserData();
}, [carts, id, navigate]);

  return (
<div>
<div className="sticky absolute  font-serif top-0 left-0 z-20 shadow-md">
    <Navbar/>
</div>
<div class="w-full flex flex-row ">
    <div class=" w-1/5 h-screen max-[900px]:hidden">
        <div class="max-w-2xl py-10   sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto  bg-white shadow-xl rounded-lg text-gray-900">
            <div class="rounded-t-lg h- overflow-hidden">
              <img class="object-cover object-top w-full" src={user.profilePic} alt='Mountain'/>
            </div>
            <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
              <img class="object-cover object-center h-32" src={user.profilePic} alt='Woman looking front'/>
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
<img src={`${data.image}`} alt='img'  class="painting-image h-48" onError={handleImageError}/>
  </div>
     <div class="about flex flex-col font-serif ">
     <h2 className='font-bold text-xl font-serif text-red-800 '> {data.Subject} </h2>

     <h2 className='text-red-800 font-bold text-md'>{data.publisher}</h2>
     
       <h3 class=" text-red-800 text-md font-bold "><span className='text-red-600 font-bold text-md'> Pages:</span>{ data.pages}</h3>
       <h3 class=" text-red-800 font-bold text-md"><span className='text-red-600 text-md font-bold'> Original Price:</span>  ⟨₹⟩ { data.price}</h3>
       <h3 class=" text-red-800 font-bold"><span className='text-red-600 text-md font-bold'> Discount Price:</span>  ⟨₹⟩ { Math.floor(data.price*75/100)}</h3>
       <h3 class=" text-red-800 font-bold flex gap-5 flex-row min-[650px]:hidden"><span className='text-red-600 text-md font-bold'> Quantity:</span>  
       <div class="counterm ">
       <div class="btn" onClick={()=>subtractQuantity(data)}> <ArrowLeftIcon /></div>
       <div class="count">
    
                   {data.quantity || 0} 
                    </div>
       <div class="btn" onClick={()=>addQuantity(data)}> <ArrowRightIcon /></div>
     </div>
       </h3>
     </div>
     <div class="counter max-[650px]:hidden">
       <div class="btn" onClick={()=>subtractQuantity(data)}> <ArrowLeftIcon /></div>
       <div class="count">
    
                   {data.quantity || 0} 
                    </div>
       <div class="btn" onClick={()=>addQuantity(data)}> <ArrowRightIcon /></div>
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
  <div class=" text-xl text-red-800 mt-2 font-serif">SubTotal :</div>
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
