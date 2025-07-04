import React from 'react';

const BookRibbon = ({ position = 'top-right', text, color = 'red' }) => {
  // Define color classes
  const getColorClass = () => {
    switch (color) {
      case 'red': return 'bg-red-600';
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-600';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-600';
      default: return 'bg-red-600';
    }
  };

  // Define position classes
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0 transform -translate-x-8 translate-y-2 rotate-[-45deg] origin-top-right';
      case 'top-right':
        return 'top-0 right-0 transform translate-x-8 translate-y-2 rotate-[45deg] origin-top-left';
      case 'bottom-left':
        return 'bottom-0 left-0 transform -translate-x-8 -translate-y-2 rotate-[45deg] origin-bottom-right';
      case 'bottom-right':
        return 'bottom-0 right-0 transform translate-x-8 -translate-y-2 rotate-[-45deg] origin-bottom-left';
      default:
        return 'top-0 right-0 transform translate-x-8 translate-y-2 rotate-[45deg] origin-top-left';
    }
  };

  return (
    <div className={`book-ribbon absolute overflow-hidden w-28 h-28 ${getPositionClass()}`}>
      <div className={`${getColorClass()} text-white font-bold py-1 text-center text-xs shadow-lg w-40`}>
        {text}
      </div>
    </div>
  );
};

export default BookRibbon;