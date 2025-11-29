import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/api';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    github_link: user.github_link || '',
    portfolio_link: user.portfolio_link || '',
    linkedin_link: user.linkedin_link || '',
    company_name: user.company_name || ''
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(user.profile_picture || '');
  const [bannerPreview, setBannerPreview] = useState(user.banner || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Log user data for debugging
  useEffect(() => {
    console.log('EditProfileModal user data:', user);
  }, [user]);

  const profilePictureInputRef = useRef();
  const bannerInputRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting profile update with data:', formData);
      console.log('Files:', { profilePictureFile, bannerFile });
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
          console.log(`Adding field ${key}:`, formData[key]);
        }
      });

      // Add files if they exist
      if (profilePictureFile) {
        formDataToSend.append('profile_picture', profilePictureFile);
        console.log('Adding profile picture file');
      }
      if (bannerFile) {
        formDataToSend.append('banner', bannerFile);
        console.log('Adding banner file');
      }

      // Call the update profile API
      const updatedUser = await api.updateProfile(formDataToSend);
      console.log('Profile update response:', updatedUser);
      
      // Update the user state in parent component
      onUpdate(updatedUser);
      
      // Close the modal
      onClose();
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-profile-modal">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Banner Upload */}
          <div className="banner-upload-section">
            <div 
              className="banner-preview"
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner" className="banner-image" />
              ) : (
                <div className="banner-placeholder">
                  <span>Banner</span>
                </div>
              )}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Profile Picture Upload */}
          <div className="profile-picture-section">
            <div 
              className="profile-picture-upload"
              onClick={() => profilePictureInputRef.current?.click()}
            >
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt="Profile" className="profile-picture-preview" />
              ) : (
                <div className="profile-picture-placeholder">
                  <span>PFP</span>
                </div>
              )}
              <div className="profile-picture-overlay">
                <span>Change photo</span>
              </div>
              <input
                ref={profilePictureInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="github_link">GitHub Link</label>
              <input
                type="url"
                id="github_link"
                name="github_link"
                value={formData.github_link}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="portfolio_link">Portfolio Link</label>
              <input
                type="url"
                id="portfolio_link"
                name="portfolio_link"
                value={formData.portfolio_link}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin_link">LinkedIn Link</label>
              <input
                type="url"
                id="linkedin_link"
                name="linkedin_link"
                value={formData.linkedin_link}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="company_name">Company Name</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
