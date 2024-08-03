import React from 'react';
import Carousel  from 'react-elastic-carousel';

const BookCarousel = ({ books, breakpoints, addInCart }) => {
    const dummyImageUrl ='https://m.media-amazon.com/images/I/81UOudQyzPL._SY522_.jpg'; // Replace with your dummy image URL

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
        <div key={key} className="w-[420px] h-[250px] shadow-md shadow-red-100 rounded-[10px] flex flex-row justify-center border border-3 border-red-300 items-center gap-3 p-1">
          <div className="w-1/2 border-3 m-2 h-[200px]">
            <img src={data.image} onError={handleImageError}className="h-[200px] object-cover rounded-md" alt={data.subject}   />
          </div>
          <div className="w-1/2 flex gap-2 flex-col">
            <h1 className="text-3xl font-bold font-serif text-red-700 overflow-hidden truncate whitespace-nowrap">
              {data.Subject}
            </h1>
            <div className="text-xl text-red-400">
              <span className="text-black font-bold">Price: </span> ⟨₹⟩ {data.price}
            </div>
            <div>
              <button
                className="bg-white w-[80px] border border-red-600 hover:bg-[#FC2947] hover:text-white rounded-[20px] mt-7 text-xl font-serif font-bold text-red-600 py-2 mr-[2px]"
                onClick={() => { addInCart(data); }}
              >
                Rent
              </button>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default BookCarousel;
