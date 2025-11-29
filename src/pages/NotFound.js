import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NotFound.css';

const NotFound = () => {
  const { user, isAuthenticated } = useAuth();
  
  const profileLink = isAuthenticated && user ? `/dev/${user.username}` : '/login';

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for seems to have vanished into the digital void.
        </p>
        <p className="error-subtitle">
          Don't worry, even the best explorers get lost sometimes.
        </p>
        
        <div className="action-buttons">
          <Link to={isAuthenticated ? "/home" : "/login"} className="home-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            {isAuthenticated ? "Go Home" : "Login"}
          </Link>
          
          {isAuthenticated && (
            <Link to="/browse" className="browse-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Browse Projects
            </Link>
          )}
        </div>
        
        {isAuthenticated && (
          <div className="help-links">
            <h3>Looking for something specific?</h3>
            <div className="links-grid">
              <Link to="/browse">Browse Projects</Link>
              <Link to="/home">Find Developers</Link>
              <Link to="/create-project">Create Project</Link>
              <Link to={profileLink}>Your Profile</Link>
            </div>
          </div>
        )}
      </div>
      
      <div className="floating-elements">
        <div className="float-element float-1">404</div>
        <div className="float-element float-2">?</div>
        <div className="float-element float-3">!</div>
        <div className="float-element float-4">🔍</div>
      </div>
    </div>
  );
};

export default NotFound;
