import React from 'react';
import { Link } from 'react-router-dom';
import { formatNumber } from '../utils/formatNumber';
import './TrendingProjects.css';

const TrendingProjects = () => {
  // Sample trending projects data
  const trendingProjects = [
    {
      id: 1,
      code: '6989386698686439469',
      name: 'AI Chat Assistant',
      developer: {
        username: 'ai_dev',
        name: 'AI Developer',
        profilePicture: null
      },
      likes: 1250,
      stars: 892
    },
    {
      id: 2,
      code: '7989386698686439470',
      name: 'Crypto Tracker',
      developer: {
        username: 'crypto_master',
        name: 'Crypto Master',
        profilePicture: null
      },
      likes: 980,
      stars: 756
    },
    {
      id: 3,
      code: '8989386698686439471',
      name: 'Music Streaming App',
      developer: {
        username: 'music_dev',
        name: 'Music Dev',
        profilePicture: null
      },
      likes: 2100,
      stars: 1543
    },
    {
      id: 4,
      code: '9989386698686439472',
      name: 'Photo Editor Pro',
      developer: {
        username: 'photo_editor',
        name: 'Photo Editor',
        profilePicture: null
      },
      likes: 1750,
      stars: 1234
    },
    {
      id: 5,
      code: '3989386698686439466',
      name: 'Task Manager Plus',
      developer: {
        username: 'task_pro',
        name: 'Task Pro',
        profilePicture: null
      },
      likes: 1450,
      stars: 987
    },
    {
      id: 6,
      code: '1989386698686439473',
      name: 'Weather Forecast',
      developer: {
        username: 'weather_guru',
        name: 'Weather Guru',
        profilePicture: null
      },
      likes: 890,
      stars: 654
    }
  ];

  return (
    <aside className="trending-projects">
      <h2 className="trending-title">Trending Projects</h2>
      <div className="trending-list">
        {trendingProjects.map((project, index) => (
          <Link
            key={project.id}
            to={`/dev/${project.developer.username}/${project.code}`}
            className="trending-item"
          >
            <div className="trending-rank">{index + 1}</div>
            <div className="trending-content">
              <h3 className="trending-project-name">{project.name}</h3>
              <div className="trending-developer">
                {project.developer.profilePicture ? (
                  <img
                    src={project.developer.profilePicture}
                    alt={project.developer.name}
                    className="trending-dev-pfp"
                  />
                ) : (
                  <div className="trending-dev-pfp-placeholder">
                    <span>{project.developer.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <span className="trending-dev-name">@{project.developer.username}</span>
              </div>
              <div className="trending-stats">
                <div className="trending-stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>{formatNumber(project.stars)}</span>
                </div>
                <div className="trending-stat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{formatNumber(project.likes)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default TrendingProjects;

