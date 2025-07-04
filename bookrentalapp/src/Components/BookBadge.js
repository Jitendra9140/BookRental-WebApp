import React from 'react';

const BookBadge = ({ type, text }) => {
  // Define badge styles based on type
  const getBadgeStyles = () => {
    switch (type) {
      case 'bestseller':
        return 'bg-yellow-500 text-white';
      case 'new':
        return 'bg-green-500 text-white';
      case 'sale':
        return 'bg-red-500 text-white';
      case 'limited':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`book-badge absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold transform rotate-3 z-10 ${getBadgeStyles()}`}>
      {text}
    </div>
  );
};

export default BookBadge;