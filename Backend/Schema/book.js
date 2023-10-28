const mongoose =require("mongoose")
const autoincrement=require("mongoose-auto-increment")
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
      image:String
})
autoincrement.initialize(connection)
module.exports =mongoose.model("book",bookShema);