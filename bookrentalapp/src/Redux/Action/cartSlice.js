import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: [],
};
const cartSlice = createSlice({
  name: "cartSlice",
  initialState, // Use 'initialState' here
  reducers: {
    addToCart: (state, action) => {
      // Check if the item is already in the cart
      const existingItem = state.carts.find((item) => item._id === action.payload._id);

      if (existingItem) {
        // If the item is already in the cart, increase its quantity
        existingItem.quantity += 1;
      } else {
        // If the item is not in the cart, add it with a quantity of 1
        action.payload.quantity = 1;
        state.carts.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      // Find the index of the item to remove by its _id
      const indexToRemove = state.carts.findIndex(
        (item) => item._id === action.payload._id
      );
      // Remove the item from the cart if found
      if (indexToRemove !== -1) {
        state.carts.splice(indexToRemove, 1);
      }
    },
    updateCartItem: (state, action) => {
      const existingItem = state.carts.find((item) => item._id === action.payload._id);

      if (existingItem) {
        // Update the item's quantity
        existingItem.quantity = action.payload.quantity;
      }
    },
  },
});

export const { addToCart , removeFromCart,updateCartItem} = cartSlice.actions;
export default cartSlice.reducer;
