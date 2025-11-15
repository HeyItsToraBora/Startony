import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { formatNumber } from '../utils/formatNumber';
import './DeveloperProfile.css';

const DeveloperProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('all');

  // Sample data - replace with API call
  const profileData = {
    username: username || 'youssef_kh',
    fullName: 'Youssef Mohammed Khalil ',
    bio: 'Full-stack developer passionate about building innovative web applications. Love working with React, Node.js, and modern web technologies.',
    location: 'Alexandria, EG',
    joiningDate: 'January 2023',
    followers: 1200000,
    following: 7,
    profilePicture: null, // Will be replaced with actual image
    banner: null // Will be replaced with actual image
  };

  const tabs = [
    { id: 'all', label: 'All projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'ideas', label: 'Ideas only projects' },
    { id: 'ready', label: 'Ready for production projects' },
    { id: 'development', label: 'Under development Projects' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="developer-profile-container">
      <Sidebar />
      <div className="developer-profile">
        {/* Banner */}
        <div className="profile-banner">
        {profileData.banner ? (
          <img src={profileData.banner} alt="Banner" />
        ) : (
          <div className="banner-placeholder"></div>
        )}
      </div>

      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-picture-container">
            {profileData.profilePicture ? (
              <img 
                src={profileData.profilePicture} 
                alt={profileData.username}
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <span>{profileData.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{profileData.fullName}</h1>
            <p className="profile-username">@{profileData.username}</p>
            
            <div className="profile-meta">
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {profileData.location}
              </span>
              <span className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Joined {profileData.joiningDate}
              </span>
            </div>

            <p className="profile-bio">{profileData.bio}</p>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{formatNumber(profileData.following)}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{formatNumber(profileData.followers)}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'all' && (
            <div className="projects-grid">
              <p className="empty-state">All projects will be displayed here</p>
            </div>
          )}
          {activeTab === 'skills' && (
            <div className="skills-content">
              <p className="empty-state">Skills will be displayed here</p>
            </div>
          )}
          {activeTab === 'ideas' && (
            <div className="projects-grid">
              <p className="empty-state">Ideas only projects will be displayed here</p>
            </div>
          )}
          {activeTab === 'ready' && (
            <div className="projects-grid">
              <p className="empty-state">Ready for production projects will be displayed here</p>
            </div>
          )}
          {activeTab === 'development' && (
            <div className="projects-grid">
              <p className="empty-state">Under development projects will be displayed here</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="projects-grid">
              <p className="empty-state">Reviews will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default DeveloperProfile;

