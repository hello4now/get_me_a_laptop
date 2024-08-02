import React from 'react';
import './RatingBar.css';

const RatingBar = ({ rating }) => {
  const fullBars = Math.floor(rating);
  const partialFill = (rating % 1) * 100; // Percentage for partial fill

  return (
    <div className="rating-bar">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="rating-segment"
          style={{
            background: index < fullBars ? 'green' : index === fullBars ? `linear-gradient(to right, green ${partialFill}%, white ${partialFill}%)` : 'white',
          }}
        ></div>
      ))}
    </div>
  );
};

export default RatingBar;
