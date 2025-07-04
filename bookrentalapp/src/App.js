import React, { useState, createContext } from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Register from './Pages/auth/Register';
import Login from './Pages/auth/Login';
import BookList from './Pages/book/BookList';
import AddBook from './Pages/book/AddBook';
import Cart from './Pages/user/Cart';
import BookDetails from './Pages/book/BookDetails';
import ResetPassword from './Pages/auth/ResetPassword';
import OtpVerification from './Pages/auth/OtpVerification';
import ConfirmPassword from './Pages/auth/ConfirmPassword';
import Home from './Pages/Home';
import PaymentSuccess from './Pages/user/PaymentSuccess';
import DataContextProvider from './contexts/ResetContext';
import PurchaseHistory from './Pages/user/PurchaseHistory';
import Return from './Pages/user/Return';
import Invoice from './Pages/user/Invoice';
import Profile from './Pages/user/Profile';
function App() {
  return (
    <div className="App">
      <DataContextProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Login/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/otpvarify" element={<OtpVerification/>}/>
          <Route path="/confirmpass" element={<ConfirmPassword/>}/>
          <Route path="/addbook" element={<AddBook/>}/>
          <Route path="/invoice" element={<Invoice/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/:id/products" element={<BookList/>}/>
          <Route path="/cart/:id" element={<Cart/>}/>
          <Route path="/:id/book/:bid"  element={<BookDetails/>}/>
          <Route path="/buyHistory"  element={<PurchaseHistory/>}/>
          <Route path="/Return"  element={<Return/>}/>
          <Route path="/paymentsuccess" element={<PaymentSuccess/>}/>
        </Routes>
      </Router>
      </DataContextProvider>
     
    </div>
  );
}
export default App;

