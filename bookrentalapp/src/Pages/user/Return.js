import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../../Components/common/Navbar';
import { Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import SendIcon from '@mui/icons-material/Send';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import { findinCart, deletcartbook } from '../../Api/user';
import { addToBookCart, removeFromBookCart, updateBookCartItem, clearBookCart } from '../../Redux/Action/bookSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Style/return.css';
import dummyImageUrl from '../../images/dummy.png';
import { UserContext } from '../../contexts/UserContext';



export default function Return() {
  const navigate = useNavigate();
  const [bookid, setbookid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(0);

  const { books } = useSelector((state) => state.bookcart);
  const dispatch = useDispatch();
  const { user, refreshUserData } = useContext(UserContext);
  const userId = user ? user._id : window.localStorage.getItem('Id');

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
      : `Are you sure you want to return ${books[0].aquantity} copy/copies of "${books[0].title}"?`;

    if (!window.confirm(confirmMessage + " This action cannot be undone.")) return;

    try {
      setLoading(true);
      // Use user data from context instead of making a separate API call
      const userCart = user?.cart || [];

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
      await refreshUserData();
      
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

  const showRemainingBooks = () => {
    try {
      const cart = user?.cart || [];
      if (!cart.length) return toast.info("No books in your purchase history");

      const msg = cart.map(b => `${b.title} (ID: ${b.id}) - Qty: ${b.quantity}`).join('\n');
      alert("Your purchased books:\n" + msg);
    } catch (err) {
      toast.error("Failed to fetch purchases");
    }
  };

  
  const handleImageError = (e) => (e.target.src = dummyImageUrl);

  useEffect(() => calcPrice(), [books]);

  useEffect(() => {
    if (user && user.cart) {
      console.log(`You have ${user.cart.length} purchased book(s)`);
    }
  }, [user]);
  
  return (
    <div className="return-page">
      <div className="fixed top-0 left-0 w-full z-20 shadow-md">
        <Navbar/>
      </div>
      
      <div className="return-container">
        <div className="return-header">
          <h2 className="return-title">Book Return</h2>
          <div className="return-actions">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              onClick={showRemainingBooks}
            >
              <InfoIcon fontSize="small" style={{ marginRight: '4px' }} />
              View Purchased Books
            </button>
            {books.length > 0 && (
              <button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                onClick={removeAllBook}
              >
                <DeleteIcon fontSize="small" style={{ marginRight: '4px' }} />
                Clear All
              </button>
            )}
          </div>
        </div>
        
        <div className="return-input-group">
          <TextField 
            fullWidth 
            sx={{ flex: 1 }}
            label="Enter Book ID" 
            variant="outlined"
            color="primary" 
            value={bookid} 
            onChange={handlechange} 
            disabled={loading}
            placeholder="Enter the ID of the book you want to return"
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={findbook} 
            endIcon={<SendIcon />}
            disabled={loading}
            sx={{ height: '56px', minWidth: '56px' }}
          >
            Add
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={clearbook} 
            startIcon={<DeleteIcon />}
            disabled={loading}
            sx={{ height: '56px' }}
          >
            Clear
          </Button>
        </div>
        
        <div className="return-book-list">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : books && books.length > 0 ? (
            books.map((book, index) => ( 
              <div className="return-book-item" key={index}>
                <img 
                  src={book.image} 
                  onError={handleImageError} 
                  className="return-book-image" 
                  alt={book.title} 
                />
                
                <div className="return-book-details">
                  <h3 className="return-book-title">{book.title}</h3>
                  
                  <div className="return-book-info">
                    <div className="return-book-info-item">
                      <span className="return-book-info-label">Book ID</span>
                      <span className="return-book-info-value">{book.id}</span>
                    </div>
                    
                    <div className="return-book-info-item">
                      <span className="return-book-info-label">Original Price</span>
                      <span className="return-book-info-value">₹{book.price}</span>
                    </div>
                    
                    <div className="return-book-info-item">
                      <span className="return-book-info-label">Discount Price</span>
                      <span className="return-book-info-value">₹{Math.floor(book.price * 75 / 100)}</span>
                    </div>
                    
                    <div className="return-book-info-item">
                      <span className="return-book-info-label">Return Amount</span>
                      <span className="return-book-info-value text-red-600">₹{Math.floor(book.price * 50 / 100)}</span>
                    </div>
                    
                    <div className="return-book-info-item">
                      <span className="return-book-info-label">Available Quantity</span>
                      <span className="return-book-info-value">{book.quantity}</span>
                    </div>
                  </div>
                </div>
                
                <div className="return-quantity-control">
                  <button 
                    className="return-quantity-btn" 
                    onClick={() => subtractQuantity(book)}
                    aria-label="Decrease quantity"
                  >
                    <ArrowLeftIcon fontSize="small" />
                  </button>
                  <span className="return-quantity-value">{book.aquantity}</span>
                  <button 
                    className="return-quantity-btn" 
                    onClick={() => addQuantity(book)}
                    aria-label="Increase quantity"
                  >
                    <ArrowRightIcon fontSize="small" />
                  </button>
                </div>
                
                <div className="return-book-price">
                  ₹{Math.floor(book.price * 50 / 100) * book.aquantity}
                </div>
              </div>
            ))
          ) : (
            <div className="return-empty">
              <div className="return-empty-icon">
                <ShoppingCartIcon style={{ fontSize: '3rem', color: '#bdbdbd' }} />
              </div>
              <h3 className="return-empty-text">Your return list is empty</h3>
              <p>Enter a book ID to add books for return</p>
            </div>
          )}
        </div>
        
        {books && books.length > 0 && (
          <div className="return-checkout">
            <div className="return-total">
              <span className="return-total-label">Total Return Amount:</span>
              <span className="return-total-value">₹{price}</span>
            </div>
            <button 
              className="return-button" 
              onClick={deletebook}
              disabled={loading}
            >
              {loading ? "Processing..." : "Process Return"}
            </button>
          </div>
        )}
      </div>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
}