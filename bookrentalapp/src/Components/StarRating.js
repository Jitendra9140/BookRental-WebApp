import React from 'react';

const StarRating = ({ rating, maxRating = 5 }) => {
  // Convert rating to a number between 0 and maxRating
  const normalizedRating = Math.min(Math.max(0, parseFloat(rating) || 0), maxRating);
  
  // Calculate the percentage filled
  const filledPercentage = (normalizedRating / maxRating) * 100;
  
  return (
    <div className="star-rating flex items-center">
      <div className="relative inline-block">
        {/* Background stars (empty) */}
        <div className="text-gray-300">
          {[...Array(maxRating)].map((_, i) => (
            <span key={`empty-${i}`} className="text-lg">★</span>
          ))}
        </div>
        
        {/* Foreground stars (filled) - overlay with width based on rating */}
        <div 
          className="text-yellow-400 absolute top-0 left-0 overflow-hidden whitespace-nowrap"
          style={{ width: `${filledPercentage}%` }}
        >
          {[...Array(maxRating)].map((_, i) => (
            <span key={`filled-${i}`} className="text-lg">★</span>
          ))}
        </div>
      </div>
      
      {/* Numeric rating */}
      <span className="ml-1 text-sm text-gray-600">
        {normalizedRating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;