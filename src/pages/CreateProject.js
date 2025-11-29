import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import './CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    general_tags: [],
    programming_tags: [],
    status: 'Only an Idea',
    images: []
  });
  const [tagInput, setTagInput] = useState({
    general: '',
    programming: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate project code whenever name changes
  React.useEffect(() => {
    if (formData.name.trim()) {
      generateProjectCode();
    } else {
      setFormData(prev => ({ ...prev, code: '' }));
    }
  }, [formData.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const projectStatuses = [
    'Only an Idea',
    'Under Development',
    'Ready for Production'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGeneralTag = (e) => {
    e.preventDefault();
    if (tagInput.general.trim() && !formData.general_tags.includes(tagInput.general.trim())) {
      setFormData(prev => ({
        ...prev,
        general_tags: [...prev.general_tags, tagInput.general.trim()]
      }));
      setTagInput(prev => ({ ...prev, general: '' }));
    }
  };

  const handleAddProgrammingTag = (e) => {
    e.preventDefault();
    if (tagInput.programming.trim() && !formData.programming_tags.includes(tagInput.programming.trim())) {
      setFormData(prev => ({
        ...prev,
        programming_tags: [...prev.programming_tags, tagInput.programming.trim()]
      }));
      setTagInput(prev => ({ ...prev, programming: '' }));
    }
  };

  const handleRemoveGeneralTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      general_tags: prev.general_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleRemoveProgrammingTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      programming_tags: prev.programming_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 9) {
      setError('Maximum 9 images allowed');
      return;
    }

    // Convert files to Base64 strings
    const readFiles = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFiles)
      .then(base64Files => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...base64Files]
        }));
      })
      .catch(err => {
        console.error('Failed to read files', err);
        setError('Failed to read images');
      });
  };


  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const generateProjectCode = () => {
    const baseCode = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    // Add a random suffix to make it unique
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const generatedCode = `${baseCode}-${randomSuffix}`;
    
    setFormData(prev => ({ ...prev, code: generatedCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const projectData = {
        ...formData,
        user_id: user?.id,
        // Only send Base64 strings
        images: formData.images
      };

      const response = await api.createProject(projectData);

      if (response && response.code) {
        navigate(`/dev/${user?.username || 'username'}/${response.code}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="create-project-container">
      <div className="create-project-header">
        <h1>Create New Project</h1>
        <p>Share your amazing project with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your project name"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe your project in detail..."
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Project Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-select"
            >
              {projectStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Project Code</label>
            <div className="code-display">
              <span className="code-value">
                {formData.code || 'project-code-will-appear-here'}
              </span>
              <small className="form-help">This will be used in the URL: /dev/{user?.username || 'username'}/{formData.code || 'project-code'}</small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Project Images</h2>
          
          <div className="form-group">
            <label>Images ({formData.images.length}/9)</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="image-input"
                disabled={formData.images.length >= 9}
              />
              <label 
                htmlFor="images" 
                className={`image-upload-label ${formData.images.length >= 9 ? 'disabled' : ''}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Click to upload images</span>
                <small>Support: JPG, PNG, GIF (Max 9 images)</small>
              </label>
            </div>
            
            {formData.images.length > 0 && (
              <div className="images-preview">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={image.preview} alt={image.name} />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="remove-image-btn"
                      title="Remove image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    <div className="image-name">{image.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Tags</h2>
          
          <div className="form-group">
            <label>General Tags</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={tagInput.general}
                onChange={(e) => setTagInput(prev => ({ ...prev, general: e.target.value }))}
                placeholder="Add general tag (e.g., Innovation, Startup)"
                className="form-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddGeneralTag(e)}
              />
              <button
                type="button"
                onClick={handleAddGeneralTag}
                className="add-tag-btn"
                disabled={!tagInput.general.trim()}
              >
                Add
              </button>
            </div>
            <div className="tags-container">
              {formData.general_tags.map((tag, index) => (
                <span key={index} className="tag general-tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveGeneralTag(tag)}
                    className="remove-tag-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Programming Tags</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={tagInput.programming}
                onChange={(e) => setTagInput(prev => ({ ...prev, programming: e.target.value }))}
                placeholder="Add programming tag (e.g., React, Node.js)"
                className="form-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddProgrammingTag(e)}
              />
              <button
                type="button"
                onClick={handleAddProgrammingTag}
                className="add-tag-btn"
                disabled={!tagInput.programming.trim()}
              >
                Add
              </button>
            </div>
            <div className="tags-container">
              {formData.programming_tags.map((tag, index) => (
                <span key={index} className="tag programming-tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveProgrammingTag(tag)}
                    className="remove-tag-btn"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !formData.name.trim() || !formData.description.trim() || !formData.code.trim()}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
