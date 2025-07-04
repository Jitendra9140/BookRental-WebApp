import React from 'react';

const AvailabilityIndicator = ({ available, quantity }) => {
  // Determine availability status and styling
  const getStatus = () => {
    if (!available) {
      return {
        text: 'Out of Stock',
        dotColor: 'bg-red-500',
        textColor: 'text-red-500'
      };
    }
    
    if (quantity === undefined || quantity === null) {
      return {
        text: 'Available',
        dotColor: 'bg-green-500',
        textColor: 'text-green-500'
      };
    }
    
    if (quantity <= 3) {
      return {
        text: `Low Stock (${quantity})`,
        dotColor: 'bg-yellow-500',
        textColor: 'text-yellow-600'
      };
    }
    
    return {
      text: 'In Stock',
      dotColor: 'bg-green-500',
      textColor: 'text-green-500'
    };
  };
  
  const status = getStatus();
  
  return (
    <div className="availability-indicator flex items-center">
      <span className={`inline-block w-2 h-2 rounded-full ${status.dotColor} mr-1 animate-pulse`}></span>
      <span className={`text-xs font-medium ${status.textColor}`}>{status.text}</span>
    </div>
  );
};

export default AvailabilityIndicator;