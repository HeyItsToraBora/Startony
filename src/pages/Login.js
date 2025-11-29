import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      console.log('Login success');
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-placeholder">
          <div className="logo-box">
            <img 
              src="/assets/logo.svg" 
              alt="Startony Logo" 
              className="logo-image"
            />
          </div>
        </div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="submit-button">
            Sign In
          </button>

          <div className="signup-link">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

