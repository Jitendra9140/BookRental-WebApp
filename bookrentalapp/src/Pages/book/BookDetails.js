import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getbook } from "../../Api/book";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useDispatch } from "react-redux";
import { addToCart } from '../../Redux/Action/cartSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Removed book.css import as we're using inline styles now
export default function BookDetails() {
  const navigate = useNavigate();
  const { id, bid } = useParams();
  const [loading, setLoading] = useState(true);
  const [book, setbook] = useState({
    title: "",
    author: "",
    edition: "",
    publisher: "",
    pages: "",
    language: "",
    description: "",
    price: "",
    dprice: "",
    image: "",
    quantity: 0
  });

  const getbookid = async () => {
    try {
      setLoading(true);
      const response = await getbook(bid);
      console.log('API Response:', response);
      
      // Check if response has the expected structure
      if (response && response.data) {
        // Check if the data is nested inside a 'book' property (from backend structure)
        const bookData = response.data.book || response.data;
        console.log('Book Data:', bookData);
        
        // Ensure all required fields are present
        const processedData = {
          ...book, // Keep default values
          ...bookData, // Override with API data
          // Ensure quantity is a number
          quantity: typeof bookData.quantity === 'number' ? bookData.quantity : 0
        };
        
        setbook(processedData);
        // Calculate total after setting book data
        if (processedData.price) {
          const val = processedData.price * 75/100;
          setTotal(val);
        }
      } else {
        console.error('Invalid response format:', response);
        toast.error('Error loading book data', { position: toast.POSITION.TOP_RIGHT });
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Error loading book data', { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [total,setTotal]=useState();

  const calcPrice = (qty) => {
    const price = book.price*75/100;
    const totalcal = (parseFloat(price) * qty).toFixed(2);
    setTotal(totalcal)
  };

  const subtractQuantity = () => {
    if(quantity>1){
    const value = quantity - 1;
    const newValue = value < 0 ? 0 : value;
    setQuantity(newValue);
    calcPrice(newValue);
    }
  };

  const addQuantity = () => {
    if((book.quantity-quantity)>0){
      const value = quantity + 1;
      console.log(book.quantity);
      setQuantity(value);
      calcPrice(value);
    }
    else{
      toast.error('Only Available this much quantity', { position: toast.POSITION.TOP_RIGHT });
    }
  };

  const addInCart=(e)=>{
    dispatch(addToCart(e))
    setTimeout(() => {
     navigate("/cart/" + id);
   }, 1000);
  }
const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg';
const handleImageError = (event) => {
  event.target.src = dummyImageUrl;
};
  const dispatch = useDispatch();
  useEffect(() => {
    getbookid();
  }, [bid]);

  // Update total price whenever book data changes
  useEffect(() => {
    if (book && book.price) {
      const val = book.price * 75/100;
      setTotal(val);
    }
  }, [book]);

  // Check if we have valid book data after loading is complete
  const hasValidBookData = !loading && book && book.title;

  return (
    <div className="bg-gray-100 min-h-screen w-full z-20" style={{ paddingBottom: '2rem' }}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          {loading ? (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full p-8 flex flex-col items-center justify-center" style={{ minHeight: '400px', maxHeight: 'none' }}>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading book details...</p>
            </div>
          ) : !hasValidBookData ? (
            <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full p-8 flex flex-col items-center justify-center" style={{ minHeight: '400px', maxHeight: 'none' }}>
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
              <p className="text-gray-600 text-center mb-6">The book information could not be loaded or doesn't exist.</p>
              <button 
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Go Back
              </button>
            </div>
          ) : (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full relative">
            {/* Back button */}
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold p-2 rounded-full transition-colors duration-300 z-10"
            >
              ← Back
            </button>
            
            <div className="p-6 md:p-8">
              {/* Product container */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left column - Image and title */}
                <div className="md:w-2/5">
                  <div className="mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 mt-6">{book.title}</h1>
                    <p className="text-lg text-gray-600 italic">by {book.author}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <img 
                      src={`${book.image}`} 
                      alt={book.title} 
                      onError={handleImageError} 
                      className="w-full h-64 object-contain mx-auto"
                    />
                  </div>
                </div>
                
                {/* Right column - Details */}
                <div className="md:w-3/5">
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Publication</p>
                      <p className="font-medium text-blue-600">{book.publisher}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Pages</p>
                      <p className="font-medium text-blue-600">{book.pages}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Language</p>
                      <p className="font-medium text-blue-600">{book.language}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Year</p>
                      <p className="font-medium text-blue-600">{book.year}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Semester</p>
                      <p className="font-medium text-blue-600">{book.semester}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Availability</p>
                      <p className={book.quantity > 0 ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
                        {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Price section */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Original Price:</span>
                      <span className="text-lg font-medium text-gray-800">₹{book.price}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Discounted Price:</span>
                      <span className="text-lg font-medium text-green-600">₹{Math.floor(book.price * 75 / 100)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">After Return Price:</span>
                      <span className="text-lg font-medium text-blue-600">₹{Math.floor(book.price * 50 / 100)}</span>
                    </div>
                  </div>
                  
                  {/* Quantity selector */}
                  {book.quantity > 1 && (
                    <div className="flex items-center mb-6">
                      <span className="text-gray-700 font-medium mr-4">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <button 
                          onClick={subtractQuantity}
                          className="bg-gray-200 px-3 py-1 hover:bg-gray-300 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <ArrowLeftIcon />
                        </button>
                        <div className="px-4 py-1 bg-white text-center min-w-[40px]">{quantity}</div>
                        <button 
                          onClick={addQuantity}
                          className="bg-gray-200 px-3 py-1 hover:bg-gray-300 transition-colors"
                          disabled={quantity >= book.quantity}
                        >
                          <ArrowRightIcon />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Total and add to cart */}
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-gray-600 text-sm">Total Price</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{total <= 0 ? Math.floor(book.price * 75 / 100) : Math.floor(total)}
                      </p>
                    </div>
                    <button 
                      onClick={() => addInCart(book)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto"
                      disabled={book.quantity <= 0}
                    >
                      {book.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      <ToastContainer />
      <div className="py-8"></div> {/* Extra padding at bottom for scrolling */}
    </div>
  );
}