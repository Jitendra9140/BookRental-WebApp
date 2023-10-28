const express=require("express")
const user =require("../Controller/userController")
const pay =require("../Controller/paymentController")
const multer=require("multer");
const Router=express.Router();
const sendemail=require("../Controller/resetpassController")
const middlewere=require("../Middlewere/authenticate")
//for profile pic
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/profilePic')
    },
    filename: function (req, file, cb) {
    
      cb(null, Date.now() + '_' + file.originalname)
    }
  })
const upload = multer({ storage: storage })
Router.post("/add", upload.single('profilePic'), user.adduser);
Router.post("/add/cart", user.addcart);
Router.post("/find",user.finduser);
Router.post("/findById",user.findUserByID);
Router.post("/updatepass",user.updatepassword);
Router.get("/varifyuser",middlewere.authenticate,user.varifyuser);
Router.get("/books",user.getbook);
Router.post("/returnbook",user.findCartByBookId);
Router.post("/deletebook",user.cartbookdelete);
Router.get("/:id",user.getbookid);
Router.post("/checkout",pay.checkout);
Router.post("/payvarify",pay.payvarify);
Router.post("/addbook", upload.single('bookPic'),user.addbook);
Router.post("/resetpass",sendemail.resetpass);
module.exports =Router;