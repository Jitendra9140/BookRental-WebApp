import React ,{useContext, useEffect, useState }from 'react'
import '../Style/invoice.css'
import DataContextProvider ,{DataContext} from './Resetconteexr';
import { findUserByID } from '../Api/user';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from './Navbar';
export default function Invoce() {
   const [user,setUser]=useState({
   })
   const id=window.localStorage.getItem("Id")
   console.log(id);
   const getdetail=async()=>{
      const response= await findUserByID(id);
      console.log(response.data.return)
      setUser(response.data)
   }
   const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
};
   const date=new Date;
   const dateCurrent=formatDate(date);
  
   const captureContent = async () => {
    document.getElementById('dbtn').style.display = 'none';
    const content = document.getElementById('invoice'); // Replace 'capture-div' with the ID of your content
    const canvas = await html2canvas(content, { useCORS: true, scrollY: 0 });
    const image = canvas.toDataURL('image/png');
    document.getElementById('dbtn').style.display = 'block';
    return image;
  };
  const pdfWidth = 210; // Width in millimeters (mm)
const pdfHeight = 267; 
  const convertToPDF = async () => {
    const image = await captureContent();
   const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
    pdf.addImage(image, 'PNG', 10, 10, 190, 0);
    pdf.save('invoice.pdf');
  };
  
   useEffect(()=>{
    getdetail()
   },[])
  return (
    <>
    <div className="sticky absolute top-0 left-0 z-20 shadow-md">
        <Navbar/>
        </div>
    <div id="invoiceholder">
   
      <div id="headerimage"></div>
      <div id="invoice" className="effect2">
        <div id="invoice-top">
          <div className="logo"></div>
          <div className="info">
            <h2>Bharati Vidyapeeth Rent Book</h2>
            <p>
              bhartividyapeethcollege@gmail.com <br />
              289-335-6503
            </p>
          </div>
          <div className="title">
            <h1>Invoice #1069</h1>
            <p>
              Issued: {dateCurrent}<br />
            </p>
          </div>
        </div>
        <div id="invoice-mid">
          <div className="clientlogo">
            <img src={`http://localhost:8000/${user.profilePic}`} alt="" />
          </div>
          <div className="info">
            <h2>{user.fname}</h2>
            <p>
             {user.email} <br />
             {user.phonenumber}
            </p>
          </div>

          <div id="project">
            <h2>Importent Note</h2>
            <p>
            You can collect your money from the office by presenting this receipt. Additionally, please return the book associated with this receipt. Ensure that the book is in the same condition as when it was issued.
            </p>
          </div>
        </div>

        <div id="invoice-bot">
          <div id="table">
            <table>
              
              <tr className="tabletitle">
                <td className="item">
                  <h2>Item Description</h2>
                </td>
                <td className="Hours">
                  <h2>Acutal Rate</h2>
                </td>
                <td className="Rate">
                  <h2>discounted Rate</h2>
                </td>
                <td className="subtotal">
                  <h2>After Retrun</h2>
                </td>
              </tr>
              {user.return? user.return.map((data)=>(
              <tr className="service">
                <td className="tableitem">
                  <p className="itemtext">{data.title}</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">{data.price}</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">{data.price*75/100}</p>
                </td>
                <td className="tableitem">
                  <p className="itemtext">{data.price*50/100}</p>
                </td>
              </tr>
               )
              ):"no iteam"
              }
            
              <tr className="tabletitle">
                <td></td>
                <td></td>
                <td className="Rate">
                </td>
                <td className="payment">
                {user.cart ? (
    <p className="itemtext">
      Total: ₹
      {user.return.reduce((total, data) => total + data.price * 0.5, 0).toFixed(2)}
    </p>
  ) : (
    "No items in the cart"
  )}
</td>
         
              </tr>
            </table>
          </div>

  
          <button className='dbtn' id='dbtn' onClick={convertToPDF}>Download Invoice</button>
          <div id="legalcopy">
            <p className="legal">
              <strong>Thank you for visiting us!</strong> 
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
