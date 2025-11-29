import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { api } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import './Saved.css';

const Saved = () => {
  const { user } = useAuth();
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // We'll need to create this API endpoint
        // For now, let's simulate with a placeholder
        const response = await api.getSavedProjects();
        setSavedProjects(response || []);
      } catch (error) {
        console.error('Error fetching saved projects:', error);
        setError('Failed to load saved projects');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedProjects();
    }
  }, [user]);

  const handleUnsave = async (projectId) => {
    try {
      await api.unsaveProject(projectId);
      // Remove from local state
      setSavedProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error unsaving project:', error);
    }
  };

  if (loading) {
    return (
      <div className="saved-container">
        <Sidebar />
        <div className="saved-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your saved projects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-container">
        <Sidebar />
        <div className="saved-content">
          <div className="error-state">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-container">
      <Sidebar />
      <div className="saved-content">
        <div className="saved-header">
          <h1 className="saved-title">Saved Projects</h1>
          <p className="saved-subtitle">
            Projects you've saved for later reference
          </p>
        </div>

        {savedProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
            </div>
            <h3>No saved projects yet</h3>
            <p>You haven't saved any projects yet. Start exploring and save projects that interest you!</p>
            <Link to="/browse" className="browse-btn">
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="projects-grid">
            {savedProjects.map((project) => (
              <div key={project.id} className="project-card-wrapper">
                <ProjectCard
                  project={project}
                  onLike={() => console.log('Like project:', project.id)}
                  onSave={() => handleUnsave(project.id)}
                  onStar={() => console.log('Star project:', project.id)}
                  isSaved={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
