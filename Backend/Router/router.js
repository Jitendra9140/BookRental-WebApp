const express=require("express")
const user =require("../Controller/userController")
const pay =require("../Controller/paymentController")
const invoice = require("../Controller/invoiceController")
const Router=express.Router();
const sendemail=require("../Controller/resetpassController")
const middlewere=require("../Middlewere/authenticate")
const cloudinaryMiddleware = require('../Middlewere/cloudinaryMiddleware')
Router.post("/add", cloudinaryMiddleware.uploadProfilePic, cloudinaryMiddleware.uploadToCloud('profile-pics'), user.adduser);
Router.post("/add/cart", user.addcart);
Router.post("/find",user.finduser);
Router.post("/findById",user.findUserByID);
Router.post("/updatepass",user.updatepassword);
Router.get("/varifyuser",middlewere.authenticate,user.varifyuser);
Router.get("/books",user.getbook);
Router.post("/returnbook",user.findCartByBookId);
Router.post("/deletebook",user.cartbookdelete);
Router.post("/deletcartbook",user.deletcartbook);
Router.get("/:id",user.getBookById);
Router.post("/checkout",pay.checkout);
Router.post("/payvarify",pay.payvarify);
Router.post("/addbook", cloudinaryMiddleware.uploadBookPic, cloudinaryMiddleware.uploadToCloud('book-pics'), user.addbook);
Router.post("/resetpass",sendemail.resetpass);
Router.post("/updateProfile", cloudinaryMiddleware.uploadProfilePic, cloudinaryMiddleware.uploadToCloud('profile-pics'), user.updateUserProfile);

// Invoice routes
Router.post("/invoice/purchase", invoice.createPurchaseInvoice);
Router.post("/invoice/return", invoice.createReturnInvoice);
Router.get("/invoice/user/:userId", invoice.getUserInvoices);
Router.get("/invoice/:invoiceId", invoice.getInvoiceById);

module.exports =Router;