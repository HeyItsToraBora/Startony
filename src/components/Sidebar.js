import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Debug: Log user data
  useEffect(() => {
    console.log('Sidebar user data:', user);
  }, [user]);

  const menuItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      iconFilled: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
      path: '/home' 
    },
    { 
      id: 'browse', 
      label: 'Browse ideas', 
      icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      iconFilled: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
      path: '/browse' 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      iconFilled: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
      path: '/notifications' 
    },
    { 
      id: 'saved', 
      label: 'Saved Projects', 
      icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
      iconFilled: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
      path: '/saved' 
    },
    { 
      id: 'starred', 
      label: 'Starred', 
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      iconFilled: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      path: '/starred' 
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      iconFilled: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      path: `/dev/${user?.username || 'profile'}` 
    }
  ];

  const isActive = (path) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    // For profile, check if we're on the exact profile path
    if (path.startsWith('/dev/')) {
      return location.pathname === path;
    }
    // Don't mark other items as active if we're on a dev profile page
    if (location.pathname.startsWith('/dev/')) {
      return false;
    }
    return location.pathname.startsWith(path);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSettings = () => {
    // Navigate to settings page (you can create this route later)
    window.location.href = '/settings';
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          // All icons should always be outline, never filled, but still get active styling (transparent boxes)
          const useFilled = false;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${active ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper">
                <svg
                  className="nav-icon"
                  fill={useFilled ? "currentColor" : "none"}
                  stroke={useFilled ? "none" : "currentColor"}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap={useFilled ? "none" : "round"}
                    strokeLinejoin={useFilled ? "none" : "round"}
                    strokeWidth={useFilled ? 0 : 2}
                    fillRule={useFilled ? "evenodd" : undefined}
                    clipRule={useFilled ? "evenodd" : undefined}
                    d={useFilled ? item.iconFilled : item.icon}
                  />
                </svg>
              </div>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="sidebar-profile" ref={dropdownRef}>
        <div className="profile-container" onClick={handleProfileClick}>
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className="profile-pic-small"
            />
          ) : (
            <div className="profile-pic-small-placeholder">
              <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
            </div>
          )}
          <div className="profile-info-small">
            <p className="profile-name-small">
              {(user?.first_name && user?.last_name) 
                ? `${user.first_name} ${user.last_name}` 
                : user?.username || 'User'}
            </p>
            <p className="profile-username-small">@{user?.username || 'user'}</p>
          </div>
        </div>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="profile-dropdown">
            <div className="dropdown-item" onClick={handleSettings}>
              <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Settings</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item logout-item" onClick={handleLogout}>
              <svg className="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Log out</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

