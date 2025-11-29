import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { formatNumber } from '../utils/formatNumber';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { username, project } = useParams();

  // Sample project data - in a real app, this would come from an API
  const projectData = {
    code: project || '1989386698686439464',
    name: 'E-Commerce Platform',
    description: 'A modern e-commerce platform built with React and Node.js. Features include user authentication, product catalog, shopping cart, and payment integration. This project demonstrates full-stack development with modern technologies and best practices.',
    detailedExplanation: 'This comprehensive e-commerce platform revolutionizes online shopping by providing a seamless and intuitive user experience. Built with cutting-edge technologies, the platform offers robust features including advanced product search and filtering, real-time inventory management, secure payment processing with multiple payment gateways, order tracking, and customer review systems.\n\nThe platform is designed with scalability in mind, handling thousands of concurrent users while maintaining fast load times. The responsive design ensures a flawless experience across all devices - from mobile phones to desktop computers. Advanced security measures are implemented to protect user data and transactions, including SSL encryption, secure authentication, and fraud detection systems.\n\nKey technical innovations include a microservices architecture for better performance and maintainability, RESTful API design for easy third-party integrations, and comprehensive analytics dashboard for business insights. The platform supports multiple languages and currencies, making it suitable for global markets.',
    businessModel: 'The platform operates on a multi-revenue stream business model:\n\n1. **Transaction Fees**: A small percentage (2-3%) is charged on each successful transaction processed through the platform. This provides a steady revenue stream that scales with platform usage.\n\n2. **Subscription Plans**: Merchants can choose from tiered subscription plans (Basic, Pro, Enterprise) with different features and limits. Higher tiers include advanced analytics, priority support, and custom integrations.\n\n3. **Premium Features**: Additional revenue comes from premium features such as advanced marketing tools, custom storefront themes, API access, and white-label solutions.\n\n4. **Advertising**: Sponsored product placements and banner advertisements provide additional income, while helping merchants increase visibility for their products.\n\n5. **Commission on Sales**: For marketplace model, the platform takes a commission on each sale, providing a win-win situation for both the platform and merchants.\n\nThe business model is designed to be sustainable and scalable, with low overhead costs and high profit margins as the user base grows. The platform aims to break even within the first year and become profitable by year two.',
    video: null, // Video URL or embed code
    photos: [
      null, // Photo URL
      null, // Photo URL
      null, // Photo URL
      null, // Photo URL
    ],
    image: null,
    generalTags: ['E-Commerce', 'Business', 'Retail'],
    programmingTags: ['React', 'Node.js', 'MongoDB', 'Express'],
    developer: {
      username: username || 'john_doe',
      name: 'John Doe',
      profilePicture: null
    },
    likes: 245,
    stars: 189,
    status: 'Ready for production',
    createdAt: 'January 2024',
    updatedAt: '2 days ago'
  };

  const handleDownload = (format) => {
    // In a real app, this would call an API endpoint to generate/download the file
    // Example: window.open(`/api/projects/${project}/business-model.${format}`, '_blank');
    
    // For now, create a simple download link
    const fileName = `${projectData.name.replace(/\s+/g, '_')}_Business_Model.${format}`;
    const url = `/api/projects/${projectData.code}/business-model.${format}`;
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // In a production environment, you would:
    // 1. Call your backend API endpoint (e.g., fetch(`/api/projects/${projectData.code}/business-model/${format}`))
    // 2. The backend would generate the PDF/PPTX file using libraries like pdfkit, puppeteer (for PDF) or pptxgenjs (for PPTX)
    // 3. Return the file as a blob response
    // 4. Create a download link with the blob URL:
    //    fetch(url)
    //      .then(response => response.blob())
    //      .then(blob => {
    //        const url = window.URL.createObjectURL(blob);
    //        const link = document.createElement('a');
    //        link.href = url;
    //        link.download = fileName;
    //        link.click();
    //        window.URL.revokeObjectURL(url);
    //      });
    
    console.log(`Downloading business model as ${format.toUpperCase()} for project: ${projectData.name}`);
  };

  return (
    <div className="project-detail-container">
      <Sidebar />
      <main className="project-detail-main">
        <div className="project-detail-content">
          {/* Project Header */}
          <div className="project-detail-header">
            <div className="project-header-info">
              <div className="project-title-row">
                <h1 className="project-detail-name">{projectData.name}</h1>
                <span className={`project-status status-${projectData.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {projectData.status}
                </span>
              </div>
              <div className="project-detail-developer">
                <Link to={`/dev/${projectData.developer.username}`} className="developer-link">
                  {projectData.developer.profilePicture ? (
                    <img
                      src={projectData.developer.profilePicture}
                      alt={projectData.developer.name}
                      className="developer-pfp"
                    />
                  ) : (
                    <div className="developer-pfp-placeholder">
                      <span>{projectData.developer.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="developer-info">
                    <span className="developer-name">{projectData.developer.name}</span>
                    <span className="developer-username">@{projectData.developer.username}</span>
                  </div>
                </Link>
              </div>
              <p className="project-detail-description">{projectData.description}</p>
              <div className="project-detail-tags">
                <div className="tags-group">
                  <span className="tags-label">General:</span>
                  <div className="tags-container">
                    {projectData.generalTags.map((tag, index) => (
                      <span key={index} className="tag general-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="tags-group">
                  <span className="tags-label">Tech:</span>
                  <div className="tags-container">
                    {projectData.programmingTags.map((tag, index) => (
                      <span key={index} className="tag programming-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="project-detail-stats">
                <div className="stat-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{formatNumber(projectData.likes)} likes</span>
                </div>
                <div className="stat-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>{formatNumber(projectData.stars)} stars</span>
                </div>
                <div className="stat-item">
                  <span>Created {projectData.createdAt}</span>
                </div>
                <div className="stat-item">
                  <span>Updated {projectData.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Content - Video, Photos, Detailed Explanation, Business Model */}
          <div className="project-detail-body">
            {/* Video Section */}
            {projectData.video && (
              <div className="media-section">
                <h2 className="section-title">Video</h2>
                <div className="video-container">
                  {projectData.video.startsWith('http') ? (
                    <iframe
                      src={projectData.video}
                      title="Project Video"
                      className="project-video"
                      allowFullScreen
                    />
                  ) : (
                    <video controls className="project-video">
                      <source src={projectData.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            )}

            {/* Photos Section */}
            {projectData.photos && projectData.photos.length > 0 && projectData.photos.some(photo => photo !== null) && (
              <div className="media-section">
                <h2 className="section-title">Photos</h2>
                <div className="photos-grid">
                  {projectData.photos.map((photo, index) => (
                    photo && (
                      <div key={index} className="photo-item">
                        <img src={photo} alt={`${projectData.name} - Photo ${index + 1}`} />
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Photo Placeholder if no photos */}
            {(!projectData.photos || projectData.photos.every(photo => photo === null)) && (
              <div className="media-section">
                <h2 className="section-title">Photos</h2>
                <div className="photos-grid">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="photo-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Photo {index}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Explanation Section */}
            <div className="content-section">
              <h2 className="section-title">Detailed Explanation</h2>
              <div className="section-content">
                {projectData.detailedExplanation.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="explanation-paragraph">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>

            {/* Business Model Section */}
            <div className="content-section">
              <div className="section-header">
                <h2 className="section-title">Business Model</h2>
                <div className="download-buttons">
                  <button 
                    className="download-button pdf-button"
                    onClick={() => handleDownload('pdf')}
                    aria-label="Download Business Model as PDF"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Download PDF</span>
                  </button>
                  <button 
                    className="download-button pptx-button"
                    onClick={() => handleDownload('pptx')}
                    aria-label="Download Business Model as PPTX"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Download PPTX</span>
                  </button>
                </div>
              </div>
              <div className="section-content">
                {projectData.businessModel.split('\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  
                  // Check if paragraph is a heading (starts with **)
                  if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                    return (
                      <h3 key={index} className="business-model-heading">
                        {paragraph.trim().replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  
                  // Check if paragraph is a list item (starts with number)
                  if (/^\d+\./.test(paragraph.trim())) {
                    return (
                      <div key={index} className="business-model-item">
                        <span className="item-number">{paragraph.match(/^\d+/)[0]}</span>
                        <span className="item-text">{paragraph.replace(/^\d+\.\s*\*\*/, '').replace(/\*\*/g, '')}</span>
                      </div>
                    );
                  }
                  
                  return (
                    <p key={index} className="business-model-paragraph">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;

