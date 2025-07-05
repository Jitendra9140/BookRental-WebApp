import React from 'react'
import "../../Style/payment.css"
import { useNavigate } from 'react-router-dom'
import Navbar from '../../Components/common/Navbar';
import Footer from '../../Components/common/Footer'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'

function PaymentSuccess() {
  const navigate=useNavigate();
  const { user } = useContext(UserContext);
  const handleclick=()=>{
    // Use user context instead of localStorage
    navigate("/home")
  }
  return (
    <>
    <div className="sticky absolute top-0 left-0 z-20 shadow-md">
        <Navbar/>
        </div>
    <body className='flex justify-center items-center text-center h-screen  '>
      <div class="card  flex  justify-center">
      <div  className='flex justify-center' style={{borderRadius:"200px " ,height:"200px " ,width:"200px ", background: "#F8FAF5 ",margin:"0 auto"}}>
        <i class="checkmark">✓</i>
      </div>
        <h1>Success</h1> 
        <p>We received your purchase request;<br/> we'll be in touch shortly!</p>
	<button onClick={handleclick} class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white text-black rounded-md group-hover:bg-opacity-0">
      Go To My Books
  </span>
</button>
      </div>
    </body>
    <div className="  bottom-0 left-0 z-20 shadow-md">
        <Footer/>
        </div>
    </>
  )
}

export default PaymentSuccess
