import React,{useState,useEffect} from 'react'
import "../Style/Products.css"
import Navbar from './Navbar'
import { getContent} from '../Api/book'
import { Link,useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../Redux/Action/cartSlice'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function Products() {
  const navigate=useNavigate()
  useEffect(()=>{
    lodebook();
},[])
const {id}=useParams();
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
 const [book,setbook]=useState([
    { _id:"",
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
 ])

 const lodebook= async()=>{
        setLoading(true)
    const data = await getContent()
    setbook(data.data) 
    setLoading(false)
 } 
   const handleYearChange = (event) => {
    setYear(event.target.value);
    setSemester(''); // Clear semester when year changes
    setSubject('');  // Clear subject when year changes
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
    setSubject(''); // Clear subject when semester changes
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

const dispatch=useDispatch();
const addInCart=(e)=>{

 dispatch(addToCart(e))
 setTimeout(() => {
  navigate("/cart/" + id);
}, 1000);
}
//search box

var [selsub,setselsub]=useState([])

 useEffect(() => {
  // Function to filter books
  const filterBooks = () => {
    setLoading(true); // Set loading to true when filtering starts

    // Filter and set filtered books based on year, semester, and subject
    const filtered = book.filter((book) => (
      (!year || book.year === Number(year)) &&
      (!semester || book.semester === semester) &&
      (!subject || book.Subject === subject)
    ));

    // Simulate a delay of 1 second (1000 milliseconds)
    setTimeout(() => {
      setFilteredBooks(filtered);
      setLoading(false); // Set loading to false when filtering is done
    }, 1000); // Adjust the delay time as needed
  };

  filterBooks(); // Call the filterBooks function
}, [year, semester, subject, book]);


  return (
    <div className=" h-screen">  
        <div className="sticky absolute top-0 left-0 z-20 shadow-md">
        <Navbar/>
        </div>
           <div className='flex flex-row iteam-center justify-center my-3'>
     <FormControl sx={{ m: 1, minWidth: 120 }}>
 <InputLabel>Year</InputLabel>
 <Select value={year} onChange={handleYearChange}>
   <MenuItem value="">All</MenuItem> {/* Add an option to show all years */}
    {Array.from(new Set(
      book
        .filter((book) => (
          (!semester || book.semester === semester) && // Filter by semester
          (!subject || book.Subject === subject) // Filter by subject
        ))
        .map((book) => book.year)
    )).map((uniqueYear) => (
      <MenuItem key={uniqueYear} value={uniqueYear}>
        {uniqueYear}
      </MenuItem>
    ))}
  </Select>
</FormControl>
<FormControl sx={{ m: 1, minWidth: 120 }}>
  <InputLabel>Semester</InputLabel>
  <Select value={semester} onChange={handleSemesterChange}>
    <MenuItem value="">All</MenuItem> {/* Add an option to show all semesters */}
    {Array.from(new Set(
      book
        .filter((book) => (
          (!year || book.year === Number(year)) && // Filter by year
          (!subject || book.Subject === subject) // Filter by subject
        ))
        .map((book) => book.semester)
    )).map((uniqueSemester) => (
      <MenuItem key={uniqueSemester} value={uniqueSemester}>
        {uniqueSemester}
      </MenuItem>
    ))}
  </Select>
</FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Subject</InputLabel>
          <Select value={subject} onChange={handleSubjectChange}>
    {book
      .filter((book) => (
        (!year || book.year === Number(year)) && // Filter by year
        (!semester || book.semester === semester) // Filter by semester
      ))
      .map((book) => (
        <MenuItem key={book.Subject} value={book.Subject}>
          {book.Subject}
        </MenuItem>
      ))}
  </Select>
        </FormControl>
        </div>
        <div className="flex gap-3 flex-wrap justify-center  ">
        {loading ? (
          <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
       </svg>):(
  filteredBooks.map((data, key) => (
             <div class="p-6 " key={data._id}>
             <div class="flex max-w-md bg-white  shadow-xl rounded-lg overflow-hidden">
               <div class="w-1/3  " >
                 <img  className='w-full h-full object-fit: contain; ' src={`${data.image}`} alt="" />
               </div> 
               <div class="w-2/3 p-4">
                 <h1 class="text-gray-900 font-bold text-2xl">{data.title}</h1>
                 <h3 class="text-gray-900 font-semibold text-[14px]">{data.publisher}</h3>
                 <p class="mt-2 text-gray-600 text-sm">{data.description}</p>
                 <div className=" text-xl  text-balck">
                     <span className="text-black font-bold">Price: </span> ⟨₹⟩ {data.price}
                    </div>
                 <div class="flex item-center justify-around mt-3">
                   <Link>
 <a class=" p-2 bg-red-800 text-white text-xs font-bold text-decoration-none uppercase rounded" onClick={()=>{ addInCart(data)}} >Add to Cart</a>
 </Link>
             <Link to={'/'+id+'/book/'+data._id}>
 <a class="p-2 bg-red-800 text-white text-xs font-bold text-decoration-none uppercase rounded"   >View Book</a>
 </Link>
                 </div>
               </div>
             </div>
           </div>
          ))
          ) }
        </div> 
        
    </div>
  )
}
