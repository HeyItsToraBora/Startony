import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import TrendingProjects from '../components/TrendingProjects';
import './Home.css';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const handleReject = () => {
    handleNext();
  };

  const handleAccept = () => {
    handleNext();
  };

  if (loading) return <div className="home-loading">Loading projects...</div>;
  if (error) return <div className="home-error">{error}</div>;
  if (projects.length === 0) return <div className="home-empty">No projects found</div>;

  return (
    <div className="home-container">
      <Sidebar />
      {/* Main Content Area */}
      <main className="home-main">
        <div className="home-content">
          <ProjectCard
            project={projects[currentIndex]}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
      </main>
      <TrendingProjects />
    </div>
  );
};

export default Home;

