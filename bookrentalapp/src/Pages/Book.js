import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getbook } from "../Api/book";
import '../Style/book.css';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useDispatch } from "react-redux";
import { addToCart } from '../Redux/Action/cartSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Book() {
  const navigate = useNavigate();
  const { id, bid } = useParams();
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
    image: ""
  });

  const getbookid = async () => {
    const response = await getbook(bid);
    console.log(response.data);
    setbook(response.data);
    const val=book.price*75/100
    setTotal(val);
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

  return (
    <div className="lightbox-blanket">
      <div className="pop-up-container">
        <div className="pop-up-container-vertical">
          <div className="pop-up-wrapper">
            <div className="go-back cursor-pointer" onClick={() => navigate(-1)}><i className="fa fa-arrow-left"></i>
            </div>
            <div className="product-details">
              <div className="product-left">
                <div className="product-info">
                  <div className="product-manufacturer">
                    {book.title}
                  </div>
                  <div className="product-title">
                    {book.author}
                  </div>
                </div>
                <div className="product-image">
                  <img src={`${book.image}`} alt={book.title} onError={handleImageError} />
                </div>
              </div>
              <div className="product-right">
                <div className="product-description">
                  {book.description}
                </div>
                <div className="product-available">
                  Publication: <span className="product-extended">{book.publisher}</span>
                </div>
                <div className="product-available">
                  Pages: <span className="product-extended">{book.pages}</span>
                </div>
                <div className="product-available">
                  Language: <span className="product-extended">{book.language}</span>
                </div>
                <div className="product-available">
                  Year: <span className="product-extended">{book.year}</span>
                </div>
                <div className="product-available">
                  Semester: <span className="product-extended">{book.semester}</span>
                </div>
                <div className="product-available">
                  Original price: <span className="product-extended">₹{book.price}</span>
                </div>
                <div className="product-available">
                  Discounted price: <span className="product-extended">₹{Math.floor(book.price * 75 / 100)}</span>
                </div>
                <div className="product-available">
                  After Return price: <span className="product-extended">₹{Math.floor(book.price * 50 / 100)}</span>
                </div>
                <div className="product-available">
                <span className="text-black font-bold">
                {book.quantity > 0 ? <strong className='text-green-700'>Available</strong> : <strong className='text-red-700'>Out Of Stock</strong>}</span>
                </div>
                <div className="product-quantity">
                  { book.quantity>1?(
                    <>
                    <label htmlFor="product-quantity-input" className="product-quantity-label">Quantity</label>
                    <div className="product-quantity-subtract btn" onClick={subtractQuantity} >
                    <ArrowLeftIcon />
                  </div>
                  <div className="bg-white  h-20px border flex items-center text-center ">{book.quantity>1?quantity:0}</div>
                  <div className="product-quantity-add btn" onClick={addQuantity} >
                    <ArrowRightIcon />
                  </div>
                  </>):(<div></div>)} 
                </div>
              </div>
              <div className="product-bottom">
                <div className="product-checkout">
                  Total Price
                  <div className="product-checkout-total">
                    <i className="fa fa-usd"></i>
                    <div className="product-checkout-total-amount px-6">
                      {total<=0?Math.floor(book.price*75/100):Math.floor(total)}₹
                    </div>
                  </div>
                </div>
                <div className="product-checkout-actions">
                  <button className="add-to-cart" onClick={()=>{ addInCart(book)}}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}