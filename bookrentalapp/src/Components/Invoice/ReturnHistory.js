import React from 'react';
import DownloadButton from './DownloadButton';

const ReturnHistory = ({ returnHistory, onDownload }) => {
  return (
    <div className="flex-column-container">
      {/* Desktop header - hidden on mobile */}
      <div className="flex-header">
        <div className="col-book">Book</div>
        <div className="col-title">Title</div>
        <div className="col-id">Book ID</div>
        <div className="col-date">Return Date</div>
        <div className="col-quantity">Quantity</div>
        <div className="col-price">Price</div>
        <div className="col-sell-price">Sell Price</div>
        <div className="col-return-amount">Return Amount</div>
      </div>
      
      {returnHistory.map((data, index) => {
        const returnDate = new Date(data.timestamp).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short'
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
            <div className="col-date" data-label="Return Date">{returnDate}</div>
            <div className="col-quantity" data-label="Quantity">{data.quantity || 1}</div>
            <div className="col-price" data-label="Price">₹{data.price}</div>
            <div className="col-sell-price" data-label="Sell Price">₹{Math.round(data.price*0.75)}</div>
            <div className="col-return-amount" data-label="Return Amount">₹{Math.floor(data.price*50/100) * (data.quantity || 1)}</div>
          </div>
        );
      })}
      
      <div className="flex-footer">
        <div className="text-align-right">Total Return Amount:</div>
        <div className="col-return-amount">₹
          {returnHistory.reduce(
            (total, data) => total + Math.floor(data.price * 50 / 100) * (data.quantity || 1),
            0
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ReturnHistory;