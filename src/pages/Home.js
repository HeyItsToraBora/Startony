import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import TrendingProjects from '../components/TrendingProjects';
import './Home.css';

const Home = () => {
  // 5 hardcoded projects - will loop through them
  const projects = [
    {
      id: 1,
      image: null,
      name: 'E-Commerce Platform',
      description: 'A modern e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, and payment integration.',
      generalTags: ['E-Commerce', 'Business', 'Retail'],
      programmingTags: ['React', 'Node.js', 'MongoDB', 'Express'],
      developer: {
        username: 'john_doe',
        name: 'John Doe',
        profilePicture: null
      },
      likes: 245,
      status: 'Ready for production'
    },
    {
      id: 2,
      image: null,
      name: 'Social Media Dashboard',
      description: 'A comprehensive social media management dashboard that allows users to schedule posts, analyze engagement metrics, and manage multiple social accounts from one place.',
      generalTags: ['Social Media', 'Analytics', 'Marketing'],
      programmingTags: ['Vue.js', 'Python', 'PostgreSQL', 'Django'],
      developer: {
        username: 'jane_smith',
        name: 'Jane Smith',
        profilePicture: null
      },
      likes: 189,
      status: 'Under development'
    },
    {
      id: 3,
      image: null,
      name: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, team collaboration features, and project tracking capabilities.',
      generalTags: ['Productivity', 'Collaboration', 'Project Management'],
      programmingTags: ['Angular', 'TypeScript', 'Firebase', 'Material UI'],
      developer: {
        username: 'alex_dev',
        name: 'Alex Developer',
        profilePicture: null
      },
      likes: 312,
      status: 'Under development'
    },
    {
      id: 4,
      image: null,
      name: 'Fitness Tracking Platform',
      description: 'A fitness and health tracking platform that helps users monitor their workouts, nutrition, and progress towards fitness goals.',
      generalTags: ['Health', 'Fitness', 'Wellness'],
      programmingTags: ['React Native', 'GraphQL', 'MongoDB', 'Node.js'],
      developer: {
        username: 'sarah_wilson',
        name: 'Sarah Wilson',
        profilePicture: null
      },
      likes: 156,
      status: 'Only an Idea'
    },
    {
      id: 5,
      image: null,
      name: 'Learning Management System',
      description: 'An online learning platform that provides courses, quizzes, and certification programs for students and professionals.',
      generalTags: ['Education', 'E-Learning', 'Training'],
      programmingTags: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
      developer: {
        username: 'mike_brown',
        name: 'Mike Brown',
        profilePicture: null
      },
      likes: 428,
      status: 'Ready for production'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const handleReject = () => {
    // Same as next - move to next card
    handleNext();
  };

  const handleAccept = () => {
    // Same as next - move to next card
    handleNext();
  };

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

