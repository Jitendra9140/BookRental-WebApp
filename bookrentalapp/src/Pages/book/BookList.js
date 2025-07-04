import React, { useEffect, useState } from 'react';
import "../../Style/Products.css";
import Navbar from '../../Components/common/Navbar';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/Action/cartSlice';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getContent } from '../../Api/book';

// Utility: Trim text safely
const trimText = (text, maxLength) => {
  if (!text) return '';
  const str = typeof text === 'string' ? text : String(text);
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

export default function BookList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [book, setbook] = useState([]);
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const dummyImageUrl = 'https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg';

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const data = await getContent();
    setbook(data.data);
  };

  const handleImageError = (event) => {
    event.target.src = dummyImageUrl;
    event.target.onerror = () => {
      event.target.src = "/assets/default-book-cover.png";
      event.target.onerror = null;
    };
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = debounce((value) => {
    // The inputValue is already set in the SearchInput component
    // This function is now only used for debouncing
  }, 300);

  const addInCart = (e) => {
    try {
      if (e.quantity > 0) {
        dispatch(addToCart(e));
        toast.success(`"${trimText(e.title, 20)}" added to cart!`);
        setTimeout(() => {
          navigate("/cart/" + id);
        }, 100);
      } else {
        toast.error("Sorry, this book is out of stock!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add book to cart. Please try again.");
    }
  };



  useEffect(() => {
    const filterBooks = () => {
      setLoading(true);
      const filtered = book.filter((book) => {
        const matchesDropdowns =
          (!year || book.year === Number(year)) &&
          (!semester || book.semester === semester) &&
          (!subject || book.Subject === subject);

        const matchesSearch =
          !inputValue ||
          book.title?.toLowerCase().includes(inputValue.toLowerCase()) ||
          book.publisher?.toLowerCase().includes(inputValue.toLowerCase()) ||
          book.author?.toLowerCase().includes(inputValue.toLowerCase()) ||
          book.description?.toLowerCase().includes(inputValue.toLowerCase());

        return matchesDropdowns && matchesSearch;
      });

      setFilteredBooks(filtered);
      setLoading(false);
    };

    filterBooks();
  }, [year, semester, subject, book, inputValue]);

  return (
    <div className="h-screen">
      <div className="sticky absolute top-0 left-0 z-20">
        <Navbar />
      </div>



      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 my-4">
  <FormControl sx={{ minWidth: 150 }} size="small">
    <InputLabel>Year</InputLabel>
    <Select
      value={year}
      onChange={(e) => {
        setYear(e.target.value);
        setSemester('');
        setSubject('');
      }}
    >
      <MenuItem value="">All</MenuItem>
      {Array.from(new Set(book.map((b) => b.year))).map((y) => (
        <MenuItem key={y} value={y}>{y}</MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl sx={{ minWidth: 150 }} size="small">
    <InputLabel>Semester</InputLabel>
    <Select
      value={semester}
      onChange={(e) => {
        setSemester(e.target.value);
        setSubject('');
      }}
    >
      <MenuItem value="">All</MenuItem>
      {Array.from(new Set(book.map((b) => b.semester))).map((s) => (
        <MenuItem key={s} value={s}>{s}</MenuItem>
      ))}
    </Select>
  </FormControl>

  <FormControl sx={{ minWidth: 150 }} size="small">
    <InputLabel>Subject</InputLabel>
    <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
      <MenuItem value="">All</MenuItem>
      {Array.from(new Set(book.map((b) => b.Subject))).map((s) => (
        <MenuItem key={s} value={s}>{s}</MenuItem>
      ))}
    </Select>
  </FormControl>
</div>


      {inputValue && (
        <div className="text-center mb-4">
          <p className="text-gray-700">
            {filteredBooks.length === 0 ? (
              <span className="text-red-600 font-medium">No books found matching "{inputValue}"</span>
            ) : (
              <span className="text-green-600 font-medium">{filteredBooks.length} book(s) found matching "{inputValue}"</span>
            )}
          </p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        {loading ? (
          <div className="text-center my-8">Loading...</div>
        ) : (
          filteredBooks.map((data) => (
            <div className="relative w-[400px] h-[250px] m-3 p-2 group" key={data._id}>
              <div className="relative h-full w-full flex overflow-hidden bg-white/30 border border-white/20 rounded-xl p-0.5">
                {/* Image */}
                <div className="w-1/3 relative p-0.5">
                  <div className="h-full w-full overflow-hidden rounded-l-lg border">
                    <img
                      className="w-full h-full object-cover"
                      src={`${data.image}`}
                      onError={handleImageError}
                      alt={data.title}
                    />
                  </div>
                  <div className="absolute top-2 left-2 z-2">
                    {data.quantity > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 z-10 text-green-800">
                        <span className="w-2 h-2 mr-1 rounded-full bg-green-500 animate-pulse "></span> Available

                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-2 h-2 mr-1 rounded-full bg-red-500"></span> Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="w-2/3 p-4 flex flex-col">
                  <div className="flex-grow">
                    <h1 className="text-gray-900 font-bold text-xl mb-1 line-clamp-2 px-0.5">{trimText(data.title, 30)}</h1>
                    <h3 className="text-gray-700 font-medium text-sm mb-1 px-0.5">{trimText(data.publisher, 25)}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2 px-0.5">{trimText(data.description, 25)}</p>
                    <div className="text-sm mb-1 px-0.5">
                      {data.quantity > 0 ? (
                        <span className="text-green-700 font-medium">{data.quantity} copies available</span>
                      ) : (
                        <span className="text-red-700 font-medium">Currently unavailable</span>
                      )}
                    </div>
                    <div className="flex items-center mb-2 px-0.5">
                      <span className="text-gray-700 font-medium mr-2">Price:</span>
                      <span className="text-xl font-bold text-red-700">₹{data.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-3 mt-auto px-0.5">
                    <button
                      onClick={() => addInCart(data)}
                      className="w-24 h-9 bg-red-600 text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center"
                      disabled={data.quantity <= 0}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/${id}/book/${data._id}`}
                      className="w-24 h-9 bg-gray-800 text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
