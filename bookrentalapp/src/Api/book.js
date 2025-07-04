import axios from "axios";
import config from "../config";
const url = config.apiUrl;

export const getContent = async()=>{
    try{
        return await axios.get(`${url}/books`)
    }
    catch(err){
          console.log("error is occur in finding data by api")
    }
}
export const getdata = async(data)=>{
    try{
        return await axios.get(`https://www.googleapis.com/books/v1/volumes?q='gaban'&key=AIzaSyBUP1LKNxhjTlZMEPKzhETojv0kPMBDPwE&maxResults=40`)
    }
    catch(err){
          console.log("error is occur in finding data by api")
    }
}
export const getbook = async(data)=>{
    try{
        if (!data) {
            console.error("Invalid book ID provided to getbook API");
            return { data: null, error: "Invalid book ID" };
        }
        
        console.log("Fetching book with ID:", data);
        const response = await axios.get(`${url}/${data}`);
        
        // Check if the response has the expected structure
        if (response && response.data) {
            // If the response contains a success property and a book property (from backend)
            if (response.data.success && response.data.book) {
                return {
                    data: response.data.book
                };
            }
            // If the response is just the book data directly
            return response;
        } else {
            console.error("Unexpected API response format:", response);
            return { 
                data: null, 
                error: "Unexpected API response format" 
            };
        }
    }
    catch(err){
        console.error("Error in getbook API:", err);
        // Return a structured error response instead of undefined
        return { 
            data: null, 
            error: err.message || "Error occurred in finding data by API" 
        };
    }
}
export const addbook= async(data)=>{
    const bookdata=new FormData();
    bookdata.append("bookPic",data.bookPic,data.bookPic.name);
    bookdata.append('name',data.name)
    bookdata.append('price',data.price)
    bookdata.append('author',data.author)
    bookdata.append('discription',data.discription)
    console.log(data);
    console.log(bookdata)
    try{
         await axios.post(`${url}/addbook`,bookdata);
         console.log("book added by api")
    }
    catch(err){ 
        console.log("error is occur in adding book by api")
    }
}
