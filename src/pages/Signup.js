import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [userType, setUserType] = useState('developer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    githubLink: '',
    password: '',
    confirmPassword: '',
    linkedinLink: '',
    portfolioLink: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    // Reset form when switching user types
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      githubLink: '',
      password: '',
      confirmPassword: '',
      linkedinLink: '',
      portfolioLink: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call for signup
    console.log('Signup data:', { userType, ...formData });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="logo-placeholder">
          <div className="logo-box">
            {/* Logo space - replace with your logo */}
            <span className="logo-text">LOGO</span>
          </div>
        </div>

        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Join us as a {userType === 'developer' ? 'Developer' : 'Entrepreneur/Investor'}</p>

        <div className="user-type-selector">
          <button
            type="button"
            className={`type-button ${userType === 'developer' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('developer')}
          >
            Developer
          </button>
          <button
            type="button"
            className={`type-button ${userType === 'entrepreneur' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('entrepreneur')}
          >
            Entrepreneur/Investor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {userType === 'developer' && (
            <>
              <div className="form-group">
                <label htmlFor="githubLink">GitHub Link</label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="portfolioLink">Portfolio Link</label>
                <input
                  type="url"
                  id="portfolioLink"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </>
          )}

          {userType === 'entrepreneur' && (
            <div className="form-group">
              <label htmlFor="linkedinLink">LinkedIn Link</label>
              <input
                type="url"
                id="linkedinLink"
                name="linkedinLink"
                value={formData.linkedinLink}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="terms-checkbox">
            <label>
              <input type="checkbox" required />
              <span>I agree to the Terms and Conditions and Privacy Policy</span>
            </label>
          </div>

          <button type="submit" className="submit-button">
            Create Account
          </button>

          <div className="login-link">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

