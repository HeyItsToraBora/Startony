import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Notifications.css';

const Notifications = () => {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: {
        username: 'john_doe',
        name: 'John Doe',
        profilePicture: null
      },
      project: {
        name: 'E-Commerce Platform',
        id: 1
      },
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'star',
      user: {
        username: 'jane_smith',
        name: 'Jane Smith',
        profilePicture: null
      },
      project: {
        name: 'Social Media Dashboard',
        id: 2
      },
      timestamp: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: {
        username: 'alex_dev',
        name: 'Alex Developer',
        profilePicture: null
      },
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 4,
      type: 'comment',
      user: {
        username: 'sarah_wilson',
        name: 'Sarah Wilson',
        profilePicture: null
      },
      project: {
        name: 'Task Management App',
        id: 3
      },
      comment: 'This looks amazing! Great work!',
      timestamp: '3 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'like',
      user: {
        username: 'mike_brown',
        name: 'Mike Brown',
        profilePicture: null
      },
      project: {
        name: 'Learning Management System',
        id: 5
      },
      timestamp: '5 hours ago',
      read: true
    },
    {
      id: 6,
      type: 'star',
      user: {
        username: 'ai_dev',
        name: 'AI Developer',
        profilePicture: null
      },
      project: {
        name: 'AI Chat Assistant',
        id: 6
      },
      timestamp: '1 day ago',
      read: true
    },
    {
      id: 7,
      type: 'follow',
      user: {
        username: 'crypto_master',
        name: 'Crypto Master',
        profilePicture: null
      },
      timestamp: '2 days ago',
      read: true
    },
    {
      id: 8,
      type: 'like',
      user: {
        username: 'music_dev',
        name: 'Music Dev',
        profilePicture: null
      },
      project: {
        name: 'Music Streaming App',
        id: 8
      },
      timestamp: '3 days ago',
      read: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        );
      case 'star':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'follow':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="8.5" cy="7" r="4"></circle>
            <line x1="20" y1="8" x2="20" y2="14"></line>
            <line x1="23" y1="11" x2="17" y2="11"></line>
          </svg>
        );
      case 'comment':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <>
            <Link to={`/dev/${notification.user.username}`} className="notification-user-link">
              {notification.user.name}
            </Link>
            {' liked your project '}
            <span className="notification-project-name">{notification.project.name}</span>
          </>
        );
      case 'star':
        return (
          <>
            <Link to={`/dev/${notification.user.username}`} className="notification-user-link">
              {notification.user.name}
            </Link>
            {' starred your project '}
            <span className="notification-project-name">{notification.project.name}</span>
          </>
        );
      case 'follow':
        return (
          <>
            <Link to={`/dev/${notification.user.username}`} className="notification-user-link">
              {notification.user.name}
            </Link>
            {' started following you'}
          </>
        );
      case 'comment':
        return (
          <>
            <Link to={`/dev/${notification.user.username}`} className="notification-user-link">
              {notification.user.name}
            </Link>
            {' commented on your project '}
            <span className="notification-project-name">{notification.project.name}</span>
            {': "'}
            <span className="notification-comment">{notification.comment}</span>
            {'"'}
          </>
        );
      default:
        return null;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'like':
        return '#ef4444';
      case 'star':
        return '#ffd700';
      case 'follow':
        return '#667eea';
      case 'comment':
        return '#22c55e';
      default:
        return '#8b8b8b';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <Sidebar />
      <main className="notifications-main">
        <div className="notifications-content">
          <div className="notifications-header">
            <h1 className="notifications-title">Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} new</span>
            )}
          </div>

          <div className="notifications-list">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon-wrapper" style={{ backgroundColor: `${getNotificationColor(notification.type)}20`, color: getNotificationColor(notification.type) }}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-text">
                    {getNotificationText(notification)}
                  </div>
                  <div className="notification-meta">
                    <span className="notification-timestamp">{notification.timestamp}</span>
                    {notification.project && (
                      <Link 
                        to={`/dev/${notification.user.username}`}
                        className="notification-view-link"
                      >
                        View project →
                      </Link>
                    )}
                  </div>
                </div>
                {notification.user.profilePicture ? (
                  <img
                    src={notification.user.profilePicture}
                    alt={notification.user.name}
                    className="notification-user-pfp"
                  />
                ) : (
                  <div className="notification-user-pfp-placeholder">
                    <span>{notification.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="no-notifications">
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;

