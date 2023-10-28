const jwt=require("jsonwebtoken")
const User = require("../Schema/user");
const secretKey = "jnnnfnfnfndsnfsifnfjsbs";
const authenticate=async(req,res,next)=>{
    try {
        const token=req.headers.authorization;
        console.log(token)
        const varifytoken=jwt.verify(token,secretKey)
        console.log(varifytoken)
        const rootuser=await User.findOne({_id:varifytoken.id})
        // console.log(rootuser)
        if(!rootuser){
            throw new Error("User not found");
        }
        req.rootuser=rootuser;
        req.token=token;
        req.id=varifytoken.id;
        next();
    } catch (error) {
        console.log("unathorized token")
       res.status(401).json({status:401,message:"unathorized token "})
    }
}
const storeData = (req, res, next) => {
    req.tempData = {
      amount: req.body.amount,
      userId: req.user.id, // Assuming you have user information available
      userName: req.user.fname, // Assuming you have user information available
    };
    next();
  };
module.exports={
    authenticate,
    storeData,
};