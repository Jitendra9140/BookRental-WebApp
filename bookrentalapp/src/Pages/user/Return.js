import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/common/Navbar';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SendIcon from '@mui/icons-material/Send';
import { findinCart, deletcartbook, findUserByID } from '../../Api/user';
import { addToBookCart, removeFromBookCart, updateBookCartItem, clearBookCart } from '../../Redux/Action/bookSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Return() {
  const navigate = useNavigate();
  const [bookid, setbookid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(0);

  const { books } = useSelector((state) => state.bookcart);
  const dispatch = useDispatch();
  const userId = window.localStorage.getItem('Id');

  const handlechange = (e) => setbookid(e.target.value);

  const findbook = async () => {
    if (!bookid) return toast.error("Enter a Book ID");

    try {
      setLoading(true);
      const response = await findinCart({ userId, bookid });
      if (response?.data?.success) {
        const bookData = response.data.cartItem;
        bookData.aquantity = 1;
        dispatch(addToBookCart(bookData));
        toast.success("Book added to return list");
        setbookid('');
      } else {
        toast.error("Book not found in your purchases");
      }
    } catch (err) {
      toast.error("Failed to find book");
    } finally {
      setLoading(false);
    }
  };

  const deletebook = async () => {
    if (books.length === 0) return toast.error("No books to return");

    const confirmMessage = books.length > 1 
      ? `Are you sure you want to return these ${books.length} books?` 
      : `Are you sure you want to return ${books[0].aquantity} copy/copies of \"${books[0].title}\"?`;

    if (!window.confirm(confirmMessage + " This action cannot be undone.")) return;

    try {
      setLoading(true);
      const userRes = await findUserByID(userId);
      const userCart = userRes?.data?.user?.cart || [];

      const bookIdsToDelete = [];
      const booksToUpdate = [];
      const partialReturns = [];

      for (const book of books) {
        const cartItem = userCart.find(item => item.id === book.id);
        if (!cartItem) continue;

        const remainingQty = cartItem.quantity - book.aquantity;

        if (remainingQty <= 0) {
          bookIdsToDelete.push(book.id);
        } else {
          booksToUpdate.push({ id: book.id, newQuantity: remainingQty });
        }

        partialReturns.push({ ...book, timestamp: new Date().toISOString() });
      }

      if (partialReturns.length === 0) {
        toast.error("No valid return items found");
        return;
      }

      // Make sure all required parameters are properly defined and not undefined
      if (!userId) {
        console.error("User ID is undefined");
        toast.error("User ID is missing");
        return;
      }

      // Log the parameters being sent to the API
      console.log("Sending to API:", {
        userId,
        partialReturns,
        bookIdsToDelete,
        booksToUpdate
      });

      await deletcartbook({
        userId,
        partialReturns,
        bookIdsToDelete,
        booksToUpdate
      });

      // Clear the Redux store to reset the return page state
      dispatch(clearBookCart());
      
      // Refresh the user's cart data to show updated state
      await refreshUserCart();
      
      toast.success("Books returned successfully. Redirecting to invoice...");
      
      // Create a return invoice directly instead of using localStorage
      try {
        const response = await fetch('http://localhost:8000/invoice/return', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            items: books.map(book => ({
              bookId: book.id,
              title: book.title,
              image: book.image,
              price: book.price,
              quantity: book.aquantity || 1
            }))
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create return invoice');
        }
        
        const data = await response.json();
        console.log('Return invoice created:', data);
      } catch (err) {
        console.error('Error creating return invoice:', err);
      }
      
      // Navigate to invoice page after a short delay
      setTimeout(() => {
        navigate('/invoice');
      }, 2000);

    } catch (err) {
      console.error("Return error:", err);
      toast.error("Return failed");
    } finally {
      setLoading(false);
    }
  };

  const calcPrice = () => {
    const total = books.reduce((sum, b) => sum + Math.floor(b.price * 0.5) * b.aquantity, 0);
    setPrice(total);
  };
  const clearbook = () => setbookid('');

  const addQuantity = (item) => {
    if (item.quantity > item.aquantity) {
      dispatch(updateBookCartItem({ ...item, aquantity: item.aquantity + 1 }));
    } else {
      toast.error("Cannot add more than purchased amount");
    }
  };

  const subtractQuantity = (item) => {
    if (item.aquantity > 1) {
      dispatch(updateBookCartItem({ ...item, aquantity: item.aquantity - 1 }));
    } else if (window.confirm("Remove this book from return list?")) {
      dispatch(removeFromBookCart(item));
    }
  };

  const removeAllBook = () => {
    if (window.confirm("Remove all books from return list?")) dispatch(clearBookCart());
  };

  const showRemainingBooks = async () => {
    try {
      const userRes = await findUserByID(userId);
      const cart = userRes?.data?.user?.cart || [];
      if (!cart.length) return toast.info("No books in your purchase history");

      const msg = cart.map(b => `${b.title} (ID: ${b.id}) - Qty: ${b.quantity}`).join('\n');
      alert("Your purchased books:\n" + msg);
    } catch (err) {
      toast.error("Failed to fetch purchases");
    }
  };

  const dummyImageUrl = 'https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg';
  const handleImageError = (e) => (e.target.src = dummyImageUrl);

  useEffect(() => calcPrice(), [books]);

  // Function to refresh user cart data
  const refreshUserCart = async () => {
    if (!userId) return;
    
    try {
      const res = await findUserByID(userId);
      const cart = res?.data?.user?.cart || [];
      if (cart.length) {
        console.log(`You have ${cart.length} purchased book(s)`);
      }
    } catch (e) {
      console.error("Fetch cart error", e);
    }
  };

  useEffect(() => {
    refreshUserCart();
  }, [userId]);
  
  return (
    <div>
      <div className="sticky top-0 left-0 z-20 shadow-md">
        <Navbar/>
      </div>
      <div className='flex flex-col items-center w-full'>
        <div className='flex flex-row gap-2 mt-5'>
          <TextField 
            fullWidth 
            className='bookid' 
            sx={{width: 200, color: 'success.main'}} 
            label="Book Id" 
            id="fullWidth" 
            color="warning" 
            name="id" 
            value={bookid} 
            onChange={handlechange} 
            disabled={loading}
          />
          <div>
            <Button 
              variant="outlined" 
              color='secondary' 
              sx={{width: 20, color: 'success.main'}} 
              className='w-[100px] h-[50px]' 
              onClick={findbook} 
              endIcon={<SendIcon />}
              disabled={loading}
            >
            </Button>
          </div>
          <div>
            <Button 
              variant="outlined" 
              color='error' 
              className='w-[100px] h-[50px]' 
              sx={{width: 20, color: 'error.main'}} 
              onClick={clearbook} 
              startIcon={<DeleteIcon />}
              disabled={loading}
            >
            </Button>
          </div>
        </div>
        <div className='w-full flex flex-col item-center'>
          <div>
            <div className="Header flex flex-row justify-between items-center">
              <h3 className="Heading">Return Book</h3>
              <div className="flex gap-4">
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                  onClick={showRemainingBooks}
                >
                  Show Purchased Books
                </button>
                <h5 className="Action cursor-pointer" onClick={removeAllBook}>Remove all</h5>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : books && books.length > 0 ? (
              books.map((data, key) => ( 
                <div className="flex flex-row justify-around shadow-md py-3 px-3" key={key}>
                  <div className="image-box flex flex-col max-[480px]:hidden">
                    <img src={`${data.image}`} onError={handleImageError} className="img" alt={data.title} />
                  </div>
                  <div className="about flex flex-col">
                    <h1 className="title text-red-800">
                      {data.title}
                    </h1>
                    <h3 className="text-red-800 font-bold text-md text-xl flex flex-row">
                      <span className="text-red-600 text-md font-bold">Book Id:</span>
                      <span className="text-[15px] text-red-800 ml-1">{data.id}</span>
                    </h3>
                    <h3 className="text-red-800 font-bold text-md">
                      <span className='text-red-600 text-md font-bold'>Original Price:</span>
                      <span className="ml-1">₹{data.price}</span>
                    </h3>
                    <h3 className="text-red-800 font-bold">
                      <span className='text-red-600 text-md font-bold'>Discount Price:</span>
                      <span className="ml-1">₹{Math.floor(data.price * 75 / 100)}</span>
                    </h3>
                    <h3 className="text-red-800 font-bold">
                      <span className='text-red-600 text-md font-bold'>After Return:</span>
                      <span className="ml-1">₹{Math.floor(data.price * 50 / 100)}</span>
                    </h3>
                    <h3 className="text-red-800 font-bold">
                      <span className='text-red-600 text-md font-bold'>Available Quantity:</span>
                      <span className="ml-1">{data.quantity}</span>
                    </h3>
                    <h3 className="text-red-800 font-bold flex flex-row min-[650px]:hidden">
                      <span className='text-red-600 text-md font-bold'>Return Quantity:</span>
                      <div className='flex flex-row ml-1'>
                        <div className="product-quantity-subtract btn" onClick={() => subtractQuantity(data)}>
                          <ArrowLeftIcon />
                        </div>
                        <div className="bg-white h-20px flex items-center text-center">{data.aquantity}</div>
                        <div className="product-quantity-add btn" onClick={() => addQuantity(data)}>
                          <ArrowRightIcon />
                        </div>
                      </div>
                    </h3>
                  </div>

                  <div className="prices max-[650px]:hidden">
                    <div className="amount">{Math.floor(data.price * 50 / 100)} ₹</div>
                    <div className='flex flex-row'>
                      <div className="product-quantity-subtract btn" onClick={() => subtractQuantity(data)}>
                        <ArrowLeftIcon />
                      </div>
                      <div className="bg-white h-20px flex items-center text-center">{data.aquantity}</div>
                      <div className="product-quantity-add btn" onClick={() => addQuantity(data)}>
                        <ArrowRightIcon />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">No books in the return list. Enter a book ID to add books for return.</div>
            )}
            
            {books && books.length > 0 && (
              <>
                <hr/>
                <div className="checkout mb-10">
                  <div className="total mt-5">
                    <div>
                      <div className="text-3xl text-red-500 font-extrabold">SubTotal:</div>
                    </div>
                    <div className="total-amount">
                      {price} ₹
                    </div>
                  </div>
                  <button 
                    className="button bg-red-800" 
                    onClick={deletebook}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Return"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}