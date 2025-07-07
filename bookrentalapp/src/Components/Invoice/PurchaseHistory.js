import React from 'react';
import DownloadButton from './DownloadButton';

const PurchaseHistory = ({ purchaseHistory, onDownload }) => {
  return (
    <div className="flex-column-container">
      {/* Desktop header - hidden on mobile */}
      <div className="flex-header">
        <div className="col-book">Book</div>
        <div className="col-title">Title</div>
        <div className="col-id">Book ID</div>
        <div className="col-date">Purchase Date</div>
        <div className="col-valid-until">Valid Until</div>
        <div className="col-quantity">Quantity</div>
        <div className="col-price">Price</div>
        <div className="col-sell-price">Sell Price</div>
      </div>
      
      {purchaseHistory.map((data, index) => {
        const purchaseDate = new Date(data.timestamp).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short'
        });
        
        // Calculate valid until date (1 year from purchase)
        const purchaseDateObj = new Date(data.timestamp);
        const validUntil = new Date(purchaseDateObj);
        validUntil.setFullYear(validUntil.getFullYear() + 1);
        const validUntilStr = validUntil.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium'
        });
        
        return (
          <div key={index} className="flex-row">
            {/* Book image - shown at top of card on mobile */}
            <div className="col-book">
              <img 
                src={data.image} 
                alt={data.title}
                className="book-image"
                onError={(e) => e.target.src = 'https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'}
              />
            </div>
            
            {/* Book details - shown as left-aligned rows on mobile */}
            <div className="col-title" data-label="Title">{data.title}</div>
            <div className="col-id" data-label="Book ID">{data.id}</div>
            <div className="col-date" data-label="Purchase Date">{purchaseDate}</div>
            <div className="col-valid-until" data-label="Valid Until">{validUntilStr}</div>
            <div className="col-quantity" data-label="Quantity">{data.quantity || 1}</div>
            <div className="col-price" data-label="Price">₹{data.price}</div>
            <div className="col-sell-price" data-label="Sell Price">₹{Math.round(data.price*0.75)}</div>
          </div>
        );
      })}
      
      <div className="flex-footer">
        <div className="text-align-right">Total Purchase Amount:</div>
        <div className="col-price">₹
          {purchaseHistory.reduce(
            (total, data) => total + data.price * (data.quantity || 1),
            0
          )}
        </div>
      </div>

    </div>
  );
};

export default PurchaseHistory;