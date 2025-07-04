import React from 'react';

const DownloadButton = ({ onClick, text = 'Download as PDF' }) => {
  return (
    <button 
      className="download-btn"
      onClick={onClick}
    >
      <span>↓</span> {text}
    </button>
  );
};

export default DownloadButton;