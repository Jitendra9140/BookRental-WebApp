import React from 'react';
import DownloadButton from './DownloadButton';

const CurrentReturn = ({ returnedBooks, onDownload }) => {
  return (
    <div className="flex-column-container">
      <div className="flex-header">
        <div className="col-book">Book</div>
        <div className="col-title">Title</div>
        <div className="col-id">Book ID</div>
        <div className="col-date">Return Date</div>
        <div className="col-quantity">Quantity</div>
        <div className="col-price">Price</div>
        <div className="col-return-amount">Return Amount</div>
      </div>
      
      {returnedBooks.map((data, index) => {
        const returnDate = new Date(data.timestamp).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short'
        });
        
        return (
          <div key={index} className="flex-row">
            <div className="col-book">
              <img 
                src={data.image} 
                alt={data.title}
                className="book-image"
                onError={(e) => e.target.src = 'https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'}
              />
            </div>
            <div className="col-title">{data.title}</div>
            <div className="col-id">{data.id}</div>
            <div className="col-date">{returnDate}</div>
            <div className="col-quantity">{data.aquantity || 1}</div>
            <div className="col-price">₹{data.price}</div>
            <div className="col-return-amount">₹{Math.floor(data.price*50/100) * (data.aquantity || 1)}</div>
          </div>
        );
      })}
      
      <div className="flex-footer">
        <div className="text-align-right">Total Return Amount:</div>
        <div className="col-return-amount">₹
          {returnedBooks.reduce(
            (total, data) => total + Math.floor(data.price * 50 / 100) * (data.aquantity || 1),
            0
          )}
        </div>
      </div>
      
    </div>
  );
};

export default CurrentReturn;