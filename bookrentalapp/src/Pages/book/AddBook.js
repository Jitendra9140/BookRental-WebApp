import React,{useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { addbook } from '../../Api/book';
import { UserContext } from '../../contexts/UserContext';

export default function AddBook() {
    const [book,setbook]=useState({
        name:"",
        price:"",
        author:"",
        bookPic:"",
        discription:"",
      }) 
    
      const navigate=useNavigate()
      const { user } = useContext(UserContext);
      const id = user ? user._id : window.localStorage.getItem("Id")
      
      const handleSubmit = async (event) => {
        try {
          event.preventDefault();
          // console.log(book)
          if(book.name!==" "&&book.price!==" "&&book.discription!==" "&&book.author!==" "&&book.bookPic!==" "){
             console.log("hoja bhai")   
             await addbook(book);
             window.location.href=`/${id}`
          }
          else{
            console.log("all feald required")
            navigate("/addbook")
          }
        } catch (error) {
           console.log("error"+error)
        }
       
        
      };
    
      const imgUplode = (e)=>{
        setbook({...book,bookPic:e.target.files[0]})
      }
      
      const handlechange=(e)=>{
           const {name,value}=e.target;
          setbook({...book,[name]:value})
      }
  return (
    <div className=''>
    <div class="min-h-screen h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
  <div class="relative py-3 sm:max-w-xl sm:mx-auto">
    <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
      <div class="max-w-md mx-auto">
        <div class="flex items-center space-x-5">
          <div class="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">i</div>
          <div class="block pl-2 font-semibold text-xl self-start text-gray-700">
            <h2 class="leading-relaxed">Add Book</h2>
            <p class="text-sm text-gray-500 font-normal leading-relaxed"></p>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div class="flex flex-col">
              <label class="leading-loose">Book Name</label>
              <input type="text" class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" onChange={handlechange} placeholder="Book name"  name="name" />
            </div>
            <div class="flex flex-col">
              <label class="leading-loose">Book Price</label>
              <input type="text" class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" onChange={handlechange} placeholder="Price" name="price"/>
            </div>
            <div class="flex flex-col">
              <label class="leading-loose">Author</label>
              <input type="text" class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" onChange={handlechange} placeholder="Author" name="author"/>
            </div>
            <div class="flex flex-col">
              <label class="leading-loose">Image</label>
              <input type="file" class="px-4  border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" onChange={imgUplode} placeholder="image" name="bookPic"/>
            </div>
            
            <div class="flex flex-col">
              <label class="leading-loose">Book Description</label>
              <textarea type="text" class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" onChange={handlechange} placeholder="discription" name='discription'></textarea>
            </div>
          </div>
          <div class="pt-4 flex items-center space-x-4 my-1">
              <button class="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none" onClick={handleSubmit}>AddBook</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}
