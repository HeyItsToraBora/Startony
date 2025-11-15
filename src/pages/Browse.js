import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { formatNumber } from '../utils/formatNumber';
import './Browse.css';

const Browse = () => {
  // Sample projects data - in a real app, this would come from an API
  const [projects] = useState([
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
      stars: 189,
      status: 'Ready for production'
    },
    {
      id: 2,
      image: null,
      name: 'Social Media Dashboard',
      generalTags: ['Social Media', 'Analytics', 'Marketing'],
      programmingTags: ['Vue.js', 'Python', 'PostgreSQL', 'Django'],
      developer: {
        username: 'jane_smith',
        name: 'Jane Smith',
        profilePicture: null
      },
      likes: 189,
      stars: 145,
      status: 'Under development'
    },
    {
      id: 3,
      image: null,
      name: 'Task Management App',
      generalTags: ['Productivity', 'Collaboration', 'Project Management'],
      programmingTags: ['Angular', 'TypeScript', 'Firebase', 'Material UI'],
      developer: {
        username: 'alex_dev',
        name: 'Alex Developer',
        profilePicture: null
      },
      likes: 312,
      stars: 267,
      status: 'Under development'
    },
    {
      id: 4,
      image: null,
      name: 'Fitness Tracking Platform',
      generalTags: ['Health', 'Fitness', 'Wellness'],
      programmingTags: ['React Native', 'GraphQL', 'MongoDB', 'Node.js'],
      developer: {
        username: 'sarah_wilson',
        name: 'Sarah Wilson',
        profilePicture: null
      },
      likes: 156,
      stars: 98,
      status: 'Only an Idea'
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
      stars: 356,
      status: 'Ready for production'
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
      stars: 892,
      status: 'Ready for production'
    },
    {
      id: 7,
      image: null,
      name: 'Crypto Tracker',
      generalTags: ['Finance', 'Cryptocurrency', 'Trading'],
      programmingTags: ['React', 'TypeScript', 'WebSocket', 'Chart.js'],
      developer: {
        username: 'crypto_master',
        name: 'Crypto Master',
        profilePicture: null
      },
      likes: 980,
      stars: 756,
      status: 'Under development'
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
      stars: 1543,
      status: 'Ready for production'
    },
    {
      id: 9,
      image: null,
      name: 'Photo Editor Pro',
      generalTags: ['Design', 'Photography', 'Creative'],
      programmingTags: ['React', 'Canvas API', 'WebGL', 'Node.js'],
      developer: {
        username: 'photo_editor',
        name: 'Photo Editor',
        profilePicture: null
      },
      likes: 1750,
      stars: 1234,
      status: 'Under development'
    },
    {
      id: 10,
      image: null,
      name: 'Weather Forecast',
      generalTags: ['Utility', 'Weather', 'API'],
      programmingTags: ['Vue.js', 'JavaScript', 'Weather API', 'CSS'],
      developer: {
        username: 'weather_guru',
        name: 'Weather Guru',
        profilePicture: null
      },
      likes: 890,
      stars: 654,
      status: 'Only an Idea'
    },
    {
      id: 11,
      image: null,
      name: 'Recipe Sharing Platform',
      generalTags: ['Food', 'Social', 'Sharing'],
      programmingTags: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind'],
      developer: {
        username: 'chef_dev',
        name: 'Chef Developer',
        profilePicture: null
      },
      likes: 567,
      stars: 432,
      status: 'Under development'
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
      stars: 589,
      status: 'Ready for production'
    }
  ]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('none'); // 'none', 'most-liked', 'most-starred'

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.developer.username.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort projects
    if (sortBy === 'most-liked') {
      filtered.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'most-starred') {
      filtered.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    }
    // If sortBy is 'none', keep original order (no sorting)

    return filtered;
  }, [projects, searchQuery, selectedStatus, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSortBy('none');
  };

  return (
    <div className="browse-container">
      <Sidebar />
      <main className="browse-main">
        <div className="browse-content">
          <h1 className="browse-title">Browse Ideas</h1>
          
          {/* Filters Section */}
          <div className="filters-section">
            {/* Search */}
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search projects, developers..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">Status:</label>
              <div className="filter-buttons">
                {['all', 'Ready for production', 'Under development', 'Only an Idea'].map(status => (
                  <button
                    key={status}
                    className={`filter-button ${selectedStatus === status ? 'active' : ''}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <div className="filter-buttons">
                <button
                  className={`filter-button ${sortBy === 'none' ? 'active' : ''}`}
                  onClick={() => setSortBy('none')}
                >
                  None
                </button>
                <button
                  className={`filter-button ${sortBy === 'most-liked' ? 'active' : ''}`}
                  onClick={() => setSortBy('most-liked')}
                >
                  Most Liked
                </button>
                <button
                  className={`filter-button ${sortBy === 'most-starred' ? 'active' : ''}`}
                  onClick={() => setSortBy('most-starred')}
                >
                  Most Starred
                </button>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedStatus !== 'all' || sortBy !== 'none') && (
              <button className="clear-filters-button" onClick={handleClearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="results-count">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <Link 
                key={project.id} 
                to={`/dev/${project.developer.username}`}
                className="project-mini-card"
              >
                <div className="mini-card-image">
                  {project.image ? (
                    <img src={project.image} alt={project.name} />
                  ) : (
                    <div className="mini-card-image-placeholder">
                      <span>{project.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="mini-card-status">
                    <span className={`status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="mini-card-content">
                  <div className="mini-card-header">
                    <h3 className="mini-card-name">{project.name}</h3>
                    <button 
                      className="mini-card-message-button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // TODO: Open message dialog or navigate to messages
                      }}
                      aria-label="Send Message"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="mini-card-developer">
                    {project.developer.profilePicture ? (
                      <img
                        src={project.developer.profilePicture}
                        alt={project.developer.name}
                        className="mini-card-dev-pfp"
                      />
                    ) : (
                      <div className="mini-card-dev-pfp-placeholder">
                        <span>{project.developer.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="mini-card-dev-name">@{project.developer.username}</span>
                  </div>
                  <div className="mini-card-stats">
                    <div className="mini-card-likes">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>{formatNumber(project.likes)}</span>
                    </div>
                    <div className="mini-card-stars">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>{formatNumber(project.stars || 0)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="no-results">
              <p>No projects found matching your filters.</p>
              <button className="clear-filters-button" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;

