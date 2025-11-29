import React, { useState } from 'react';
import { formatNumber } from '../utils/formatNumber';
import './ProfileProjectCard.css';

const ProfileProjectCard = ({ project, onLike, onSave, onStar }) => {
  const [isLiked, setIsLiked] = useState(project?.saved_by_user || false);
  const [isStarred, setIsStarred] = useState(project?.starred_by_user || false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isStarAnimating, setIsStarAnimating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null);

  // Use real project data with fallbacks
  const projectData = {
    id: project?.id || 1,
    name: project?.name || 'Untitled Project',
    description: project?.description || 'No description available.',
    code: project?.code || 'project-code',
    general_tags: project?.general_tags || [],
    programming_tags: project?.programming_tags || [],
    likes: project?.likes_count || project?.likes || 0,
    status: project?.status || 'Development',
    images: project?.images || [],
    developer: project?.developer || {
      username: 'developer',
      first_name: 'Developer',
      last_name: 'Name',
      profile_picture: null
    }
  };

  const handleCardClick = () => {
    if (projectData.code && projectData.developer?.username) {
      window.location.href = `/dev/${projectData.developer.username}/${projectData.code}`;
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLikeAnimating(true);
    setIsLiked(!isLiked);
    if (onLike) onLike();
    setTimeout(() => {
      setIsLikeAnimating(false);
    }, 600);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    setIsStarAnimating(true);
    setIsStarred(!isStarred);
    if (onStar) onStar();
    setTimeout(() => {
      setIsStarAnimating(false);
    }, 600);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (onSave) onSave();
  };

  // Only show image placeholder if there are no images
  const hasImages = projectData.images && projectData.images.length > 0;

  return (
    <div className="profile-project-card-wrapper">
      {/* Project Card */}
      <div
        className={`profile-project-card ${isAnimating ? `swipe-${animationDirection}` : ''}`}
        onClick={handleCardClick}
        style={{ cursor: projectData.code ? 'pointer' : 'default' }}
      >
        {/* Project Images - Only show if images exist */}
        {hasImages && (
          <div className="profile-project-image-container">
            <img 
              src={projectData.images[0]} 
              alt={projectData.name} 
              className="profile-project-image"
              onError={(e) => {
                // Hide image if it fails to load
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Project Content */}
        <div className="profile-project-content-wrapper">
          <div className="profile-project-content">
            {/* Project Header */}
            <div className="profile-project-header">
              {/* Developer Profile Picture */}
              <div className="profile-developer-pfp-container">
                {projectData.developer?.profile_picture ? (
                  <img 
                    src={projectData.developer.profile_picture} 
                    alt={`${projectData.developer.username}'s profile`}
                    className="profile-developer-pfp"
                    onError={(e) => {
                      // Hide image if it fails to load and show fallback
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Fallback PFP */}
                <div className="profile-developer-pfp-fallback" style={{display: projectData.developer?.profile_picture ? 'none' : 'flex'}}>
                  <span className="profile-developer-pfp-initial">
                    {(projectData.developer?.first_name?.[0] || projectData.developer?.username?.[0] || '?').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="profile-project-title-section">
                <div className="profile-project-title-row">
                  <h3 className="profile-project-name">{projectData.name}</h3>
                  {projectData.status && (
                    <span className={`profile-project-status status-${projectData.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {projectData.status}
                    </span>
                  )}
                </div>
                <div className="profile-developer-info">
                  <span className="profile-developer-name">
                    {(projectData.developer?.first_name && projectData.developer?.last_name) 
                      ? `${projectData.developer.first_name} ${projectData.developer.last_name}` 
                      : projectData.developer?.username || 'Unknown Developer'}
                  </span>
                </div>
              </div>
            </div>

            <p className="profile-project-description">
              {projectData.description}
            </p>

            {/* Tags - Only show if tags exist */}
            {(projectData.general_tags && projectData.general_tags.length > 0) && (
              <div className="profile-tags-section">
                <h4 className="profile-tags-label">General tags</h4>
                <div className="profile-tags-container">
                  {projectData.general_tags.map((tag, index) => (
                    <span key={index} className="profile-tag general-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Programming Tags - Only show if tags exist */}
            {(projectData.programming_tags && projectData.programming_tags.length > 0) && (
              <div className="profile-tags-section">
                <h4 className="profile-tags-label">Programming tags</h4>
                <div className="profile-tags-container">
                  {projectData.programming_tags.map((tag, index) => (
                    <span key={index} className="profile-tag programming-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="profile-project-actions">
              <button 
                className={`profile-action-btn like-btn ${isLiked ? 'liked' : ''} ${isLikeAnimating ? 'animate' : ''}`}
                onClick={handleLikeClick}
              >
                <span className="action-icon">❤️</span>
                <span className="action-count">{formatNumber(projectData.likes)}</span>
              </button>
              
              <button 
                className="profile-action-btn save-btn"
                onClick={handleSaveClick}
              >
                <span className="action-icon">📁</span>
              </button>
              
              <button 
                className={`profile-action-btn star-btn ${isStarred ? 'starred' : ''} ${isStarAnimating ? 'animate' : ''}`}
                onClick={handleStarClick}
              >
                <span className="action-icon">⭐</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileProjectCard;
