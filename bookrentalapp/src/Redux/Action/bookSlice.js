import { createSlice } from "@reduxjs/toolkit";

const bookcartInitialState = {
    books: [],
  };
  
  const bookcartSlice = createSlice({
    name: "bookcartSlice",
    initialState: bookcartInitialState, // Use a different initial state here
    reducers: {
        addToBookCart: (state, action) => {
            const { _id } = action.payload;
            // Check if the book already exists in the bookcart
            const existingBook = state.books.find((book) => book._id === _id);
            if (!existingBook) {
              // action.payload.quantity-=1;
               action.payload.aquantity=1;
              state.books.push(action.payload);
            }
            else {
             console.log('book is already existing');
            }
          },
      removeFromBookCart: (state, action) => {
        // Find the index of the item to remove by its _id
        const { _id} = action.payload;
        // Check if the book already exists in the bookcart
        const existingBook = state.books.find((book) => book._id === _id);
        if (existingBook!== -1) {

          state.books.splice(existingBook, 1);
        }
        else {
          console.log('Book does not exist in the cart');
        }
      },
      updateBookCartItem: (state, action) => {
        // You can follow a similar pattern as updateCartItem in cartSlice
        const existingItem = state.books.find((item) => item._id === action.payload._id);
        if (existingItem) {
          existingItem.aquantity = action.payload.aquantity;
        }
      },
      clearBookCart: (state) => {
        state.books = []; // Clear all books from the cart
      },
    },
  });
  
  export const { addToBookCart, removeFromBookCart, updateBookCartItem ,clearBookCart} = bookcartSlice.actions;
  export default bookcartSlice.reducer;