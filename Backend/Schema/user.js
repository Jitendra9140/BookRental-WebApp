const mongoose =require("mongoose")
var connection = mongoose.createConnection("mongodb://0.0.0.0:27017/AtRent");
const userShema=mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    confirmpassword:String,
    profilePic:String,
    profilePicId:String, // Cloudinary public_id for profile picture
    year:Number,
    phonenumber:Number,
    cart:[
        {   id:{
            type: String,
            required: true,
          },
            image:{
                type:String,
            },
            imageId:{ // Cloudinary public_id for cart item image
                type:String,
                // required:true
            },
            price:{
                type: Number,
                // required: true,
              },
            dprice:{
                type:Number,
                // required: true,
              },
              quantity:{
                type: Number,
                // required: true,
              },
            title:{
                type: String,
                // required: true,
              },
            timestamp:{
                type: Date,
                default: Date.now, 
              },
        }
    ],
    return:[
        {   id:{
            type: String,
            required: true,
          },
            image:{
                type:String,
                // required:true
            },
            price:{
                type: Number,
                // required: true,
              },
            dprice:{
                type:Number,
                // required: true,
              },
              quantity:{
                type: Number,
                // required: true,
              },
            title:{
                type: String,
                // required: true,
              },
            timestamp:{
                type: Date,
                default: Date.now, 
              },
        }
    ]
    }
)

module.exports =mongoose.model("user",userShema); 