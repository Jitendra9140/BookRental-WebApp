const mongoose =require("mongoose")
var connection = mongoose.createConnection("mongodb://0.0.0.0:27017/AtRent");
const bookShema=mongoose.Schema({
      title:String,
      author:String,
      edition:String,
      publisher:String,
      pages:String,
      language:String,
      description:String,
      price:Number,
      quantity:Number,
      image:String,
      imageId:String // Cloudinary public_id for book image
})
module.exports =mongoose.model("book",bookShema);