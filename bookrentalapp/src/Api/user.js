import axios from "axios";
const url="http://localhost:8000"

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
         console.log("useris added by api")
    }
    catch(err){
          console.log("error is occur in adding user by api")
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
export const varifyuser = async (token) => {
  try {
    const response = await axios.get(`${url}/varifyuser`, {
      headers: {
        Authorization:token.token// Assuming you're using a Bearer token
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
export const deletcartbook= async({userId,bookIdsToDelete})=>{
    try{ 
       console.log(userId)
        return await axios.post(`${url}/deletebook`,{userId,bookIdsToDelete})
    }
    catch(err){
          console.log("error is occur in finding user by api")
    }
}