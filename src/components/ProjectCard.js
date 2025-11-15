import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/formatNumber';
import './ProjectCard.css';

const ProjectCard = ({ project, onAccept, onReject }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isStarAnimating, setIsStarAnimating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  // Sample project data structure
  const projectData = project || {
    id: 1,
    image: null, // Will be replaced with actual image URL
    name: 'Sample Project',
    description: 'This is a sample project description that explains what the project is about and its main features.',
    generalTags: ['Innovation', 'Startup', 'Tech'],
    programmingTags: ['React', 'Node.js', 'MongoDB'],
    developer: {
      username: 'developer',
      name: 'Developer Name',
      profilePicture: null
    },
    likes: 0,
    status: 'Only an Idea'
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    // TODO: Navigate to developer profile
    window.location.href = `/dev/${projectData.developer.username}`;
  };

  const handleAcceptClick = () => {
    setIsAnimating(true);
    setAnimationDirection('right');
    setTimeout(() => {
      onAccept();
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 300);
  };

  const handleRejectClick = () => {
    setIsAnimating(true);
    setAnimationDirection('left');
    setTimeout(() => {
      onReject();
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 300);
  };

  const handleStarClick = () => {
    setIsStarred(!isStarred);
    setIsStarAnimating(true);
    setTimeout(() => {
      setIsStarAnimating(false);
    }, 600);
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setIsLikeAnimating(true);
    setTimeout(() => {
      setIsLikeAnimating(false);
    }, 600);
  };

  return (
    <div className="project-card-wrapper">
      {/* Reject Button - Left Side */}
      <button 
        className="action-button reject-button" 
        aria-label="Reject"
        onClick={handleRejectClick}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Project Card */}
      <div className={`project-card ${isAnimating ? `swipe-${animationDirection}` : ''}`}>
        {/* Project Image */}
        <div className="project-image-container">
          {projectData.image ? (
            <img src={projectData.image} alt={projectData.name} className="project-image" />
          ) : (
            <div className="project-image-placeholder">
              <span>Project Image</span>
            </div>
          )}
          
          {/* Developer Profile Picture - Overlapping the image */}
          <div className="developer-pfp-container">
            {projectData.developer.profilePicture ? (
              <img 
                src={projectData.developer.profilePicture} 
                alt={projectData.developer.name}
                className="developer-pfp"
              />
            ) : (
              <div className="developer-pfp-placeholder">
                <span>{projectData.developer.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Project Content */}
        <div className="project-content-wrapper">
          <div className="project-content">
            {/* Project Header with DM and Like */}
            <div className="project-header">
              <div className="project-title-section">
                <div className="project-title-row">
                  <h3 className="project-name">{projectData.name}</h3>
                  {projectData.status && (
                    <span className={`project-status status-${projectData.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {projectData.status}
                    </span>
                  )}
                </div>
                <Link 
                  to={`/dev/${projectData.developer.username}`}
                  className="project-developer"
                  onClick={handleProfileClick}
                >
                  by {projectData.developer.name}
                </Link>
              </div>
              
              <div className="project-header-actions">
                <button className="dm-button" aria-label="Send Message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <div className="header-buttons-group">
                  <button 
                    className={`like-button ${isLiked ? 'liked' : ''} ${isLikeAnimating ? 'like-animate' : ''}`}
                    aria-label="Like it"
                    onClick={handleLikeClick}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isLiked ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="like-text">Like it</span>
                  </button>
                  <button 
                    className={`star-button ${isStarred ? 'starred' : ''} ${isStarAnimating ? 'star-animate' : ''}`}
                    aria-label="Star it"
                    onClick={handleStarClick}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isStarred ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isStarred ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="star-text">Star it</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="project-description">{projectData.description}</p>

            {/* General Tags */}
            <div className="tags-section">
              <h4 className="tags-label">General tags</h4>
              <div className="tags-container">
                {projectData.generalTags.map((tag, index) => (
                  <span key={index} className="tag general-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Programming Tags */}
            <div className="tags-section">
              <h4 className="tags-label">Programming tags</h4>
              <div className="tags-container">
                {projectData.programmingTags.map((tag, index) => (
                  <span key={index} className="tag programming-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Likes Count - Bottom of Card */}
        <div className="project-actions">
          <div className="likes-count">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="likes-number">{formatNumber(projectData.likes)}</span>
          </div>
        </div>
      </div>

      {/* Accept Button - Right Side */}
      <button 
        className="action-button accept-button" 
        aria-label="Accept"
        onClick={handleAcceptClick}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default ProjectCard;

