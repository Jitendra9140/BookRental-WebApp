import React from 'react';

const EmptyState = ({ message = 'No items found for this category', subMessage = 'Items will appear here once you make purchases or returns', imageSrc = 'https://cdn-icons-png.flaticon.com/512/5445/5445197.png' }) => {
  return (
    <div className="empty-state">
      <img 
        src={imageSrc} 
        alt="No data" 
      />
      <p className="message">{message}</p>
      <p className="sub-message">{subMessage}</p>
    </div>
  );
};

export default EmptyState;