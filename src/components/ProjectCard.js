import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/formatNumber';
import FollowButton from './FollowButton';
import ContextMenu from './ContextMenu';
import './ProjectCard.css';

const ProjectCard = ({ project, onAccept, onReject }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isStarAnimating, setIsStarAnimating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  // Use real project data or fallback
  const projectData = project || {
    id: 1,
    images: [],
    name: 'Sample Project',
    description: 'This is a sample project description that explains what the project is about and its main features.',
    general_tags: ['Innovation', 'Startup', 'Tech'],
    programming_tags: ['React', 'Node.js', 'MongoDB'],
    developer: {
      username: 'developer',
      first_name: 'Developer',
      last_name: 'Name',
      profile_picture: null
    },
    likes: 0,
    status: 'Only an Idea',
    code: 'sample-project'
  };

  const handleCardClick = () => {
    if (projectData.code && projectData.developer?.username) {
      window.location.href = `/dev/${projectData.developer.username}/${projectData.code}`;
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (projectData.developer?.username) {
      window.location.href = `/dev/${projectData.developer.username}`;
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    setContextMenu({
      visible: true,
      x,
      y,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
    });
  };

  const getContextMenuItem = () => {
    return [
      {
        label: 'View Project',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        ),
        onClick: () => {
          if (projectData.code && projectData.developer?.username) {
            window.location.href = `/dev/${projectData.developer.username}/${projectData.code}`;
          }
        },
      },
      {
        label: 'View Profile',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        ),
        onClick: () => {
          if (projectData.developer?.username) {
            window.location.href = `/dev/${projectData.developer.username}`;
          }
        },
      },
      {
        label: 'separator',
      },
      {
        label: 'Copy Link',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        ),
        onClick: () => {
          if (projectData.code && projectData.developer?.username) {
            const url = `${window.location.origin}/dev/${projectData.developer.username}/${projectData.code}`;
            navigator.clipboard.writeText(url);
          }
        },
        shortcut: 'Ctrl+C',
      },
      {
        label: 'Share Project',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        ),
        onClick: () => {
          if (navigator.share) {
            navigator.share({
              title: projectData.name,
              text: projectData.description,
              url: `${window.location.origin}/dev/${projectData.developer?.username}/${projectData.code}`,
            });
          }
        },
      },
      {
        label: 'separator',
      },
      {
        label: 'Like Project',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isLiked ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        ),
        onClick: () => {
          setIsLiked(!isLiked);
          setIsLikeAnimating(true);
          setTimeout(() => setIsLikeAnimating(false), 600);
        },
      },
      {
        label: 'Save Project',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        ),
        onClick: () => {
          // Save functionality
          console.log('Save project:', projectData.id);
        },
      },
      {
        label: 'separator',
      },
      {
        label: 'Report Project',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        ),
        onClick: () => {
          console.log('Report project:', projectData.id);
        },
        danger: true,
      },
    ];
  };

  const handleAcceptClick = (e) => {
    e.stopPropagation();
    setIsAnimating(true);
    setAnimationDirection('right');
    setTimeout(() => {
      onAccept();
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 500);
  };

  const handleRejectClick = (e) => {
    e.stopPropagation();
    setIsAnimating(true);
    setAnimationDirection('left');
    setTimeout(() => {
      onReject();
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 500);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLikeAnimating(true);
    setIsLiked(!isLiked);
    setTimeout(() => {
      setIsLikeAnimating(false);
    }, 600);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    setIsStarAnimating(true);
    setIsStarred(!isStarred);
    setTimeout(() => {
      setIsStarAnimating(false);
    }, 600);
  };

  const handleFollowUpdate = (followData) => {
    setIsFollowing(followData.isFollowing);
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
      <div
        className={`project-card ${isAnimating ? `swipe-${animationDirection}` : ''}`}
        onClick={handleCardClick}
        onContextMenu={handleContextMenu}
        style={{ cursor: projectData.code ? 'pointer' : 'default' }}
      >
        {/* Project Images */}
        <div className="project-image-container">
          {projectData.images && projectData.images.length > 0 ? (
            <div className={`project-images-grid ${projectData.images.length > 4 ? `has-${projectData.images.length}-images` : ''}`}>
              {projectData.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${projectData.name} - Image ${index + 1}`} 
                  className={`project-image project-image-${index + 1}`}
                />
              ))}
            </div>
          ) : (
            <div className="project-image-placeholder">
              <span>Project Images</span>
            </div>
          )}

          {/* Developer Profile Picture - Overlapping the image */}
          <div className="developer-pfp-container">
            {projectData.developer?.profile_picture ? (
              <img
                src={projectData.developer.profile_picture}
                alt={`${projectData.developer?.first_name || ''} ${projectData.developer?.last_name || ''}` || projectData.developer?.username || 'Developer'}
                className="developer-pfp"
              />
            ) : (
              <div className="developer-pfp-placeholder">
                <span>{(
                  (projectData.developer?.first_name && projectData.developer?.last_name) 
                    ? `${projectData.developer.first_name.charAt(0)}${projectData.developer.last_name.charAt(0)}`
                    : (projectData.developer?.first_name || projectData.developer?.username || '?').charAt(0).toUpperCase()
                )}</span>
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
                <div 
                  className="developer-info"
                  onClick={handleProfileClick}
                >
                  <Link 
                    to={`/dev/${projectData.developer?.username || '#'}`}
                    className="developer-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    by {(projectData.developer?.first_name && projectData.developer?.last_name) 
                      ? `${projectData.developer.first_name} ${projectData.developer.last_name}` 
                      : projectData.developer?.username || 'Unknown Developer'}
                  </Link>
                </div>
              </div>

              <div className="project-header-actions">
                <FollowButton 
                  username={projectData.developer?.username || ''}
                  isFollowing={isFollowing}
                  onUpdate={handleFollowUpdate}
                  size="small"
                />
                <button
                  className="dm-button"
                  aria-label="Send Message"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <button
                  className={`like-button ${isLiked ? 'liked' : ''}`}
                  onClick={handleLikeClick}
                  aria-label={isLiked ? "Unlike" : "Like"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isLiked ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button
                  className={`star-button ${isStarred ? 'starred' : ''}`}
                  onClick={handleStarClick}
                  aria-label={isStarred ? "Unstar" : "Star"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>

            <p className="project-description">{projectData.description}</p>

            {/* General Tags */}
            <div className="tags-section">
              <h4 className="tags-label">General tags</h4>
              <div className="tags-container">
                {(projectData.general_tags || []).map((tag, index) => (
                  <span key={index} className="tag general-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Programming Tags */}
            <div className="tags-section">
              <h4 className="tags-label">Programming tags</h4>
              <div className="tags-container">
                {(projectData.programming_tags || []).map((tag, index) => (
                  <span key={index} className="tag programming-tag">{tag}</span>
                ))}
              </div>
            </div>
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
      
      {/* Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
        menuItems={getContextMenuItem()}
      />
    </div>
  );
};

export default ProjectCard;
