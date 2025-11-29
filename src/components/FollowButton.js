import React, { useState } from 'react';
import { api } from '../api/api';
import './FollowButton.css';

const FollowButton = ({ username, isFollowing, onUpdate, size = 'medium' }) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowToggle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (following) {
        await api.unfollowUser(username);
        setFollowing(false);
      } else {
        await api.followUser(username);
        setFollowing(true);
      }
      
      // Notify parent component of the change
      if (onUpdate) {
        onUpdate({
          isFollowing: !following
        });
      }
    } catch (error) {
      console.error('Follow/unfollow error:', error);
      // Revert state on error
      setFollowing(following);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`follow-button ${following ? 'following' : ''} ${size}`}
      onClick={handleFollowToggle}
      disabled={loading}
    >
      {loading ? (
        <span className="loading-text">...</span>
      ) : following ? (
        'Following'
      ) : (
        'Follow'
      )}
    </button>
  );
};

export default FollowButton;
