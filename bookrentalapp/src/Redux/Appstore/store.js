import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './Reducer';

const store = configureStore({
  reducer: rootReducer,
});

export default store;