import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DeveloperProfile from './pages/DeveloperProfile';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Notifications from './pages/Notifications';
import Starred from './pages/Starred';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dev/:username" element={<DeveloperProfile />} />
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/starred" element={<Starred />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

