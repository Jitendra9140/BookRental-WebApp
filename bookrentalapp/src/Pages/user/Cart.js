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
import { useNavigate,Link} from "react-router-dom";
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

// Default image to use when book image fails to load
const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg';

// Function to handle image error with better error handling
const handleImageError = (event) => {
  console.log('Image failed to load, using fallback image');
  event.target.src = dummyImageUrl;
  // Remove onerror to prevent infinite loop if fallback also fails
  event.target.onerror = null;
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
<div className="sticky absolute font-serif top-0 left-0 z-20 shadow-md">
  <Navbar/>
</div>
<div class=" flex flex-row border mt-[0px]">
  <div class="w-1/5 h-screen max-[900px]:hidden">
    <div class="max-w-2xl py-10 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white shadow-xl rounded-lg text-gray-900">
      <div class="rounded-t-lg h-32 overflow-hidden bg-gradient-to-r from-white to-red-700">
        <div class="h-full w-full flex items-center justify-center text-blue text-opacity-20 text-4xl font-extrabold">RentYourBook</div>
      </div>
      <div class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden shadow-lg">
        <img class="object-cover object-center h-32" src={user.profilePic || 'https://via.placeholder.com/150'} alt='Profile' onError={(e) => e.target.src = 'https://via.placeholder.com/150'}/>
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
    <h3 class="Heading text-3xl font-extrabold text-gray-800 tracking-tight font-serif">Shopping Cart ({carts.length} items)</h3>
    <button
        onClick={() => {
          if(window.confirm('Are you sure you want to remove all items from your cart?')) {    
            dispatch(clearCart());
            toast.success('All items removed from cart');
          }
        }}
        disabled={carts.length === 0}
        class={`Action text-red-600 hover:text-red-800 transition-colors duration-300 ${carts.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        Remove all
      </button>
  </div >
<div className='overflow-y-scroll h-[80vh] px-4'>
    {carts.length > 0 ? (
       carts.map((data, key) => (
         <div class="Cart-Items shadow-sm hover:shadow-md transition-shadow duration-300 p-4 mb-4 rounded-lg" key={key}>
           <div class="image-box">
             <img 
               src={`${data.image}`} 
               alt={data.Subject || 'Book image'} 
               class="painting-image h-48 rounded-md object-contain" 
               onError={handleImageError}
             />
           </div>
           <div class="about flex flex-col font-serif space-y-1">
             <h2 className='font-bold text-xl font-serif text-gray-900 mb-3 tracking-tight'>{data.Subject}</h2>
             <h2 className='text-gray-800 font-bold text-md'>{data.publisher}</h2>
             <h3 class="text-red-800 text-md font-bold">
               <span className='text-red-600 font-bold text-md'>Pages:</span> {data.pages}
             </h3>
             <h3 class="text-red-800 font-bold text-md">
               <span className='text-red-600 text-md font-bold'>Original Price:</span> ₹{data.price}
             </h3>
             <h3 class="text-red-800 font-bold">
               <span className='text-red-600 text-md font-bold'>Discount Price:</span> ₹{Math.floor(data.price*75/100)}
             </h3>
             <h3 class="text-red-800 font-bold flex gap-5 flex-row min-[650px]:hidden">
               <span className='text-red-600 text-md font-bold'>Quantity:</span>  
               <div class="counterm flex items-center bg-gray-100 rounded-lg p-1">
                 <div class="btn hover:bg-red-100 rounded-full" onClick={()=>subtractQuantity(data)}>
                   <ArrowLeftIcon />
                 </div>
                 <div class="count px-2">{data.quantity || 0}</div>
                 <div class="btn hover:bg-red-100 rounded-full" onClick={()=>addQuantity(data)}>
                   <ArrowRightIcon />
                 </div>
               </div>
             </h3>
           </div>
           <div class="counter max-[650px]:hidden bg-gray-100 rounded-lg p-1">
             <div class="btn hover:bg-red-100 rounded-full" onClick={()=>subtractQuantity(data)}>
               <ArrowLeftIcon />
             </div>
             <div class="count px-2">{data.quantity || 0}</div>
             <div class="btn hover:bg-red-100 rounded-full" onClick={()=>addQuantity(data)}>
               <ArrowRightIcon />
             </div>
           </div>
           <div class="prices max-[500px]:hidden">
             <div class="amount text-3xl font-extrabold text-red-600 bg-red-50 px-5 py-3 rounded-lg shadow-sm">
               ₹{Math.floor(data.price * data.quantity * 75 / 100)}
             </div>
           </div>
         </div>
       ))
     ) : (
       <div class="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-red-800 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
         </svg>
         <h2 class="text-2xl font-bold text-red-800 mb-2">Your cart is empty</h2>
         <p class="text-gray-600 mb-6">Looks like you haven't added any books to your cart yet.</p>
         <Link to="/home" class="bg-red-800 text-white px-6 py-2 rounded-md hover:bg-red-900 transition-colors duration-300 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
           </svg>
           Continue Shopping
         </Link>
       </div>
     )}
    
    {carts.length > 0 && (
    <>
    <hr/> 
    <div class="checkout bg-white p-4 rounded-lg shadow-md">
      <div class="total mb-3">
        <div class="text-xl text-red-800 mt-2 font-serif font-bold">SubTotal:</div>
        <div class="total-amount text-red-800 font-bold">₹{Math.floor(price)}</div>
      </div>
      <div class="text-sm text-gray-500 mb-3">Shipping and taxes calculated at checkout</div>
      <button 
        class="button bg-red-800 hover:bg-red-900 transition-colors duration-300 rounded-md flex items-center justify-center gap-2" 
        onClick={checkout}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
        Proceed to Checkout
      </button>
    </div>
    </>
    )}
    </div>
    </div>
    </div>
    <ToastContainer/>
    </div>
    </div>
      )
    }
    
    
