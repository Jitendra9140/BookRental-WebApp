import axios from "axios";
const url="http://localhost:8000"
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
        console.log(data);
        return await axios.get(`${url}/${data}`,data)
    }
    catch(err){
          console.log("error is occur in finding data by api")
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
