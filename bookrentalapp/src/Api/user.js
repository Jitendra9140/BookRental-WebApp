import axios from "axios";
import config from "../config";
const url = config.apiUrl;

export const newuser= async(data)=>{
    const formdata=new FormData();
    formdata.append("profilePic",data.profilePic,data.profilePic.name);
    formdata.append('fname',data.fname)
    formdata.append('lname',data.lname)
    formdata.append('password',data.password)
    formdata.append('confirmpassword',data.confirmpassword)
    formdata.append('email',data.email)
    formdata.append('year',data.year)
    formdata.append('phonenumber',data.phonenumber)
    console.log(formdata);
    try{
         const user= await  axios.post(`${url}/add`,formdata);
         console.log("user is add to db")
         return user;
    }
    catch(err){
          console.log("error is occur in adding user by api")
    }
}

export const cart= async(data,id)=>{
    console.log(data)
    try{
         await axios.post(`${url}/add/cart`,{data:data,id:id})
         console.log("book is added in cart ")
    }
    catch(err){
          console.log("error is occur in adding the book in cart")
    }
}

export const findUser= async(data)=>{
    try{ 
        const user=await axios.post(`${url}/find`,data)
        return user;
    }
    catch(err){
          console.log(err) 
    }
}
export const updatepass= async(data)=>{
    try{ 
        console.log(data)
        const user=await axios.post(`${url}/updatepass`,data)
        return user;
    }
    catch(err){
          console.log("Error during updating password") 
    }
}
export const verifyUser = async (tokenObj) => {
  try {
    // Check if token is passed as an object or string
    const tokenValue = tokenObj.token || tokenObj;
    
    const response = await axios.get(`${url}/varifyuser`, {
      headers: {
        Authorization: tokenValue
      },
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.log("Error during verification:", error);
    throw error; // Rethrow the error to handle it higher up the call stack
  }
};
export const findUserByID= async(id)=>{
   
    try{
        return await axios.post(`${url}/findById`,{id:id})
    }
    catch(err){
          console.log("error is occur in finding user by api")
    }
}
export const findinCart= async({userId,bookid})=>{
    try{ 
        return await axios.post(`${url}/returnbook`,{userId,bookId:bookid})
    }
    catch(err){
          console.log("error is occur in finding user by api")
    }
}
export const deletcartbook= async({userId,bookIdsToDelete,booksToUpdate,partialReturns})=>{
    try{ 
        // Log the parameters being sent to the backend
        console.log("Sending to backend:", {userId, bookIdsToDelete, booksToUpdate, partialReturns})
       
        // Make sure we're sending the correct parameters to match the backend controller
        return await axios.post(`${url}/deletcartbook`,{userId, bookIdsToDelete, booksToUpdate, partialReturns})
    }
    catch(err){
        console.error("Error in processing book return:", err)
        throw err; // Rethrow to allow proper error handling in the component
    }
}

export const updateUserProfile = async (userId, userData) => {
    try {
        const formData = new FormData();
        
        // Append profile picture if provided
        if (userData.profilePic) {
            formData.append("profilePic", userData.profilePic, userData.profilePic.name);
        }
        
        // Append other user data
        formData.append('fname', userData.fname);
        formData.append('lname', userData.lname);
        formData.append('phonenumber', userData.phonenumber);
        formData.append('year', userData.year);
        formData.append('userId', userId);
        
        console.log("Updating user profile:", userId);
        
        const response = await axios.post(`${url}/updateProfile`, formData);
        return response;
    } catch (err) {
        console.error("Error updating user profile:", err);
        throw err; // Rethrow to allow proper error handling in the component
    }
}