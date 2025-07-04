import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookBadge from './BookBadge';
import StarRating from './StarRating';
import BookRibbon from './BookRibbon';
import AvailabilityIndicator from './AvailabilityIndicator';

const BookCard = ({ book, addInCart }) => {
  const navigate = useNavigate();
  const dummyImageUrl = 'https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg';

  // Function to handle image error
  const handleImageError = (event) => {
    event.target.src = dummyImageUrl;
  };

  // Function to navigate to book details page
  const handleViewDetails = () => {
    navigate(`/book/${book._id}`);
  };

  // Determine if book should have a badge (based on some criteria)
  const getBadgeInfo = () => {
    // This is just an example - you can implement your own logic
    if (book.price > 500) return { type: 'bestseller', text: 'Bestseller' };
    if (book.quantity && book.quantity < 5) return { type: 'limited', text: 'Limited' };
    // Random badge for demo purposes (in real app, you'd have specific criteria)
    const random = Math.floor(Math.random() * 10);
    if (random < 3) return { type: 'new', text: 'New Arrival' };
    if (random >= 8) return { type: 'sale', text: 'Sale' };
    return null;
  };

  // Determine if book should have a ribbon
  const getRibbonInfo = () => {
    // This is just an example - you can implement your own logic
    if (book.price < 100) return { text: 'BUDGET', color: 'green' };
    if (book.price > 800) return { text: 'PREMIUM', color: 'purple' };
    // Random ribbon for demo purposes
    const random = Math.floor(Math.random() * 20);
    if (random === 0) return { text: 'EDITOR CHOICE', color: 'blue' };
    if (random === 1) return { text: 'AWARD WINNER', color: 'yellow' };
    return null;
  };

  const badgeInfo = getBadgeInfo();
  const ribbonInfo = getRibbonInfo();

  return (
    <div className="book-card relative transform transition duration-300 hover:scale-105 hover:shadow-xl w-[420px] h-[280px] rounded-lg overflow-hidden flex flex-row border border-red-300 bg-white">
      {/* Badge (if applicable) */}
      {badgeInfo && <BookBadge type={badgeInfo.type} text={badgeInfo.text} />}
      
      {/* Ribbon (if applicable) */}
      {ribbonInfo && <BookRibbon text={ribbonInfo.text} color={ribbonInfo.color} />}
      
      {/* Book Cover Image */}
      <div className="w-2/5 h-full overflow-hidden">
        <img 
          src={book.image} 
          onError={handleImageError} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110" 
          alt={book.subject || 'Book cover'} 
        />
      </div>
      
      {/* Book Details */}
      <div className="w-3/5 p-4 flex flex-col justify-between">
        <div>
          {/* Title with truncation for long titles */}
          <h1 className="text-2xl font-bold font-serif text-red-700 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {book.Subject || book.title}
          </h1>
          
          {/* Author if available */}
          {book.author && (
            <p className="text-gray-600 italic mb-1 text-sm">
              by {book.author}
            </p>
          )}
          
          {/* Rating */}
          <div className="mb-1">
            <StarRating rating={book.rating || (3 + Math.random() * 2)} />
          </div>
          
          {/* Short description or category */}
          <p className="text-gray-700 text-sm mb-2 line-clamp-2 overflow-hidden">
            {book.description || 'A captivating read that will keep you engaged from start to finish.'}
          </p>
        </div>
        
        <div className="mt-auto">
          {/* Price with discount indicator */}
          <div className="flex items-center mb-2">
            <span className="text-xl text-red-500 font-bold">₹{book.price}</span>
            {badgeInfo && badgeInfo.type === 'sale' && (
              <span className="ml-2 line-through text-gray-500 text-sm">₹{Math.round(book.price * 1.2)}</span>
            )}
          </div>
          
          {/* Availability indicator */}
          <div className="mb-2">
            <AvailabilityIndicator 
              available={book.quantity === undefined || book.quantity > 0} 
              quantity={book.quantity} 
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              className="flex-1 bg-white border-2 border-red-600 hover:bg-red-600 hover:text-white text-red-600 font-bold py-2 px-4 rounded-full transition duration-300"
              onClick={() => addInCart(book)}
            >
              Rent
            </button>
            <button
              className="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
              onClick={handleViewDetails}
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;