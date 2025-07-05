import React, { useRef, useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import "../Style/Home.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getContent } from "../Api/book";
import {useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { addToCart } from '../Redux/Action/cartSlice'
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../Components/common/Navbar";
import Footer from "../Components/common/Footer";
import BookCarousel from '../Components/common/HomeCarousel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import banner from "../images/front.png"
import home1 from "../images/book.png"
import home2 from "../images/logo2.png"
import genres1 from "../images/1.svg"
import genres2 from "../images/2.svg"
import genres3 from "../images/3.svg"
import genres4 from "../images/4.svg"
import genres5 from "../images/5.svg"
import genres6 from "../images/6.svg"
import genres7 from "../images/7.svg"
import genres8 from "../images/8.svg"
import genres9 from "../images/9.svg"
import genres10 from "../images/10.svg"
export default function Home() {
  const carouselRef = useRef(null);
  const navigate=useNavigate()
  let resetTimeout= null;
  // Initialize with empty array instead of array with empty object
  const [book, setbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleNextEnd = ({ index }) => {
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.goTo(0);
      }
    }, 4000);
  };
  const lodebook = async () => {
    const data = await getContent();
    setbook(data.data);
  };

  useEffect(() => {
    lodebook();
  }, []);
  useEffect(() => {
    AOS.init();
  }, []);
  const dispatch=useDispatch();
  const { user } = useContext(UserContext);
  const id = user ? user._id : window.localStorage.getItem("Id")
const addInCart=(e)=>{
 dispatch(addToCart(e))
 toast.success("Successfully add to cart" );
 setTimeout(() => {
  navigate("/cart/" + id);

}, 1000);
}
    
const items = [
  { imageSrc: genres1, label: 'Auto-Biography' },
  { imageSrc: genres2, label: 'Cookery' },
  { imageSrc: genres3, label: 'Geo-Politics' },
  { imageSrc: genres4, label: 'Health' },
  { imageSrc: genres5, label: 'Hindi' },
  { imageSrc: genres6, label: 'History' },
  { imageSrc: genres7, label: 'India' },
  { imageSrc: genres8, label: 'Management' },
  { imageSrc: genres9, label: 'Sangit' },
  { imageSrc: genres10, label: 'Romance' },
];
// Responsive breakpoints for react-multi-carousel
const generasResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1750 },
    items: 6
  },
  largeDesktop: {
    breakpoint: { max: 1750, min: 1450 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 1450, min: 1150 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1150, min: 850 },
    items: 3
  },
  smallTablet: {
    breakpoint: { max: 850, min: 550 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 550, min: 0 },
    items: 1
  }
};

const bookbreakResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1750 },
    items: 3
  },
  largeDesktop: {
    breakpoint: { max: 1750, min: 1450 },
    items: 3
  },
  desktop: {
    breakpoint: { max: 1450, min: 1150 },
    items: 2.5
  },
  tablet: {
    breakpoint: { max: 1150, min: 750 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 750, min: 450 },
    items: 1.5
  },
  smallMobile: {
    breakpoint: { max: 450, min: 0 },
    items: 1
  }
};

const bookbreaknResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1750 },
    items: 4
  },
  largeDesktop: {
    breakpoint: { max: 1750, min: 1450 },
    items: 3.5
  },
  desktop: {
    breakpoint: { max: 1450, min: 1150 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1150, min: 750 },
    items: 2.5
  },
  mobile: {
    breakpoint: { max: 750, min: 450 },
    items: 1.5
  },
  smallMobile: {
    breakpoint: { max: 450, min: 0 },
    items: 1
  }
};
  return (
       <>
        <div className="sticky absolute top-0 left-0 shadow-md z-10">
        <Navbar/>
        </div>
    <div>
        {/* banner section */}
      <div className="">
        <div className="landing flex justify-center items-center flex-row  max-[900px]:flex-col max-[900px]:h-auto  bg-gray-100  h-[60vh]  gap-1">
          <div className="max-[400px]:p-3">
            <div className="text-[2.9rem] text-red-600 max-[700px]:text-[2.5rem]  max-[500px]:text-[2.3rem] font-serif font-bold leading-normal ">
           India's Online<br /> 
           Book Rental Service
            </div>
            <div className=" text-xl text-black-400  font-bold font-serif pt-4">
              {" "}
              Start reading with justbooks
            </div>
            <div className=" p-4 z-0 ">
              <button class="glass-button mt-7">Get Started</button>
            </div>
          </div>
          <div className="w-1/2 flex justify-center items-cente">
            <div className=" rounded-full  flex justify-center items-cente ">
              <img
                src={banner}
                className="h-[300px] w-[300px] max-[400px]:h-[200px] max-[400px]:w-[200px]"
                  
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {/* generas Section  */}
      <div className="  flex flex-col py-10">
        <div className="text-4xl  text-center  font-serif  py-5 my-5 font-extrabold text-red-600">
          {" "}
          Generas
        </div>
        <Carousel 
      className='generas w-full' 
      ref={carouselRef}
      responsive={generasResponsive}
      swipeable={true}
      draggable={true}
      showDots={false}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={1500}
      keyBoardControl={true}
      customTransition="all 1.5s"
      transitionDuration={1500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["mobile"]}
      itemClass="carousel-item-padding-40-px"
      afterChange={(previousSlide, { currentSlide }) => {
        if (currentSlide === 0) {
          clearTimeout(resetTimeout);
          resetTimeout = setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.goToSlide(0);
            }
          }, 4000);
        }
      }}
    >
    {items.map((item, index) => (
    <div className="gencontainer cart flex justify-center items-center flex-col " key={index}>
      <img src={item.imageSrc} className='w-24 ' style={{ width: "100px", height: "100px" }} alt="" />
      <div className="text-md font-bold">{item.label}</div>
    </div>
  ))}
    </Carousel> 
      </div>
      {/* Advertise section */}
      <div className="bg-gray-100 ">
        <div className="landing flex justify-center items-center flex-row  max-[900px]:flex-col max-[900px]:h-auto    gap-1  max-[700px]:mt-5">
          <div className="  ">
            <div className="text-red-700 text-4xl font-bold  max-[500px]:text-3xl font-serif  mt-4">
              The More You Read  <br /> The Less You Pay
            </div>
            <div className=" ">
              Let the pages that inspire you inspire the next <br /> generation
              of readers. Donate your favourite books <br /> to our library
            </div>
            <div className="">
              <li className="list-none text-xl text-red-500 underline">
                Read More
              </li>
            </div>
          </div>
        <div className="w-1/2 flex justify-center items-center">
            <div className=" rounded-full  flex justify-center items-center ">
              <img
                src={home1}
                className="h-[300px] w-[300px] max-[400px]:h-[200px] max-[400px]:w-[200px]"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className=" flex  justify-around flex-row py-6">
          <button class="bg-white w-[200px] border border-red-600 hover:bg-[#FC2947] hover:text-white  rounded-[20px] mt-7 text-3xl font-serif font-bold text-red-600 py-4 mr-[2px]">Book</button>
          <button class=" bg-white w-[200px] border border-red-600 hover:bg-[#FC2947] hover:text-white  rounded-[20px] mt-7 text-3xl font-serif font-bold text-red-600 py-4 mr-[2px]">Author</button>
        </div>
        <div className=" flex  bg-white p-3 " >
          <div className="max-[900px]:hidden " style={{width:"20%"}}>

            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
              className="
          h-[600px]  w-full rounded-md"
              alt=""
            />
          </div>
          <div className="gap-5  max-[900px]:w-full w-[80%]"  >
            {/* Ensure book data is available before rendering */}
            {book && book.length > 0 ? (
              <>
                <BookCarousel books={book} breakpoints={bookbreakResponsive}  addInCart={addInCart} />
                <BookCarousel books={book} breakpoints={bookbreakResponsive} addInCart={addInCart} />
              </>
            ) : (
              <div>Loading books...</div>
            )}
          </div>
        </div>
        <div className=" flex flex-col ">
          <div className="  text-3xl font text-red-600 font-extrabold pl-20">
            New Araivals
          </div>
          {book && book.length > 0 ? (
            <BookCarousel books={book} breakpoints={bookbreaknResponsive} addInCart={addInCart} />
          ) : (
            <div className="p-4">Loading new arrivals...</div>
          )}
        </div>
        <div className=" flex flex-col ">
          <div className=" text-black text-3xl font text-red-600 font-extrabold pl-10 ">
            Kids Spacial
          </div>
          {book && book.length > 0 ? (
            <BookCarousel books={book} breakpoints={bookbreakResponsive} addInCart={addInCart} />
          ) : (
            <div className="p-4">Loading kids special books...</div>
          )}
        </div>
      </div>
      <div className="bg-gray-100 ">
        <div className="landing flex justify-around items-center flex-row  max-[900px]:flex-col max-[900px]:h-auto    gap-1  max-[700px]:mt-5">
          <div className="  ">
            <div className=" max-[500px]:p-3  font-serif  mt-4">
              <div className="text-red-700 text-4xl font-bold font-serif  max-[500px]:text-3xl">
                Spread The Joy Of <br /> Reading
              </div>
              <div className="max-[500px]:p-3 max-[500px]:text-[12px]  ">
                Let the pages that inspire you inspire the next <br />{" "}
                generation of readers. Donate your favourite books <br /> to our
                library
              </div>
              <div className="">
                <li className="list-none text-xl text-red-500 underline">
                  Donate Now
                </li>
              </div>
            </div>
          </div>
          <div className=" rounded-full  flex justify-center items-center ">
              <img
                src={home2}
                className="h-[300px] w-[300px] max-[400px]:h-[200px] max-[400px]:w-[200px]"
                alt=""
              />
            </div>
        </div>
        </div>
      <div className="  p-5">
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
          <div className="relative  max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
            <div className=" text-red-700  text-3xl py-4 font  font-extrabold">
              {" "}
              Reach out and let's make your thoughts a reality – we're just a message away!
            </div>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae. explicabo. Sed ut perspiciatis unde omnis.
            </p>
            <form className="flex flex-col items-center w-full py-5 mb-4 md:flex-row md:px-16">
              <input
                placeholder="Email"
                required
                type="text"
                className="flex-grow w-full h-12 px-4 mb-3 text-black   border-2  border-red-500 rounded  md:mr-2 md:mb-0 bg-white focus:border-red-700  "
              />
              <a
                href="/"
                className="inline-flex items-center justify-center w-full h-12 px-6 font-semibold tracking-wide bg-red-600 text-white transition duration-200 rounded shadow-md md:w-auto hover:text--900 bg-teal-accent-400 hover:bg-teal-accent-700 focus:shadow-outline focus:outline-none"
              >
                Contact
              </a>
            </form>
      
            <a
              href="/"
              aria-label="Scroll down"
              className="flex items-center justify-center w-10 h-10 mx-auto text-black duration-300 transform border border-gray-400 rounded-full hover:text-teal-accent-400 hover:border-teal-accent-400 hover:shadow hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <Footer/>
      <ToastContainer/>
    </div>
    </>
  );
}
