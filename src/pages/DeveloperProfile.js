import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EditProfileModal from '../components/EditProfileModal';
import FollowButton from '../components/FollowButton';
import ProfileProjectCard from '../components/ProfileProjectCard';
import { formatNumber } from '../utils/formatNumber';
import { api } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import './DeveloperProfile.css';

const DeveloperProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: username || 'youssef_kh',
    first_name: 'Youssef Mohammed',
    last_name: 'Khalil',
    bio: 'Full-stack developer passionate about building innovative web applications. Love working with React, Node.js, and modern web technologies.',
    location: 'Alexandria, EG',
    joiningDate: 'January 2023',
    followers: 1200000,
    following: 7,
    profile_picture: null,
    banner: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching profile for username:', username);
        // Fetch the specific user's profile data
        const userData = await api.getUserProfile(username);
        console.log('Fetched user data:', userData);
        setProfileData({
          ...userData,
          fullName: (userData.first_name && userData.last_name) 
            ? `${userData.first_name} ${userData.last_name}` 
            : userData.username,
          location: 'Location not set', // Add this field to backend later
          joiningDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown',
          followers: userData.followers || 0,
          following: userData.following || 0
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    const fetchUserProjects = async () => {
      try {
        console.log('Fetching projects for username:', username);
        const userProjects = await api.getUserProjects(username);
        console.log('Fetched user projects:', userProjects);
        setProjects(userProjects || []);
        setProjectsLoading(false);
      } catch (err) {
        console.error('Failed to load projects:', err);
        setProjects([]);
        setProjectsLoading(false);
      }
    };

    const fetchFollowStatus = async () => {
      try {
        // Only check follow status if user is logged in and not viewing their own profile
        if (user && user.username !== username) {
          console.log('Checking follow status for username:', username);
          const statusData = await api.checkFollowStatus(username);
          console.log('Follow status data:', statusData);
          setIsFollowing(statusData.following || false);
        }
      } catch (err) {
        console.error('Failed to check follow status:', err);
        setIsFollowing(false);
      }
    };

    fetchUserProfile();
    fetchUserProjects();
    fetchFollowStatus();
  }, [username, user]);

  const tabs = [
    { id: 'all', label: 'All projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'ideas', label: 'Ideas only projects' },
    { id: 'ready', label: 'Ready for production projects' },
    { id: 'development', label: 'Under development Projects' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const handleProfileUpdate = (updatedUser) => {
    console.log('Updating profile with:', updatedUser);
    setProfileData(updatedUser);
    
    // Also update the user in AuthContext if this is the logged-in user
    if (user?.username === username) {
      console.log('Updating AuthContext user data');
      setUser(updatedUser);
      // Also update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    setShowEditModal(false);
  };

  const handleFollowUpdate = (followData) => {
    setIsFollowing(followData.isFollowing);
    // Note: We'll update followers count from API response later
  };

  // Check if this is the logged-in user's profile
  const isOwnProfile = user?.username === username;

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

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
            {profileData.profile_picture ? (
              <img 
                src={profileData.profile_picture} 
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
            <div className="profile-header-row">
              <h1 className="profile-name">
                {profileData.first_name && profileData.last_name 
                  ? `${profileData.first_name} ${profileData.last_name}` 
                  : profileData.username}
              </h1>
              <div className="profile-actions">
                {isOwnProfile && (
                  <button 
                    className="create-project-btn"
                    onClick={() => navigate('/create-project')}
                    title="Create new project"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Create Project
                  </button>
                )}
                {!isOwnProfile && (
                  <FollowButton 
                    username={username}
                    isFollowing={isFollowing}
                    onUpdate={handleFollowUpdate}
                    size="medium"
                  />
                )}
                {isOwnProfile && (
                  <button 
                    className="edit-profile-button"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
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
              {projectsLoading ? (
                <div className="loading-projects">Loading projects...</div>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <ProfileProjectCard 
                    key={project.id} 
                    project={project}
                    onLike={() => console.log('Like project:', project.id)}
                    onSave={() => console.log('Save project:', project.id)}
                    onStar={() => console.log('Star project:', project.id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <h3>No projects yet</h3>
                  <p>This user hasn't created any projects yet.</p>
                  {isOwnProfile && (
                    <button 
                      className="create-first-project-btn"
                      onClick={() => navigate('/create-project')}
                    >
                      Create Your First Project
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'skills' && (
            <div className="skills-content">
              <p className="empty-state">Skills will be displayed here</p>
            </div>
          )}
          {activeTab === 'ideas' && (
            <div className="projects-grid">
              {projectsLoading ? (
                <div className="loading-projects">Loading projects...</div>
              ) : projects.filter(p => p.status === 'Only an Idea').length > 0 ? (
                projects.filter(p => p.status === 'Only an Idea').map((project) => (
                  <ProfileProjectCard 
                    key={project.id} 
                    project={project}
                    onLike={() => console.log('Like project:', project.id)}
                    onSave={() => console.log('Save project:', project.id)}
                    onStar={() => console.log('Star project:', project.id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <h3>No idea projects yet</h3>
                  <p>This user doesn't have any projects in the "Idea" stage.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'ready' && (
            <div className="projects-grid">
              {projectsLoading ? (
                <div className="loading-projects">Loading projects...</div>
              ) : projects.filter(p => p.status === 'Ready for Production').length > 0 ? (
                projects.filter(p => p.status === 'Ready for Production').map((project) => (
                  <ProfileProjectCard 
                    key={project.id} 
                    project={project}
                    onLike={() => console.log('Like project:', project.id)}
                    onSave={() => console.log('Save project:', project.id)}
                    onStar={() => console.log('Star project:', project.id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <h3>No production-ready projects yet</h3>
                  <p>This user doesn't have any projects ready for production.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'development' && (
            <div className="projects-grid">
              {projectsLoading ? (
                <div className="loading-projects">Loading projects...</div>
              ) : projects.filter(p => p.status === 'Under Development').length > 0 ? (
                projects.filter(p => p.status === 'Under Development').map((project) => (
                  <ProfileProjectCard 
                    key={project.id} 
                    project={project}
                    onLike={() => console.log('Like project:', project.id)}
                    onSave={() => console.log('Save project:', project.id)}
                    onStar={() => console.log('Star project:', project.id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <h3>No projects in development yet</h3>
                  <p>This user doesn't have any projects currently under development.</p>
                </div>
              )}
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
    
    {/* Edit Profile Modal */}
    {showEditModal && (
      <EditProfileModal
        user={profileData}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleProfileUpdate}
      />
    )}
  </div>
  );
};

export default DeveloperProfile;

