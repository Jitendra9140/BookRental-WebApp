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
  try {
    // console.log(req.body.id);
    
    // Await the result of findOne
    const result = await User.findOne({ _id: req.body.id });
    
    // Check if result is null or not
    if (!result) {
      console.log("User not found in the database");
      return res.status(404).json({ message: "User not found" });
    }
    
    // console.log("User found by its ID in the database");
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error occurred during findById user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
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
  // console.log("I am here");
  try {
    const result = await Book.find({});
    res.status(200).json(result);
    // console.log("Successfully found the data");
  } catch (error) {
    console.log("Error occurred while finding the data: " + error);
    res.status(500).json({ message: "An error occurred while fetching the books." });
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
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching book with ID: ${id}`);

    // Use findById instead of findOne for better readability
    const book = await Book.findById(id);

    if (!book) {
      console.log("Book not found in the database");
      return res.status(404).json({ message: "Book not found" });
    }

    console.log("Book found by its ID in the database");
    res.status(200).json(book);
  } catch (error) {
    console.error("Error occurred while finding the book by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getdata = async (req, res) => {
  // console.log("i am here");
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
const updateUserCart = async (userId, cartItems) => {
  try {
    // Update the user's cart
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { cart: { $each: cartItems } },
      },
      { new: true }
    );

    if (!updatedUser) {
      console.warn("User not found");
      return null;
    }

    console.log("User cart updated successfully");
    return updatedUser;
  } catch (error) {
    console.error("Error occurred while updating user cart:", error);
    throw error;
  }
};


const addcart = async (req, res) => {
  const cartItems = req.body.data;
  const userId = req.body.id;
  console.log(cartItems);
  console.log("Jitendra");
  
  try {
    // Update the user's cart
    const updatedUser = await updateUserCart(userId, cartItems);
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Subtract quantity from each book in the book schema
    await updateBookQuantities(cartItems);
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error occurred while updating user or books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const updateBookQuantities = async (cartItems) => {
  try {
    const updatePromises = cartItems.map(async (item) => {
      const bookId = item.id; // Assuming `id` is used as the book's unique identifier
      const quantityToSubtract = item.quantity; // Quantity to subtract
      console.log(`Updating book ${bookId}, subtracting quantity: ${quantityToSubtract}`);

      // Find the book first to get its original quantity
      const book = await Book.findById(bookId);

      if (!book) {
        console.warn(`Book with ID ${bookId} not found.`);
        return null;
      }

      const originalQuantity = book.quantity; // Get the original quantity
      console.log(`Original quantity of book ${bookId}: ${originalQuantity}`);

      // Ensure there is enough stock before subtracting
      if (originalQuantity < quantityToSubtract) {
        console.warn(`Not enough stock for book ${bookId}.`);
        return null;
      }

      // Update the book's quantity
      const updatedBook = await Book.findOneAndUpdate(
        { _id: bookId },
        {
          $set: {
            quantity: originalQuantity - quantityToSubtract,
          },
        },
        { new: true }
      );

      if (!updatedBook) {
        console.warn(`Book with ID ${bookId} could not be updated. Possible stock issue.`);
        return null;
      }

      console.log(`Updated quantity of book ${bookId}: ${updatedBook.quantity}`);

      return { originalQuantity, newQuantity: updatedBook.quantity }; // Return the original and new quantities
    });

    // Await all book updates and collect quantity changes
    const quantities = await Promise.all(updatePromises);

    // Filter out any null values (where updates failed)
    const validQuantities = quantities.filter((quantity) => quantity !== null);

    console.log("Book quantities adjusted successfully:", validQuantities);

    return validQuantities;
  } catch (error) {
    console.error("Error occurred while updating book quantities:", error);
    throw error;
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


const pushbook = async (bookIdsToDelete) => {
  try {
    const books = await Book.find({ _id: { $in: bookIdsToDelete } });
    return books.map(book => ({
      id: book._id,
      image: book.image,
      price: book.price,
      dprice: book.dprice,
      quantity: book.quantity,
      title: book.title,
      timestamp: new Date(), // Or you can use Date.now() if you prefer
    }));
  } catch (error) {
    console.error("Error in pushbook:", error);
    throw error;
  }
};

const updateReturnBook = async (books) => {
  try {
    const updateReturnPromises = books.map(async (item) => {
      const bookId = item.id; // Assuming `id` is used as the book's unique identifier
      const quantityToAdd = item.aquantity; // Quantity to add back
      console.log(`Updating book ${bookId}, adding quantity: ${quantityToAdd}`);

      // Find the book first to get its original quantity
      const book = await Book.findById(bookId);

      if (!book) {
        console.warn(`Book with ID ${bookId} not found.`);
        return null;
      }

      const originalQuantity = book.quantity; // Get the original quantity
      console.log(`Original quantity of book ${bookId}: ${originalQuantity}`);

      // Update the book's quantity
      const updatedReturnBook = await Book.findOneAndUpdate(
        { _id: bookId },
        {
          $set: {
            quantity: originalQuantity + quantityToAdd, // Add back the quantity
          },
        },
        { new: true }
      );

      if (!updatedReturnBook) {
        console.warn(`Book with ID ${bookId} could not be updated.`);
        return null;
      }

      console.log(`Updated quantity of returned book ${bookId}: ${updatedReturnBook.quantity}`);

      return { originalQuantity, newQuantity: updatedReturnBook.quantity }; // Return the original and new quantities
    });

    // Await all book updates and collect quantity changes
    const quantities = await Promise.all(updateReturnPromises);

    // Filter out any null values (where updates failed)
    const validQuantities = quantities.filter((quantity) => quantity !== null);

    console.log("Book quantities adjusted successfully on return:", validQuantities);

    return validQuantities;
  } catch (error) {
    console.error("Error occurred while updating book quantities on return:", error);
    throw error;
  }
};
const cartbookdelete = async (req, res) => {
  try {
    const { userId, bookIdsToDelete ,books} = req.body;
   
    console.log(req.body.books);
    console.log("Jitendra")

    // Call the asynchronous pushbook function
    const bookIdsToPush = await pushbook(bookIdsToDelete);

    // Use findByIdAndUpdate to ensure atomic operations and updated syntax
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { return: { $each: bookIdsToPush } },
        $pull: { cart: { id: { $in: bookIdsToDelete } } },
      },
      { new: true, useFindAndModify: false }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
     
    await updateReturnBook(books);

    res.json({ message: 'Books removed from cart and added to the return collection', data: bookIdsToDelete });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error from cartbookdelete' });
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
  getbookid,
  getbook,
  findCartByBookId,
  getBookById,
  addcart,
};
