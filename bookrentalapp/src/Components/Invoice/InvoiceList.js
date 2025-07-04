import React from 'react';

const InvoiceList = ({ 
  activeInvoiceType, 
  setActiveInvoiceType, 
  filteredInvoices, 
  handleInvoiceClick,
  formatInvoiceDate 
}) => {
  return (
    <div className="invoices-container">
      <div className="invoice-filters">
        <button 
          className={`filter-btn ${activeInvoiceType === null ? 'active' : ''}`}
          onClick={() => setActiveInvoiceType(null)}
        >
          All
        </button>
        <button 
          className={`filter-btn ${activeInvoiceType === 'purchase' ? 'active' : ''}`}
          onClick={() => setActiveInvoiceType('purchase')}
        >
          Purchase
        </button>
        <button 
          className={`filter-btn ${activeInvoiceType === 'return' ? 'active' : ''}`}
          onClick={() => setActiveInvoiceType('return')}
        >
          Return
        </button>
      </div>
      
      <div className="invoice-list">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map(invoice => (
            <div 
              key={invoice._id} 
              className={`invoice-card ${invoice.invoiceType === 'purchase' ? 'purchase' : 'return'}`}
              onClick={() => handleInvoiceClick(invoice._id)}
            >
              <div className="invoice-card-header">
                <span className="invoice-number">{invoice.invoiceNumber}</span>
                <span className="invoice-date">{formatInvoiceDate(invoice.timestamp)}</span>
              </div>
              <div className="invoice-card-body">
                <div className="invoice-type">{invoice.invoiceType === 'purchase' ? 'Purchase' : 'Return'}</div>
                <div className="invoice-items">{invoice.items.length} items</div>
                <div className="invoice-amount">₹{Math.round(invoice.totalAmount*0.75)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-invoices" style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', margin: '20px 0' }}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/5445/5445197.png" 
              alt="No data" 
              style={{ width: '80px', height: '80px', marginBottom: '15px', opacity: '0.6' }}
            />
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '5px' }}>No invoices found</p>
            <p style={{ fontSize: '14px', color: '#9ca3af' }}>Invoices will appear here once you make purchases or returns</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;