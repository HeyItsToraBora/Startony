import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { formatNumber } from '../utils/formatNumber';
import './Starred.css';

const Starred = () => {
  // Sample starred projects - in a real app, this would come from an API
  const starredProjects = [
    {
      id: 1,
      image: null,
      name: 'E-Commerce Platform',
      generalTags: ['E-Commerce', 'Business', 'Retail'],
      programmingTags: ['React', 'Node.js', 'MongoDB', 'Express'],
      developer: {
        username: 'john_doe',
        name: 'John Doe',
        profilePicture: null
      },
      likes: 245,
      status: 'Ready for production',
      starredAt: '2 days ago'
    },
    {
      id: 6,
      image: null,
      name: 'AI Chat Assistant',
      generalTags: ['AI', 'Automation', 'Tech'],
      programmingTags: ['Python', 'TensorFlow', 'FastAPI', 'PostgreSQL'],
      developer: {
        username: 'ai_dev',
        name: 'AI Developer',
        profilePicture: null
      },
      likes: 1250,
      status: 'Ready for production',
      starredAt: '1 week ago'
    },
    {
      id: 8,
      image: null,
      name: 'Music Streaming App',
      generalTags: ['Entertainment', 'Music', 'Streaming'],
      programmingTags: ['React Native', 'Node.js', 'MongoDB', 'AWS'],
      developer: {
        username: 'music_dev',
        name: 'Music Dev',
        profilePicture: null
      },
      likes: 2100,
      status: 'Ready for production',
      starredAt: '3 days ago'
    },
    {
      id: 5,
      image: null,
      name: 'Learning Management System',
      generalTags: ['Education', 'E-Learning', 'Training'],
      programmingTags: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      developer: {
        username: 'mike_brown',
        name: 'Mike Brown',
        profilePicture: null
      },
      likes: 428,
      status: 'Ready for production',
      starredAt: '5 days ago'
    },
    {
      id: 12,
      image: null,
      name: 'Travel Planner App',
      generalTags: ['Travel', 'Planning', 'Utility'],
      programmingTags: ['React', 'TypeScript', 'Mapbox', 'Node.js'],
      developer: {
        username: 'travel_pro',
        name: 'Travel Pro',
        profilePicture: null
      },
      likes: 743,
      status: 'Ready for production',
      starredAt: '1 day ago'
    }
  ];

  return (
    <div className="starred-container">
      <Sidebar />
      <main className="starred-main">
        <div className="starred-content">
          <div className="starred-header">
            <h1 className="starred-title">Starred Projects</h1>
            <span className="starred-count">{starredProjects.length} project{starredProjects.length !== 1 ? 's' : ''}</span>
          </div>

          {starredProjects.length > 0 ? (
            <div className="starred-projects-grid">
              {starredProjects.map(project => (
                <Link 
                  key={project.id} 
                  to={`/dev/${project.developer.username}`}
                  className="starred-project-card"
                >
                  <div className="starred-card-image">
                    {project.image ? (
                      <img src={project.image} alt={project.name} />
                    ) : (
                      <div className="starred-card-image-placeholder">
                        <span>{project.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="starred-card-status">
                      <span className={`status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="starred-card-content">
                    <h3 className="starred-card-name">{project.name}</h3>
                    <div className="starred-card-developer">
                      {project.developer.profilePicture ? (
                        <img
                          src={project.developer.profilePicture}
                          alt={project.developer.name}
                          className="starred-card-dev-pfp"
                        />
                      ) : (
                        <div className="starred-card-dev-pfp-placeholder">
                          <span>{project.developer.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <span className="starred-card-dev-name">@{project.developer.username}</span>
                    </div>
                    <div className="starred-card-footer">
                      <div className="starred-card-likes">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span>{formatNumber(project.likes)}</span>
                      </div>
                      <span className="starred-card-date">Starred {project.starredAt}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-starred-projects">
              <div className="no-starred-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <p>No starred projects yet</p>
              <p className="no-starred-subtitle">Start exploring and star projects you find interesting!</p>
              <Link to="/browse" className="browse-link-button">
                Browse Projects
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Starred;

