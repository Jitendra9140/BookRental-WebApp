const User = require("../Schema/user");
const Book = require("../Schema/book");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const adduser = async (req, res) => {
  // Get Cloudinary upload result from middleware
  const profilePic = req.cloudinaryResult ? req.cloudinaryResult.url : null;
  const profilePicId = req.cloudinaryResult ? req.cloudinaryResult.public_id : null;

  const { fname, lname, password, email, confirmpassword, year, phonenumber } = req.body;
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
       const newUser = new User({ 
         fname, 
         lname, 
         password: haspassword, 
         email, 
         profilePic, 
         profilePicId,
         year, 
         phonenumber,  
         cart: []
       });
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
    // Use environment variable for JWT secret, same as in authenticate middleware
    const secretKey = process.env.JWT_SECRET || "jnnnfnfnfndsnfsifnfjsbs";
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
const varifyuser = async (req, res) => {
  try {
    // ID validation is already done in authenticate middleware
    const validuser = await User.findById(req.id);
    
    if (!validuser) {
      console.log("User not found in the database");
      return res.status(404).json({ 
        success: false,
        status: 404,
        message: "User not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      status: 200,
      validuser
    });
  } catch (error) {
    console.error("Error in verifying user:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
      error: error.message
    });
  } 
}
 const { isValidObjectId } = require('../utils/validation');

const findUserByID = async (req, res) => {
  try {
    const { id } = req.body;
    
    // Validate ID before querying using our utility function
    if (!isValidObjectId(id)) {
      console.log("Invalid user ID provided:", id);
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID provided" 
      });
    }
    
    // Await the result of findById
    const result = await User.findById(id);
    
    // Check if result is null or not
    if (!result) {
      console.log("User not found in the database");
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    console.log("User found by its ID in the database");
    return res.status(200).json({
      success: true,
      user: result
    });
  } catch (err) {
    console.error("Error occurred during findById user:", err);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: err.message 
    });
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
  
  // Get Cloudinary upload result from middleware
  const image = req.cloudinaryResult ? req.cloudinaryResult.url : null;
  const imageId = req.cloudinaryResult ? req.cloudinaryResult.public_id : null;
  
  const { name, price, author, discription } = req.body;
  const newBook = new Book({ 
    title: name, 
    price, 
    author, 
    description: discription, 
    image, 
    imageId 
  });
  
  try {
    await newBook.save();
    console.log("book is added in db");
    res.status(200).json({
      success: true,
      message: "Book added successfully",
      book: newBook
    });
  } catch (err) {
    console.log("Error occurred during storing book: " + err);
    res.status(500).json({
      success: false,
      message: "Failed to add book",
      error: err.message
    });
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
  try {
    const { id } = req.params;
    console.log(`Fetching book with ID: ${id}`);
    
    // Validate ID before querying using our utility function
    if (!isValidObjectId(id)) {
      console.log("Invalid book ID provided:", id);
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID provided" 
      });
    }
    
    // Use findById with async/await
    const book = await Book.findById(id);
    
    if (!book) {
      console.log("Book not found in the database");
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }
    
    console.log("Book found by its ID in the database");
    return res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    console.error("Error occurred while finding the book by ID:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching book with ID: ${id}`);

    // Validate ID before querying using our utility function
    if (!isValidObjectId(id)) {
      console.log("Invalid book ID provided:", id);
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID provided" 
      });
    }

    // Use findById instead of findOne for better readability
    const book = await Book.findById(id);

    if (!book) {
      console.log("Book not found in the database");
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    console.log("Book found by its ID in the database");
    return res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    console.error("Error occurred while finding the book by ID:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};
const getdata = async (req, res) => {
  try {
    // Use modern async/await syntax instead of callbacks
    const result = await Book.find({});
    
    console.log("Successfully found the data");
    return res.status(200).json({
      success: true,
      books: result
    });
  } catch (error) {
    console.error("Error occurred while finding the data:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
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
    console.log("Finding cart item with userId:", userId, "and bookId:", bookId);
    
    // Validate required fields
    if (!userId || !bookId) {
      return res.status(400).json({ 
        success: false,
        message: 'userId and bookId are required.' 
      });
    }
    
    // Validate userId is a valid ObjectId
    if (!isValidObjectId(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ 
        success: false,
        message: "Invalid userId format" 
      });
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found in the database");
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    // Find cart item by bookId
    const cartItem = user.cart.find(item => item.id === bookId);

    if (!cartItem) {
      console.log("Book not found in the user's cart");
      return res.status(404).json({ 
        success: false,
        message: 'Book not found in the cart.' 
      });
    }
    
    console.log("Cart item found successfully");
    return res.status(200).json({
      success: true,
      cartItem
    });
  } catch (error) {
    console.error('Error in findCartByBookId:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error.',
      error: error.message 
    });
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
    const { userId, bookIdsToDelete, books, partialReturns } = req.body;
    
    console.log("Processing cart deletion for userId:", userId);
    console.log("Books to process:", books);
    console.log("Partial returns to process:", partialReturns);
    
    // Validate required fields
    if (!userId || (!bookIdsToDelete && !partialReturns) || 
        (bookIdsToDelete && !Array.isArray(bookIdsToDelete)) || 
        (partialReturns && !Array.isArray(partialReturns))) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid userId and either bookIdsToDelete or partialReturns array are required.' 
      });
    }
    
    // Validate userId is a valid ObjectId
    if (!isValidObjectId(userId)) {
      console.log("Invalid userId format:", userId);
      return res.status(400).json({ 
        success: false,
        message: "Invalid userId format" 
      });
    }
    
    // Find the user first to get current cart state
    const userBeforeUpdate = await User.findById(userId);
    
    if (!userBeforeUpdate) {
      console.log("User not found in the database");
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Process books for partial or full returns
    const booksToReturn = [];
    const updatedCart = [...userBeforeUpdate.cart]; // Create a copy of the cart
    
    // Process each book in the request
    for (const book of books) {
      // Find the book in the user's cart
      const cartBookIndex = updatedCart.findIndex(item => item.id === book.id);
      
      if (cartBookIndex !== -1) {
        const cartBook = updatedCart[cartBookIndex];
        
        // Prepare book data for return collection
        const returnBookData = {
          id: book.id,
          image: book.image,
          price: book.price,
          dprice: book.dprice || Math.floor(book.price * 0.75), // Calculate discount price if not provided
          quantity: book.aquantity, // Use the quantity being returned
          title: book.title,
          timestamp: new Date()
        };

        booksToReturn.push(returnBookData);
        
        // If returning all copies, mark for removal from cart
        if (book.aquantity >= cartBook.quantity) {
          // Will be removed by the $pull operation below
        } 
        // If returning some copies, update the quantity in the cart
        else {
          updatedCart[cartBookIndex].quantity -= book.aquantity;
        }
      }
    }
    
    // Update the user document
    // First, add the returned books to the return array
    await User.updateOne(
      { _id: userId },
      { $push: { return: { $each: booksToReturn } } }
    );
    
    // Then, remove books that are fully returned
    await User.updateOne(
      { _id: userId },
      { $pull: { cart: { id: { $in: bookIdsToDelete } } } }
    );
    
    // Handle partial returns explicitly
    if (partialReturns && partialReturns.length > 0) {
      for (const partialReturn of partialReturns) {
        // Update the quantity for partially returned books
        await User.updateOne(
          { _id: userId, "cart.id": partialReturn.id },
          { $set: { "cart.$.quantity": partialReturn.remainingQuantity } }
        );
        console.log(`Updated quantity for book ${partialReturn.id} to ${partialReturn.remainingQuantity}`);
      }
    }
    
    // Update quantities for any other partially returned books from updatedCart
    for (const cartItem of updatedCart) {
      if (!bookIdsToDelete.includes(cartItem.id) && cartItem.quantity > 0 && 
          !partialReturns?.some(pr => pr.id === cartItem.id)) {
        await User.updateOne(
          { _id: userId, "cart.id": cartItem.id },
          { $set: { "cart.$.quantity": cartItem.quantity } }
        );
      }
    }
    
    // Get the updated user
    const updatedUser = await User.findById(userId);
    
    // Update return book status (increase book inventory)
    if (books && Array.isArray(books)) {
      await updateReturnBook(books);
    }
    
    console.log("Books successfully processed for return");
    res.status(200).json({ 
      success: true,
      message: 'Books processed for return successfully', 
      data: {
        returnedBooks: booksToReturn,
        updatedCart: updatedUser.cart
      }
    });
  } catch (error) {
    console.error("Error in cartbookdelete:", error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};
const deletcartbook = async (req, res) => {
  try {
    const { userId, partialReturns, bookIdsToDelete, booksToUpdate } = req.body;
    console.log(userId, partialReturns, bookIdsToDelete, booksToUpdate )

    if (!Array.isArray(partialReturns)) {
      return res.status(400).json({ success: false, message: 'Invalid partialReturns data' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Instead of removing books from cart, we'll just update the book quantities
    // Update quantity for all books in the update list
    for (const update of booksToUpdate) {
      const cartItem = user.cart.find(item => item.id === update.id);
      if (cartItem) {
        cartItem.quantity = update.newQuantity;
      }
    }

    // Add to return history
    for (const returnBook of partialReturns) {
      user.return.push({
        ...returnBook,
        dprice: Math.floor(returnBook.price * 0.75),
        quantity: returnBook.aquantity,
        timestamp: new Date()
      });

      // Update Book stock - increase the quantity in the book collection
      await Book.findByIdAndUpdate(returnBook.id, {
        $inc: { quantity: returnBook.aquantity }
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Books returned and cart updated',
      cart: user.cart
    });
  } catch (error) {
    console.error("Error in deletcartbook:", error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};






const updateUserProfile = async (req, res) => {
  try {
    // Get Cloudinary upload result from middleware if a new profile picture was uploaded
    const profilePic = req.cloudinaryResult ? req.cloudinaryResult.url : null;
    const profilePicId = req.cloudinaryResult ? req.cloudinaryResult.public_id : null;
    
    const { userId, fname, lname, phonenumber, year } = req.body;
    
    // Validate userId
    if (!isValidObjectId(userId)) {
      console.log("Invalid user ID provided:", userId);
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID provided" 
      });
    }
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      console.log("User not found in the database");
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    // Prepare update data
    const updateData = {
      fname: fname || user.fname,
      lname: lname || user.lname,
      phonenumber: phonenumber || user.phonenumber,
      year: year || user.year
    };
    
    // Add profile picture data if a new one was uploaded
    if (profilePic) {
      // If user already has a profile picture, delete the old one from Cloudinary
      if (user.profilePicId) {
        await deleteFromCloudinary(user.profilePicId);
      }
      
      updateData.profilePic = profilePic;
      updateData.profilePicId = profilePicId;
    }
    
    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );
    
    console.log("User profile updated successfully");
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
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
  deletcartbook,
  updateUserProfile
};
