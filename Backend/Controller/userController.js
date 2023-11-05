const User = require("../Schema/user");
const Book = require("../Schema/book");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const adduser = async (req, res) => {
  const profilePic = req.file ? req.file.path : null;

  const { fname, lname, password, email,confirmpassword,year,phonenumber } = req.body;
  console.log(confirmpassword);
  console.log(year)
  const userexist= await User.findOne({email:email})
  try {
    if(userexist){
      console.log(fname);
      const json=res.json({
        status:"error",
        data:"user is alredy exist "
      });

     return json;
    }
    else{
       const haspassword= await bcrypt.hash(password,10)
       const newUser = new User({ fname, lname, password:haspassword, email, profilePic,year,phonenumber,  cart: [],});
      await newUser.save();
      console.log("user is added in db");
      res.status(200).json(newUser.name);
    }
  } catch (err) {
    console.log("err ocuur during storing user " + err);
  }
};

const finduser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await User.findOne({ email: email });
    if (!result) {
      console.log("User not found in db");
      return res.status(404).json({ message: "User not found in db" });
    }
   const matchPass = await bcrypt.compare(password, result.password);
   if(!matchPass) {
      console.log("User password is wrong");
      return res.status(400).json({ data: "Password is wrong" ,status:"400"});
    }
    const secretKey = "jnnnfnfnfndsnfsifnfjsbs";
    const token = jwt.sign({ id: result._id }, secretKey);
    res.cookie("userCooki",token,{
      expires:new Date(Date.now()+1000000),
      httpOnly:true,

    })
    console.log("User found in db");
    console.log(token);
    return res.status(200).json({ user: result,token:token});
  } catch (error) {
    console.log("Error occurred during finding user: " + error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const varifyuser= async(req,res)=>{
       try {
         const validuser= await User.findOne({_id:req.id});
         res.status(201).json({status:201,validuser})
       } catch (error) {
        res.status(401).json({status:401,error})
       } 
 }
const findUserByID = async (req, res) => {
  console.log(req.body.id);
  User.findOne({ _id: req.body.id }, (err, result) => {
    if (!err) {
      if (!result) {
        console.log("user not found in db");
        res.status(200).json(result);
      } else {
        res.status(200).json(result);
        console.log("user found in by its id db");
      }
    } else {
      console.log("err ocuur during findinBy Id user " + err);
    }
  });
};

const updatepassword=async(req,res)=>{
  const {email , password}=req.body;
  const validuser= User.findOne({email:email});
  if(!validuser){
    console.log("not valid user")
    res.status(400).json({
      status:400,
      message:"Email is not valid"
    })
    }
    else{
      const haspassword= await bcrypt.hash(password,10)
      try {
        await User.findOneAndUpdate({ email:email },{ password: haspassword});
        console.log("succsess")
        res.status(200).json({ status: 200, message: 'Password updated' });
      } catch (err) {
        console.log("error")
        res.status(500).json({ code: 500, message: 'Server error' });
      }
    }
}
const addbook = async (req, res) => {
  console.log(req.file);
  console.log("i am here ______");
  const bookPic = req.file ? req.file.path : null;
  // console.log(req.file.path)
  const { name, price, author, discription } = req.body;
  const newBook = new Book({ name, price, author, discription, bookPic });
  try {
    await newBook.save();
    console.log("user is added in db");
    res.status(200).json(newBook.name);
  } catch (err) {
    console.log("err ocuur during storing user " + err);
  }
};


const getbook = async (req, res) => {
  console.log("i am here");
  try {
    await Book.find({},(err, result) => {
      if (!err) {
        res.status(200).json(result);
        console.log("Succecfully finding the data");
      } else {
        console.log("error is occor finding the data" + err);
      }
    });
  } catch (error) {
    console.log("error is occor finding the data" + error);
  }
};
const getbookid = async (req, res) => {
  console.log(req.params.id);
  console.log("asaaaaaaaaaaaaaaaaaaaaa");
  Book.findOne({ _id: req.params.id }, (err, result) => {
    if (!err) {
      if (!result) {
        console.log("user not found in db");
        res.status(200).json(result);
      } else {
        res.status(200).json(result);
        console.log("book found in by its id db");
      }
    } else {
      console.log("err ocuur during book Id user " + err);
    }
  });
};
const getdata = async (req, res) => {
  console.log("i am here");
  try {
    await Book.find({}, (err, result) => {
      if (!err) {
        res.status(200).json(result);
        console.log("Succecfully finding the data");
      } else {
        console.log("error is occor finding the data" + err);
      }
    });
  } catch (error) {
    console.log("error is occor finding the data" + error);
  }
};
const addcart = async (req, res) => {
  const cartItems  = req.body.data;
  const id = req.body.id;
  console.log(cartItems)
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
       
          $push: { cart: { $each: cartItems } },
       
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated successfully:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error occurred while updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const findCartByBookId = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
     console.log(req.body)
    if (!userId || !bookId) {
      return res.status(400).json({ message: 'userId and bookId are required.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const cartItem = user.cart.find(item => item.id === bookId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Book not found in the cart.' });
    }

    return res.status(200).json(cartItem);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// const cartbookdelete = async ( req, res) => {
// try {
//   // Use findByIdAndUpdate with $pull to remove the item from the cart
//    const { userId,bookIdsToDelete}=req.body
//    console.log(bookIdsToDelete)
//   const updatedUser = await User.findByIdAndUpdate(
//     userId,
//     {
//       $pull: { cart: { id: { $in: bookIdsToDelete} } },
//     },
//     { new: true } // To get the updated user document
//   );
//   res.json({ message: 'Books removed from cart ', data:bookIdsToDelete})
//   if (!updatedUser) {
//     throw new Error("User not found");
//   }
//   return updatedUser;
// } catch (error) {
//   console.error(error);
//   throw error; // Rethrow the error for handling in the calling function
// }
// };
const pushbook = async (bookfind) => {
  const userId = '0'; // Assuming a default user ID

  // Wrap the asynchronous operation in a promise
  return new Promise((resolve, reject) => {
    // Find the user by their ID and retrieve the 'cart' field
    User.findOne({ _id: userId }, 'cart', (err, user) => {
      if (err) {
        console.error('Error:', err);
        reject(err);
        return;
      }

      if (!user) {
        console.log('User not found');
        reject('User not found');
        return;
      }

      // Filter the items in the 'cart' based on the provided book IDs
      const booksInCart = user.cart.filter((book) => bookfind.includes(book.id));

      resolve(booksInCart);
    });
  });
};

const cartbookdelete = async (req, res) => {
  try {
    const { userId, bookIdsToDelete } = req.body;

    // Call the asynchronous pushbook function
    const bookIdsToPush = await pushbook(bookIdsToDelete);

    // Use findOneAndUpdate to ensure atomic operations
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { return: { $each: bookIdsToPush } },
        $pull: { cart: { id: { $in: bookIdsToDelete } } },
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    res.json({ message: 'Books removed from cart and added to the return collection', data: bookIdsToDelete });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




module.exports = {
  adduser,
  finduser,
  findUserByID,
  varifyuser,
  updatepassword,
  getdata,
  cartbookdelete,
  addbook,
  getbook,
  findCartByBookId,
  getbookid,
  addcart,
};
