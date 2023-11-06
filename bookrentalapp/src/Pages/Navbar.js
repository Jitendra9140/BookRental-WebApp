import React , {useState,useEffect}  from 'react'
import { varifyuser } from "../Api/user";
import { Link} from 'react-router-dom'
import logo from "../images/logo-png.png"
export default function Navbar() {
      useEffect(()=>{
        varify();
    },[])
    const [user, setuser] = useState({
      email: "",
      fname:"",
      profilePic:""
    });
    const id=window.localStorage.getItem("Id")
    const token=window.localStorage.getItem("token")
      const varify= async()=>{
         const res=await varifyuser({token:token});
           const id=res.validuser._id
           window.localStorage.setItem("Id", id);
           console.log(id)
          setuser({
            email:res.validuser.email,
            fname:res.validuser.fname,
            profilePic:res.validuser.profilePic,
          })
      }
      
  return (
   
      
<nav class="bg-white border-gray-200 z-20 ">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <a href="" class="flex items-center">
        <img src={logo} class="h-16  w-48" alt="Flowbite Logo" />
    </a>
    <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
        <span class="sr-only">Open main menu</span>
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
    <div class="hidden w-full  md:block md:w-auto" id="navbar-default">
      <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white  dark:border-gray-700">
        <li>
        <Link to="/home">
          <a href="#" class="block py-2 pl-3 pr-4 text-red-600  rounded md:bg-transparent md:p-0  font-semibold" aria-current="page">Home</a>
        </Link>
        </li>
        <li>
        <Link to={"/" + id + "/products"}>
          <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Book</a>
        </Link>
        </li>
        <li>
        <Link to={"/buyHistory"}>
          <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Purchesed</a>
          </Link>
        </li>
        <li>
        <Link to={"/Return"}>
          <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">ReturnBook</a>
          </Link>
        </li>
        <li>
        <Link to={"/cart/"+id}>
          <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Cart</a>
          </Link>
        </li>
        {/* <li>
        <Link to={"/addbook"}>
          <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Addbook</a>
          </Link>
        </li> */}
        <li>
        <Link to="/">
          <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">logout</a>
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
  
  )
}
