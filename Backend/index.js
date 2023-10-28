const express=require("express")
const bodyparser=require("body-parser")
const cors=require("cors")
const cookiparser=require("cookie-parser");
const  Connection  = require("./db")
require("dotenv").config()
const Router=require("./Router/router")
const app=express();
Connection()
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE"
}
))
app.use(express.json())
app.use(cookiparser())
app.use("/",Router)
app.use("/public",express.static('public'))
app.get("/",(req,res)=>{
    res.send("jitendra")
})
app.get("/pay/getkey",(req,res)=>{
    res.status(200).json({key:process.env.KEY_ID})
})
app.listen(8000,()=>{ 
    console.log("Backend is listen on port 8000")
})
