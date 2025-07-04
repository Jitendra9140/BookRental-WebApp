import React from 'react';

const InvoiceDetail = ({ invoice, onBack, onDownload, formatInvoiceDate }) => {
  return (
    <div className="invoice-detail-container">
      <div className="invoice-content">
        <div className="invoice-detail">
          <div className="invoice-detail-header">
            <h2>
              {invoice.invoiceType === 'purchase' ? 'Purchase' : 'Return'} Invoice
            </h2>
            <div className="invoice-detail-meta">
              <div className="invoice-number">
                <span>Invoice #</span> {invoice.invoiceNumber}
              </div>
              <div className="invoice-date">
                <span>Date:</span> {formatInvoiceDate(invoice.timestamp)}
              </div>
            </div>
          </div>
          
          <div className="invoice-detail-customer">
            <h3>Customer Details</h3>
            <div className="customer-info">
              <div className="customer-name">
                <span>Name</span>
                {invoice.userName}
              </div>
              <div className="customer-email">
                <span>Email</span>
                {invoice.userEmail}
              </div>
              {invoice.userPhone && (
                <div className="customer-phone">
                  <span>Phone</span>
                  {invoice.userPhone}
                </div>
              )}
            </div>
          </div>
          
          <div className="invoice-detail-items">
            <h3>Items</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Book ID</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item._id}</td>
                    <td>{item.quantity}</td>
                    <td>₹{Math.round(item.price*0.75)}</td>
                    <td>₹{Math.round(item.price * item.quantity*0.75)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">Total Amount:</td>
                  <td>₹{invoice.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="invoice-detail-actions">
            <button 
              className="back-btn"
              onClick={onBack}
            >
              <span>←</span> Back to Invoices
            </button>
            <button 
              className="download-btn"
              onClick={onDownload}
            >
              <span>↓</span> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;