import React, { useEffect, useState, useContext } from 'react'
import '../../Style/invoice.css'
import '../../Style/scoped-styles.css'
import { getUserInvoices } from '../../Api/invoice';
import Navbar from '../../Components/common/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../contexts/UserContext';

// Import modular components
import {
  InvoiceHeader,  CurrentReturn,  ReturnHistory,  PurchaseHistory,  InvoiceList,
  InvoiceDetail,  EmptyState,  LoadingState,  formatDate,  formatInvoiceDate,  captureContent,
  convertToPDF,  generateInvoicePDF} from '../../Components/Invoice';
export default function Invoice() {
   const { user, loading: userLoading } = useContext(UserContext);
   const [returnedBooks, setReturnedBooks] = useState([])
   const [loading, setLoading] = useState(true)
   const [activeTab, setActiveTab] = useState('current')
   const [allReturns, setAllReturns] = useState([])
   const [allPurchases, setAllPurchases] = useState([])
   const [invoices, setInvoices] = useState([])
   const [purchaseInvoices, setPurchaseInvoices] = useState([])
   const [returnInvoices, setReturnInvoices] = useState([])
   const [selectedInvoice, setSelectedInvoice] = useState(null)
   const [activeInvoiceType, setActiveInvoiceType] = useState(null)
   const id = user ? user._id : window.localStorage.getItem("Id")
   
   const getdetail = async () => {
      try {
         setLoading(true);
         
         if (user) {
            // Process all historical returns
            if (user.return && user.return.length > 0) {
               setAllReturns(user.return);
            }
            
            // Process all purchases (cart items)
            if (user.cart && user.cart.length > 0) {
               setAllPurchases(user.cart);
            }
         }
         
         // We no longer need to get returned books from localStorage
         // as the invoice is created directly in the Return.js component
         // This prevents double invoice generation
         
         // Fetch the most recent return invoice to display as current return
         try {
            const recentInvoices = await getUserInvoices(id);
            if (recentInvoices && recentInvoices.data && recentInvoices.data.invoices) {
               const returnInvs = recentInvoices.data.invoices.filter(inv => inv.invoiceType === 'return');
               if (returnInvs.length > 0) {
                  // Get the most recent return invoice
                  const mostRecentReturn = returnInvs.sort((a, b) => 
                     new Date(b.timestamp) - new Date(a.timestamp))[0];
                  
                  // Set the items from this invoice as the current return
                  setReturnedBooks(mostRecentReturn.items.map(item => ({
                     id: item.bookId,
                     title: item.title,
                     image: item.image,
                     price: item.price,
                     aquantity: item.quantity,
                     timestamp: mostRecentReturn.timestamp
                  })));
               }
            }
         } catch (error) {
            console.error("Error fetching recent return invoice:", error);
         }
         
         // Fetch all invoices for the user
         fetchUserInvoices();
      } catch (error) {
         console.error("Error fetching user details:", error);
         toast.error("Error loading invoice data", { position: toast.POSITION.TOP_RIGHT });
      } finally {
         setLoading(false);
      }
   }
   
   // Fetch all invoices for the user
   const fetchUserInvoices = async () => {
      try {
         const response = await getUserInvoices(id);
         if (response && response.data && response.data.invoices) {
            const allInvoices = response.data.invoices;
            setInvoices(allInvoices);
            
            // Separate purchase and return invoices
            setPurchaseInvoices(allInvoices.filter(invoice => invoice.invoiceType === 'purchase'));
            setReturnInvoices(allInvoices.filter(invoice => invoice.invoiceType === 'return'));
         }
      } catch (error) {
         console.error("Error fetching user invoices:", error);
         toast.error("Error loading invoices", { position: toast.POSITION.TOP_RIGHT });
      }
   }
   // Use the current date
   const date = new Date();
   const dateCurrent = formatDate(date);
  
   // Use the utility functions for PDF generation
   const handleConvertToPDF = () => {
     convertToPDF(activeTab);
   };
   
   // Wrapper for invoice PDF generation
   const handleGenerateInvoicePDF = (invoice) => {
     generateInvoicePDF(invoice, formatInvoiceDate);
   };
  
   useEffect(()=>{
      if (user) {
         getdetail();
      }
   },[user])
   
   useEffect(() => {
      setLoading(userLoading);
   }, [userLoading])
   
   // Handle invoice click to view details
   const handleInvoiceClick = async (invoiceId) => {
      try {
         // Find the invoice in the existing invoices array
         const invoice = invoices.find(inv => inv._id === invoiceId);
         if (invoice) {
            console.log("Selected invoice:", invoice);
            setSelectedInvoice(invoice);
            setActiveTab('invoice-detail');
         }
      } catch (error) {
         console.error("Error fetching invoice details:", error);
         toast.error("Error loading invoice details", { position: toast.POSITION.TOP_RIGHT });
      }
   }
   
   // Get filtered invoices based on active type
   const filteredInvoices = activeInvoiceType 
      ? invoices.filter(invoice => invoice.invoiceType === activeInvoiceType)
      : invoices;
      
  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Add CSS for PDF generation
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    styleElement.id = 'invoice-pdf-styles';
    
    // Add CSS rules for PDF generation
    styleElement.innerHTML = `
      .generating-pdf .date-header td {
        background-color: #f3f4f6 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .generating-pdf .date-subtotal td {
        background-color: #f9fafb !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      @media print {
        .invoice-container {
          padding: 20px;
          max-width: 100%;
        }
        
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .invoice-table th,
        .invoice-table td {
          border: 1px solid #e5e7eb;
          padding: 8px;
        }
      }
    `;
    
    // Append the style element to the document head
    document.head.appendChild(styleElement);
    
    // Clean up function to remove the style element when component unmounts
    return () => {
      const element = document.getElementById('invoice-pdf-styles');
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, []);

  return (
    <>
    <div className="sticky absolute top-0 left-0 z-20 shadow-md">
        <Navbar/>
    </div>
    <div className="invoice-page">
      <InvoiceHeader 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
      />
    {activeTab !== 'invoices' && activeTab !== 'invoice-detail' ? (
    <div className="history-container">
      
              
              {loading ? (
                <LoadingState />
              ) : activeTab === 'current' && returnedBooks && returnedBooks.length > 0 ? (
                <CurrentReturn 
                  returnedBooks={returnedBooks} 
                  onDownload={() => handleConvertToPDF('current-return')} 
                />
              ) : activeTab === 'history' && allReturns && allReturns.length > 0 ? (
                <ReturnHistory 
                  returnHistory={allReturns} 
                  onDownload={() => handleConvertToPDF('return-history')} 
                />
              ) : activeTab === 'purchases' && allPurchases && allPurchases.length > 0 ? (
                <PurchaseHistory 
                  purchaseHistory={allPurchases} 
                  onDownload={() => handleConvertToPDF('purchase-history')} 
                />
              ) : (
                <EmptyState 
                  message="No items found for this category" 
                  subMessage="Items will appear here once you make purchases or returns" 
                  imageSrc="https://cdn-icons-png.flaticon.com/512/5445/5445197.png" 
                />
              )}
            
              {/* No additional elements needed */}
    </div>
    ) : activeTab === 'invoices' ? (
      <InvoiceList 
        filteredInvoices={filteredInvoices} 
        activeInvoiceType={activeInvoiceType} 
        setActiveInvoiceType={setActiveInvoiceType} 
        handleInvoiceClick={handleInvoiceClick} 
        formatInvoiceDate={formatInvoiceDate} 
      />
    ) : activeTab === 'invoice-detail' && selectedInvoice ? (
      <InvoiceDetail 
        invoice={selectedInvoice} 
        onBack={() => handleTabChange('invoices')} 
        onDownload={() => handleGenerateInvoicePDF(selectedInvoice)} 
        formatInvoiceDate={formatInvoiceDate} 
      />
    ) : null}
    <ToastContainer />
    </div>
    </>
  )
}
