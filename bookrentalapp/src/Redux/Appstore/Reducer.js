import { combineReducers } from 'redux';
import cartReducer from '../Action/cartSlice';
import bookcartReducer from '../Action/bookSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  bookcart: bookcartReducer,
});

export default rootReducer;