import React from 'react';
import Carousel  from 'react-elastic-carousel';
import { Link ,useParams} from 'react-router-dom';
const trimText = (text, maxLength) => {
  if (!text) return '';
  const str = typeof text === 'string' ? text : String(text);
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

const BookCarousel = ({ books, breakpoints, addInCart }) => {
    const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'; // Replace with your dummy image URL
  const { id } = useParams();
  // Function to handle image error
  const handleImageError = (event) => {
    event.target.src = dummyImageUrl;
  };
  return (
    <Carousel
      className="book1"
      itemsToShow={3}
      itemPadding={[10, 10]}
      itemsToScroll={1}
      breakPoints={breakpoints}
    >
      {books.map((data, key) => (
        <div className="relative w-[400px] h-[250px] m-3 p-2 group" key={data.id}>
              <div className="relative h-full w-full flex overflow-hidden bg-white/30 border border-white/20 rounded-xl p-0.5">
                {/* Image */}
                <div className="w-1/3 relative p-0.5">
                  <div className="h-full w-full overflow-hidden rounded-l-lg border">
                    <img
                      className="w-full h-full object-cover"
                      src={`${data.image}`}
                      onError={handleImageError}
                      alt={data.title}
                    />
                  </div>
                  <div className="absolute top-2 left-2 z-2">
                    {data.quantity > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 z-10 text-green-800">
                        <span className="w-2 h-2 mr-1 rounded-full bg-green-500 animate-pulse "></span> Available

                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-2 h-2 mr-1 rounded-full bg-red-500"></span> Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="w-2/3 p-4 flex flex-col">
                  <div className="flex-grow">
                    <h1 className="text-gray-900 font-bold text-xl mb-1 line-clamp-2 px-0.5">{trimText(data.title, 30)}</h1>
                    <h3 className="text-gray-700 font-medium text-sm mb-1 px-0.5">{trimText(data.publisher, 25)}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2 px-0.5">{trimText(data.description, 25)}</p>
                    <div className="text-sm mb-1 px-0.5">
                      {data.quantity > 0 ? (
                        <span className="text-green-700 font-medium">{data.quantity} copies available</span>
                      ) : (
                        <span className="text-red-700 font-medium">Currently unavailable</span>
                      )}
                    </div>
                    <div className="flex items-center mb-2 px-0.5">
                      <span className="text-gray-700 font-medium mr-2">Price:</span>
                      <span className="text-xl font-bold text-red-700">₹{data.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-3 mt-auto px-0.5">
                    <button
                      onClick={() => addInCart(data)}
                      className="w-24 h-9 bg-red-600 text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center"
                      disabled={data.quantity <= 0}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/${id}/book/${data._id}`}
                      className="w-24 h-9 bg-gray-800 text-white text-xs font-bold uppercase rounded-lg flex items-center justify-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
      ))}
    </Carousel>
  );
};

export default BookCarousel;