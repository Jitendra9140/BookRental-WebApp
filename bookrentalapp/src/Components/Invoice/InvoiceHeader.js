import React from 'react';
import { useNavigate } from 'react-router-dom';

const InvoiceHeader = ({ activeTab, handleTabChange }) => {
  const navigate = useNavigate();
  
  // Function to navigate to profile page
  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="invoice-tabs">
      <button 
        className={`invoice-tab ${activeTab === 'current' ? 'active' : ''}`}
        onClick={() => handleTabChange('current')}
      >
        Current Return
      </button>
      <button 
        className={`invoice-tab ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => handleTabChange('history')}
      >
        Return History
      </button>
      <button 
        className={`invoice-tab ${activeTab === 'purchases' ? 'active' : ''}`}
        onClick={() => handleTabChange('purchases')}
      >
        Purchase History
      </button>
      <button 
        className={`invoice-tab ${activeTab === 'invoices' ? 'active' : ''}`}
        onClick={() => handleTabChange('invoices')}
      >
        Invoices
      </button>
     
      <button 
        className="invoice-tab profile-btn"
        onClick={goToProfile}
      >
        View Profile
      </button>
    </div>
  );
};

export default InvoiceHeader;