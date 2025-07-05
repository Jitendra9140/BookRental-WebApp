import React, { useState, useEffect, useContext } from 'react';
import { updateUserProfile } from '../../Api/user';
import Navbar from '../../Components/common/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../Style/profile.css';
import '../../Style/scoped-styles.css';
import { UserContext } from '../../contexts/UserContext';

export default function Profile() {
  const { user, loading: userLoading, refreshUserData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phonenumber: '',
    year: '',
    profilePic: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const id = user ? user._id : window.localStorage.getItem("Id");
  
  useEffect(() => {
    if (user) {
      setFormData({
        fname: user.fname || '',
        lname: user.lname || '',
        email: user.email || '',
        phonenumber: user.phonenumber || '',
        year: user.year || '',
        profilePic: null
      });
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePic: file
      });
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await updateUserProfile(id, formData);
      
      if (response && response.data && response.data.success) {
        toast.success("Profile updated successfully", { position: toast.POSITION.TOP_RIGHT });
        // Refresh user data from context
        await refreshUserData();
        // Toggle back to view mode
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile", { position: toast.POSITION.TOP_RIGHT });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile", { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      // Reset form data when entering edit mode
      setFormData({
        fname: user.fname || '',
        lname: user.lname || '',
        email: user.email || '',
        phonenumber: user.phonenumber || '',
        year: user.year || '',
        profilePic: null
      });
      setPreviewImage(null);
    }
  };

  if (loading || userLoading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full z-20 shadow-md">
          <Navbar />
        </div>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="ml-3 text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-20 shadow-md">
        <Navbar />
      </div>
      <div className="profile-page profile-container">
        <div className="profile-card">
          <h1 className="profile-title">User Profile</h1>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-image-container">
                <img 
                  src={previewImage || user.profilePic || 'https://via.placeholder.com/150'}
                  alt="Profile" 
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className="profile-image-upload">
                  <label htmlFor="profilePic" className="profile-image-label">
                    Change Photo
                  </label>
                  <input 
                    type="file" 
                    id="profilePic" 
                    name="profilePic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="profile-image-input"
                  />
                </div>
              </div>
              
              <div className="profile-form-group">
                <label htmlFor="fname">First Name</label>
                <input 
                  type="text" 
                  id="fname" 
                  name="fname" 
                  value={formData.fname}
                  onChange={handleInputChange}
                  className="profile-input"
                  required
                />
              </div>
              
              <div className="profile-form-group">
                <label htmlFor="lname">Last Name</label>
                <input 
                  type="text" 
                  id="lname" 
                  name="lname" 
                  value={formData.lname}
                  onChange={handleInputChange}
                  className="profile-input"
                  required
                />
              </div>
              
              <div className="profile-form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                  required
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="profile-form-group">
                <label htmlFor="phonenumber">Phone Number</label>
                <input 
                  type="tel" 
                  id="phonenumber" 
                  name="phonenumber" 
                  value={formData.phonenumber}
                  onChange={handleInputChange}
                  className="profile-input"
                  required
                />
              </div>
              
              <div className="profile-form-group">
                <label htmlFor="year">Year</label>
                <select 
                  id="year" 
                  name="year" 
                  value={formData.year}
                  onChange={handleInputChange}
                  className="profile-input"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>
              
              <div className="profile-buttons">
                <button type="submit" className="profile-save-btn">Save Changes</button>
                <button type="button" onClick={toggleEditMode} className="profile-cancel-btn">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-image-container">
                <img 
                  src={user.profilePic || 'https://via.placeholder.com/150'}
                  alt="Profile" 
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
              
              <div className="profile-info">
                <div className="profile-info-group">
                  <span className="profile-label">Name:</span>
                  <span className="profile-value">{user.fname} {user.lname}</span>
                </div>
                
                <div className="profile-info-group">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{user.email}</span>
                </div>
                
                <div className="profile-info-group">
                  <span className="profile-label">Phone:</span>
                  <span className="profile-value">{user.phonenumber}</span>
                </div>
                
                <div className="profile-info-group">
                  <span className="profile-label">Year:</span>
                  <span className="profile-value">
                    {user.year === 1 ? 'First Year' : 
                     user.year === 2 ? 'Second Year' : 
                     user.year === 3 ? 'Third Year' : 
                     user.year === 4 ? 'Fourth Year' : 'Not specified'}
                  </span>
                </div>
                
                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="profile-stat-value">{user.cart ? user.cart.length : 0}</span>
                    <span className="profile-stat-label">Books in Cart</span>
                  </div>
                  
                  <div className="profile-stat">
                    <span className="profile-stat-value">{user.return ? user.return.length : 0}</span>
                    <span className="profile-stat-label">Books Returned</span>
                  </div>
                </div>
                
                <button onClick={toggleEditMode} className="profile-edit-btn">Edit Profile</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}