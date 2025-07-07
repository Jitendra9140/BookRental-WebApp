import React, { useEffect } from 'react';

const InvoiceDetail = ({ invoice, onBack, onDownload, formatInvoiceDate }) => {
  useEffect(() => {
    console.log("Invoice in InvoiceDetail:", invoice);
    if (invoice && invoice.items) {
      console.log("Invoice items:", invoice.items);
    }
  }, [invoice]);
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
                <span>Name:</span>
                {invoice.userName}
              </div>
              <div className="customer-email">
                <span>Email:</span>
                {invoice.userEmail}
              </div>
              {invoice.userPhone && (
                <div className="customer-phone">
                  <span>Phone:</span>
                  {invoice.userPhone}
                </div>
              )}
            </div>
          </div>
          
          <div className="invoice-detail-items">
            <h3>Items</h3>
            {invoice.items && invoice.items.length > 0 ? (
              <>
                <div className="responsive-table-container">
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
                        <tr key={index} className="book-item-row">
                          <td data-label="Item">{item.title}</td>
                          <td data-label="Book ID">{item.bookId || item._id}</td>
                          <td data-label="Quantity">{item.quantity}</td>
                          <td data-label="Price">₹{Math.round(item.price*0.75)}</td>
                          <td data-label="Total">₹{Math.round(item.price * item.quantity*0.75)}</td>
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
                
                {/* Mobile card view for book items */}
                <div className="book-items-mobile">
                  {invoice.items.map((item, index) => (
                    <div key={index} className="book-card">
                      <div className="book-card-header">
                        <div className="book-card-title">{item.title}</div>
                      </div>
                      <div className="book-card-content">
                        <div className="book-card-row">
                          <div className="book-card-label">Book ID</div>
                          <div className="book-card-value">{item.bookId || item._id}</div>
                        </div>
                        <div className="book-card-row">
                          <div className="book-card-label">Quantity</div>
                          <div className="book-card-value">{item.quantity}</div>
                        </div>
                        <div className="book-card-row">
                          <div className="book-card-label">Price</div>
                          <div className="book-card-value">₹{Math.round(item.price*0.75)}</div>
                        </div>
                        <div className="book-card-row">
                          <div className="book-card-label">Total</div>
                          <div className="book-card-value">₹{Math.round(item.price * item.quantity*0.75)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="book-card-total">
                    <div className="book-card-label">Total Amount</div>
                    <div className="book-card-value">₹{invoice.totalAmount}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-items-message">
                <p>No items found in this invoice.</p>
              </div>
            )}
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