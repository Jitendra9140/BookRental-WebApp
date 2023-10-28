import React ,{useContext, useEffect, useState }from 'react'
import '../Style/invoice.css'
import DataContextProvider ,{DataContext} from './Resetconteexr';
import { findUserByID } from '../Api/user';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from './Navbar';
export default function Invoce() {
  const { bookdel}= useContext(DataContext);
   const [user,setUser]=useState({
   })
   const id=window.localStorage.getItem("Id")
   console.log(id);
   console.log(bookdel);
   const getdetail=async()=>{
      const response= await findUserByID(id);
      console.log(response.data)
      setUser(response.data)
   }
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
    // pdf.setFillColor(255, 255, 255); // Set background color to white
    // pdf.rect(0, 0, 210, 297, 'F');
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
            <h2>Michael Truong</h2>
            <p>
              hello@michaeltruong.ca <br />
              289-335-6503
            </p>
          </div>
          <div className="title">
            <h1>Invoice #1069</h1>
            <p>
              Issued: May 27, 2015 <br />
              Payment Due: June 27, 2015
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
            <h2>Project Description</h2>
            <p>
              Proin cursus, dui non tincidunt elementum, tortor ex feugiat enim,
              at elementum enim quam vel purus. Curabitur semper malesuada urna
              ut suscipit.
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
                  <p className="itemtext">{data.dprice}</p>
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
                  <h2>Total</h2>
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
              <strong>Thank you for your business!</strong> Payment is
              expected within 31 days; please process this invoice within that
              time. There will be a 5% interest charge per month on late invoices.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
