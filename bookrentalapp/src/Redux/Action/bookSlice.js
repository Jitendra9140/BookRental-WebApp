import { createSlice } from "@reduxjs/toolkit";

const bookcartInitialState = {
    books: [],
  };
  
  const bookcartSlice = createSlice({
    name: "bookcartSlice",
    initialState: bookcartInitialState, // Use a different initial state here
    reducers: {
        addToBookCart: (state, action) => {
            const { _id, title, price, image,id } = action.payload;
            
            // Check if the book already exists in the bookcart
            const existingBook = state.books.find((book) => book._id === _id);
          
            if (!existingBook) {
              // If the book is not in the bookcart, add it
              state.books.push({
                id,
                _id,
                title,
                price,
                image,
              });
            }
          },
      removeFromBookCart: (state, action) => {
        // Add logic to handle removing books from the book cart
        // You can follow a similar pattern as removeFromCart in cartSlice
      },
      updateBookCartItem: (state, action) => {
        // Add logic to handle updating book cart items
        // You can follow a similar pattern as updateCartItem in cartSlice
      },
    },
  });
  
  export const { addToBookCart, removeFromBookCart, updateBookCartItem } = bookcartSlice.actions;
  export default bookcartSlice.reducer;