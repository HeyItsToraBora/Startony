import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { formatNumber } from '../utils/formatNumber';
import { api } from '../api/api';
import './Browse.css';

const Browse = () => {
  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('none'); // 'none', 'most-liked', 'most-starred'

  // Fetch all projects
  const fetchAllProjects = async () => {
    try {
      setProjectsLoading(true);
      setProjectsError(null);
      const response = await api.getAllProjects();
      console.log('API Response:', response); // Debug log
      setProjects(response || []); // Changed from response.data to response
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError('Failed to load projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.developer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.developer?.username?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort projects
    if (sortBy === 'most-liked') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
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
                  All
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
            {projectsLoading ? 'Loading projects...' : `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`}
          </div>

          {/* Projects Grid */}
          {projectsLoading ? (
            <div className="loading-projects">Loading projects...</div>
          ) : projectsError ? (
            <div className="error-message">
              <p>{projectsError}</p>
              <button className="retry-button" onClick={fetchAllProjects}>
                Retry
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <Link 
                  key={project.id} 
                  to={`/dev/${project.developer?.username || 'unknown'}/${project.code}`}
                  className="project-mini-card"
                >
                  <div className="mini-card-image">
                    {project.images && project.images.length > 0 ? (
                      <img src={project.images[0]} alt={project.name} />
                    ) : (
                      <div className="mini-card-image-placeholder">
                        <span>{project.name?.charAt(0) || '?'}</span>
                      </div>
                    )}
                    <div className="mini-card-status">
                      <span className={`status-badge status-${project.status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`}>
                        {project.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="mini-card-content">
                    <div className="mini-card-header">
                      <h3 className="mini-card-name">{project.name || 'Untitled Project'}</h3>
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
                      {project.developer?.profile_picture ? (
                        <img
                          src={project.developer.profile_picture}
                          alt={project.developer?.name || 'Developer'}
                          className="mini-card-dev-pfp"
                        />
                      ) : (
                        <div className="mini-card-dev-pfp-placeholder">
                          <span>{(
                            (project.developer?.first_name && project.developer?.last_name) 
                              ? `${project.developer.first_name.charAt(0)}${project.developer.last_name.charAt(0)}`
                              : (project.developer?.name || project.developer?.username || '?').charAt(0).toUpperCase()
                          )}</span>
                        </div>
                      )}
                      <span className="mini-card-dev-name">@{project.developer?.username || 'unknown'}</span>
                    </div>
                    <div className="mini-card-stats">
                      <div className="mini-card-likes">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span>{formatNumber(project.likes || 0)}</span>
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
          )}

          {!projectsLoading && !projectsError && filteredProjects.length === 0 && (
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

