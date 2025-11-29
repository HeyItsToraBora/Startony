const BASE_URL = 'http://localhost:8080';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Common headers with authorization
const getHeaders = () => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }
    const data = await response.json();
    // Save token and user data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  signup: async (userData) => {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }
    const data = await response.json();
    // Save token and user data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Logout failed');
    }
    // Clear token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.json();
  },

  validateToken: async () => {
    const response = await fetch(`${BASE_URL}/validate`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Token validation failed');
    }
    return response.json();
  },

  getUserProfile: async (username) => {
    const response = await fetch(`${BASE_URL}/dev/${username}`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch user profile');
    }
    return response.json();
  },

  getUserProjects: async (username) => {
    const response = await fetch(`${BASE_URL}/dev/${username}/projects`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch user projects');
    }
    return response.json();
  },

  getProjectDetail: async (username, projectName) => {
    const response = await fetch(`${BASE_URL}/dev/${username}/${projectName}`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to fetch project detail');
    }
    return response.json();
  },

  followUser: async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}/follow`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to follow user');
    }
    return response.json();
  },

  unfollowUser: async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}/unfollow`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to unfollow user');
    }
    return response.json();
  },

  checkFollowStatus: async (username) => {
    const response = await fetch(`${BASE_URL}/users/${username}/follow/status`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to check follow status');
    }
    return response.json();
  },

  updateProfile: async (formData) => {
    console.log('API: Updating profile with FormData');
    
    // Log FormData contents (since it can't be directly logged)
    for (let [key, value] of formData.entries()) {
      console.log(`API: FormData ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    try {
      const response = await fetch(`${BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      console.log('API: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API: Error response:', errorText);
        throw new Error(errorText || 'Failed to update profile');
      }
      
      const data = await response.json();
      console.log('API: Success response:', data);
      return data;
    } catch (error) {
      console.error('API: Update profile error:', error);
      throw error;
    }
  },

  getProjects: async () => {
    const response = await fetch(`${BASE_URL}/projects`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },

  getAllProjects: async () => {
    const response = await fetch(`${BASE_URL}/projects`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch all projects');
    }
    return response.json();
  },

  createProject: async (projectData) => {
    console.log('API: Creating project with data:', projectData);
    
    try {
      const response = await fetch(`${BASE_URL}/projects/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(projectData)
      });
      
      console.log('API: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API: Error response:', errorText);
        throw new Error(errorText || 'Failed to create project');
      }
      
      const data = await response.json();
      console.log('API: Project created successfully:', data);
      return data;
    } catch (error) {
      console.error('API: Create project error:', error);
      throw error;
    }
  },

  // Saved Projects
  getSavedProjects: async () => {
    const response = await fetch(`${BASE_URL}/projects/saved`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch saved projects');
    }
    return response.json();
  },

  saveProject: async (projectId) => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/save`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to save project');
    }
    return response.json();
  },

  unsaveProject: async (projectId) => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/save`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to unsave project');
    }
    return response.json();
  },
};
