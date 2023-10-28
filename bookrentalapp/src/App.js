import React, { useState, createContext } from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Products from './Pages/Products';
import Addbook from './Pages/Addbook';
import Cart from './Pages/Cart';
import Book from './Pages/Book';
import Resetpass from './Pages/Resetpass';
import Otpvarification from './Pages/Otpvarification';
import Confirmpass from './Pages/Confirmpass';
import Home from './Pages/Home';
import Paymentsuccess from './Pages/Paymentsuccess';
import DataContextProvider from './Pages/Resetconteexr';
import BuyHistory from './Pages/BuyHistory';
import Return from './Pages/Return';
import Invoice from './Pages/Invoice';
function App() {
  return (
    <div className="App">
      <DataContextProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Signup/>}/>
          <Route path="/reset-password" element={<Resetpass/>}/>
          <Route path="/otpvarify" element={<Otpvarification/>}/>
          <Route path="/confirmpass" element={<Confirmpass/>}/>
          <Route path="/addbook" element={<Addbook/>}/>
          <Route path="/invoice" element={<Invoice/>}/>
          <Route path="/:id/products" element={<Products/>}/>
          <Route path="/cart/:id" element={<Cart/>}/>
          <Route path="/:id/book/:bid"  element={<Book/>}/>
          <Route path="/buyHistory"  element={<BuyHistory/>}/>
          <Route path="/Return"  element={<Return/>}/>
          <Route path="/paymentsuccess" element={<Paymentsuccess/>}/>
        </Routes>
      </Router>
      </DataContextProvider>
     
    </div>
  );
}
export default App;

