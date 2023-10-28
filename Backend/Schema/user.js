const mongoose =require("mongoose")
const autoincrement=require("mongoose-auto-increment")
var connection = mongoose.createConnection("mongodb://0.0.0.0:27017/AtRent");
const userShema=mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    password:String,
    confirmpassword:String,
    profilePic:String,
    age:Number,
    phonenumber:Number,
    cart:[
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
autoincrement.initialize(connection)
userShema.plugin(autoincrement.plugin,"user")
module.exports =mongoose.model("user",userShema);