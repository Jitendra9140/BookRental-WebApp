
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import { getbook } from "../Api/book";
import { cart } from "../Api/user";
import '../Style/book.css'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useDispatch } from "react-redux";
import name from "./Datajson"
export default function Book() {
  useEffect(() => {
    getbookid();
    // setbook(bookbyid)
  }, []);
  const navigate=useNavigate();
  const { id, bid } = useParams();
  const [book, setbook] = useState([
    {
      title:"",
      author:"",
      edition:"",
      publisher:"",
      pages:"",
      language:"",
      description:"",
      price:"",
      dprice:"",
      image:""
    }
  ]);

  const getbookid = async () => {
    const response = await getbook(bid);
    console.log(response.data);
    setbook(response.data);
  };
  console.log(bid)
  const bookbyid=name.book.filter((book)=>book.id==bid)
  console.log(book.title)

  const [quantity, setQuantity] = useState(1);

  const calcPrice = (qty) => {
    const price = document.querySelector('.product-price').getAttribute('price-data');
    const total = (parseFloat(price) * qty).toFixed(2);
    document.querySelector('.product-checkout-total-amount').textContent = total;
  };

  const subtractQuantity = () => {
    const value = parseInt(quantity) - 1;
    const newValue = value < 0 ? 0 : value;
    setQuantity(newValue);
    calcPrice(newValue);
  };

  const addQuantity = () => {
    const value = parseInt(quantity) + 1;
    setQuantity(value);
    calcPrice(value);
  };

  const handleBlur = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
    calcPrice(value);
  };
//  console.log(book[0])
  // const addToCart = async()=>{
  //         try {
  //           const amount =book.price*quantity;
  //         console.log(amount)
  //         cart(book, id);
  //         const {data:{key}}=await axios.get(`http://localhost:8000/pay/getkey`)
  //         const{ data :{order}}= await axios.post(`http://localhost:8000/checkout`,{amount:amount});
  //         const options = {
  //           key, // Enter the Key ID generated from the Dashboard
  //           amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //           currency: "INR",
  //           name: "Jitendra Yadav",
  //           description: "Test Transaction",
  //           image: "https://example.com/your_logo",
  //           order_id:order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //           callback_url: "http://localhost:8000/payvarify",
  //           prefill: {
  //               name: "Gaurav Kumar",
  //               email: "gaurav.kumar@example.com",
  //               contact: "9000090000"
  //           },
  //           notes: {
  //               address: "Razorpay Corporate Office"
  //           },
  //           theme: {
  //               color: "#3399cc"
  //           }
  
  
  //       };
  //         const razor = new window.Razorpay(options);
  //          razor.open();
           
  //       } catch (error) {
  //         console.log("jitendra"+error)
  //       }
  // }
  const addToCart=(e)=>{
    dispatch(addToCart(e))
    setTimeout(() => {
     navigate("/cart/" + id);
   }, 1000);
  }
  const dispatch=useDispatch();
  return (
    <body>
   
    <div class="lightbox-blanket">
      <div class="pop-up-container">
        <div class="pop-up-container-vertical">
          <div class="pop-up-wrapper">
            <div class="go-back" onclick="GoBack();"><i class="fa fa-arrow-left"></i>
            </div>
            <div class="product-details">
              <div class="product-left">
                <div class="product-info">
                  <div class="product-manufacturer">
                    {book.title}
                  </div>
                  <div class="product-title">
                   {book.author}
                  </div>
                  <div class="product-price" price-data={book.price}>
                    ${book.price}<span class="product-price-cents">03</span>
                  </div>
                </div>
                <div class="product-image">
                  <img src={`${book.image}`} />
                </div>
              </div>
              <div class="product-right">
                <div class="product-description">
                  {book.description}
                </div>
                <div class="product-available">
                  In stock. <span class="product-extended"><a href="#">Buy Extended Warranty</a></span>
                </div>
                <div class="product-rating">
                  <i class="fa fa-star rating" star-data="1"></i>
                  <i class="fa fa-star rating" star-data="2"></i>
                  <i class="fa fa-star rating" star-data="3"></i>
                  <i class="fa fa-star" star-data="4"></i>
                  <i class="fa fa-star" star-data="5"></i>
                  <div class="product-rating-details">(3.1 - <span class="rating-count">1203</span> reviews)
                  </div>
  
                </div>
                <div class="product-quantity">
                  <label for="product-quantity-input" class="product-quantity-label">Quantity</label>
                  <div class="product-quantity-subtract" onClick={ subtractQuantity}>
                   <ArrowLeftIcon/>
                  </div>
                  <div>
                    <input id="product-quantity-input"  placeholder="1" 
                     type="text"    min="1"          value={quantity}       onChange={(e) => setQuantity(parseInt(e.target.value))}                                     onBlur={handleBlur}
                    />
                  </div>
                  <div class="product-quantity-add" onClick={addQuantity}>
                    <ArrowRightIcon/>
                  </div>
                </div>
              </div>
              <div class="product-bottom">
                <div class="product-checkout">
                  Total Price
                  <div class="product-checkout-total">
                    <i class="fa fa-usd"></i>
                    <div class="product-checkout-total-amount">
                      {book.price}
                    </div>
                  </div>
                </div>
                <div class="product-checkout-actions">
                  <button class="add-to-cart" href=""
                   onClick={addToCart}
                   >Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>

);
}
