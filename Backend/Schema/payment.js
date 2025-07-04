const mongoose =require("mongoose")
var connection = mongoose.createConnection("mongodb://0.0.0.0:27017/AtRent");
const paymentSchema = mongoose.Schema({
   user: {
     type:String,
     required: true,
   },
   userName:{
    type:String,
    required:true,
   } , // Store the user's name in the payment document
   amount:{
    type:Number,
    required:true,
   } , // Store the user's name in the payment document
   razorpay_order_id: {
     type: String,
     required: true,
   },
   razorpay_payment_id: {
     type: String,
     required: true,
   },
   razorpay_signature: {
     type: String,
     required: true,
   },
   timestamp: {
     type: Date,
     default: Date.now, // Automatically set the timestamp to the current date and time
   },
 });

module.exports =mongoose.model("payment",paymentSchema);