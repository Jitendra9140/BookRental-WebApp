import React, { useRef, useState, useEffect } from "react";
import "../Style/Home.css";
import Carousel from "react-elastic-carousel";
import { getContent } from "../Api/book";
import {useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { addToCart } from '../Redux/Action/cartSlice'
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./Navbar";
import Footter from "./Footter";
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
  const [book, setbook] = useState([
    {
      _id:"",
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
    },
  ]);
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
  const id=window.localStorage.getItem("Id")
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
  return (
       <>
        <div className="sticky absolute top-0 left-0 shadow-md z-10">
        <Navbar/>
        </div>
    <div>
        {/* banner section */}
      <div className="">
        <div className="landing flex justify-center items-center flex-row  bg-gray-100  h-[60vh]  gap-1">
          <div className="   w-100  ">
            <div className="text-[2.9rem] text-red-600 font-serif font-bold leading-normal ">
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
          <div className="w-3/4 flex justify-center items-cente">
            <div className=" rounded-full  flex justify-center items-cente ">
              <img
                src={banner}
                className=""
                style={{ width: "400px", height: "500px" }}
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
        <Carousel className='generas w-full' 
     ref={carouselRef}
     enableAutoPlay
     autoPlaySpeed={1500} // same time
     onNextEnd={handleNextEnd}
  
  transitionMs={1500}

     itemsToShow={7}
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
      <div className="flex  h-96 w-full bg-gray-100 ">
        <div className=" w-1/2 items-center flex flex-col mx-auto   justify-center ">
          <div className="flex flex-col gap-3">
            <div className="text-red-700 text-4xl font-bold font-serif ">
              The More You Read The <br /> Less You Pay
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
        </div>
        <div className=" w-1/2 flex justify-center items-center">
          <img src={home1} className="h-80" alt="" />
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className=" flex  justify-around flex-row py-6">
          <button class="bg-white w-[200px] border border-red-600 hover:bg-[#FC2947] hover:text-white  rounded-[20px] mt-7 text-3xl font-serif font-bold text-red-600 py-4 mr-[2px]">Book</button>
          <button class=" bg-white w-[200px] border border-red-600 hover:bg-[#FC2947] hover:text-white  rounded-[20px] mt-7 text-3xl font-serif font-bold text-red-600 py-4 mr-[2px]">Author</button>
        </div>
        <div className=" flex  bg-white p-3 " >
          <div className="" style={{width:"20%"}}>
            <img
              src="https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
              className="
          h-[600px]  w-full rounded-md"
              alt=""
            />
          </div>
          <div className="gap-2 flex-wrap flex flex-row  px-2 " style={{width:"80%"}}>
            <Carousel
              className="book1"
              itemsToShow={3}
              itemPadding={[10, 10]}
              itemsToScroll={1}
            >
              {book.map((data, key) => (
                
                 <div className="w-[420px] h-[250px] shadow-md shadow-red-100 rounded-[10px] flex flex-row justify-center items-center gap-3 p-1  ">
                 <div className="w-1/2 border-3 m-2 h-[200px] ">
                   <img src={data.image} className="h-[200px] object-fill rounded-md" alt="" />
                 </div>
                 <div className="w-1/2 flex gap-2 flex-col ">
                   <h1 className="text-3xl font-bold font-serif text-red-700 overflow-hidden truncate whitespace-nowrap">
                     {data.Subject}
                   </h1>
                   <div className=" text-xl  text-red-400">
                     <span className="text-black font-bold">Price: </span> ⟨₹⟩ {data.price}
                    </div>
                   <div>
                     <button className="bg-white w-[80px] border border-red-600 hover:bg-[#FC2947] hover:text-white rounded-[20px] mt-7 text-xl font-serif font-bold text-red-600 py-2 mr-[2px]" onClick={()=>{ addInCart(data)}}>Rent</button>
                   </div>
                 </div>
               </div> 
              ))}
            </Carousel>
            <Carousel
              className="book1"
              itemsToShow={3}
              itemPadding={[10, 10]}
              itemsToScroll={1}
            >
              {book.map((data, key) => (
                <div className="w-[420px] h-[250px] shadow-md shadow-red-100 rounded-[10px] flex flex-row justify-center items-center gap-3 p-1">
                <div className="w-1/2 border-3 m-2 h-[200px]">
                  <img src={data.image} className="h-[200px] object-cover rounded-md" alt="" />
                </div>
                <div className="w-1/2 flex gap-2 flex-col">
                  <h1 className="text-3xl font-bold font-serif text-red-700 overflow-hidden truncate whitespace-nowrap">
                    {data.Subject}
                  </h1>
                  <div className=" text-xl text-red-400">
                     <span className="text-black texxt-xl font-bold">Price: </span> ⟨₹⟩ {data.price}
                    </div>
                  <div>
                    <button className="bg-white w-[80px] border border-red-600 hover:bg-[#FC2947] hover:text-white rounded-[20px] mt-7 text-xl font-serif font-bold text-red-600 py-2 mr-[2px]" onClick={()=>{ addInCart(data)}}>Rent</button>
                  </div>
                </div>
              </div>
              ))}
            </Carousel>
           
          </div>
        </div>
        <div className=" flex flex-col ">
          <div className="  text-3xl font text-red-600 font-extrabold pl-20">
            New Araivals
          </div>
          <Carousel
              className="book1"
              itemsToShow={3}
              itemPadding={[10, 10]}
              itemsToScroll={1}
            >
              {book.map((data, key) => (
                 <div className="w-[420px] h-[250px] shadow-md shadow-red-100 rounded-[10px] flex flex-row justify-center items-center gap-3 p-1">
                 <div className="w-1/2 border-3 m-2 h-[200px]">
                   <img src={data.image} className="h-[200px] object-cover rounded-md" alt="" />
                 </div>
                 <div className="w-1/2 flex gap-2 flex-col">
                   <h1 className="text-3xl font-bold font-serif text-red-700 overflow-hidden truncate whitespace-nowrap">
                     {data.Subject}
                   </h1>
                   <div className=" text-xl  text-red-400">
                     <span className="text-black  font-bold">Price: </span> ⟨₹⟩ {data.price}
                    </div>
                   <div>
                     <button className="bg-white w-[80px] border border-red-600 hover:bg-[#FC2947] hover:text-white rounded-[20px] mt-7 text-xl font-serif font-bold text-red-600 py-2 mr-[2px]" onClick={()=>{ addInCart(data)}}>Rent</button>
                   </div>
                 </div>
               </div>
              ))}
            </Carousel>
          
        </div>
        <div className=" flex flex-col ">
          <div className=" text-black text-3xl font text-red-600 font-extrabold pl-10 ">
            Kids Spacial
          </div>
          <Carousel
              className="book1"
              itemsToShow={3}
              itemPadding={[10, 10]}
              itemsToScroll={1}
            >
              {book.map((data, key) => (
                 <div className="w-[420px] h-[250px] shadow-md shadow-red-100 rounded-[10px] flex flex-row justify-center items-center gap-3 p-1">
                 <div className="w-1/2 border-3 m-2 h-[200px]">
                   <img src={data.image} className="h-[200px] object-cover rounded-md" alt="" />
                 </div>
                 <div className="w-1/2 flex gap-2 flex-col">
                   <h1 className="text-3xl font-bold font-serif text-red-700 overflow-hidden truncate whitespace-nowrap">
                     {data.Subject}
                   </h1>
                   <div className=" text-xl  text-red-400">
                     <span className="text-black font-bold">Price: </span> ⟨₹⟩ {data.price}
                    </div>
                   <div>
                     <button className="bg-white w-[80px] border border-red-600 hover:bg-[#FC2947] hover:text-white rounded-[20px] mt-7 text-xl font-serif font-bold text-red-600 py-2 mr-[2px]" onClick={()=>{ addInCart(data)}}>Rent</button>
                   </div>
                 </div>
               </div>
              ))}
            </Carousel>
        </div>
      </div>
        <div className="flex  h-96 w-full bg-gray-100 z-0" >
          <div className=" w-1/2 items-center flex flex-col mx-auto   justify-center ">
            <div className="flex flex-col gap-3">
              <div className="text-red-700 text-4xl font-bold font-serif ">
                Spread The Joy Of <br /> Reading
              </div>
              <div className="">
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
          <div className=" w-1/2 flex justify-center items-center">
            <img src={home2} className="h-80" alt="" />
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
      <Footter/>
      <ToastContainer/>
    </div>
    </>
  );
}
