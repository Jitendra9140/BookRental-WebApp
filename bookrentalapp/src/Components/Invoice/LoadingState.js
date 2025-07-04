import React from 'react';

const LoadingState = ({ message = 'Loading invoice data...' }) => {
  return (
    <div className="loading-state">
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;