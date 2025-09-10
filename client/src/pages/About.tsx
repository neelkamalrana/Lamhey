import React from 'react';
import { getCognitoHostedUIUrl } from '../config/cognito';

const About: React.FC = () => {
  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">Lamhey</h1>
        <nav className="nav">
          <a href="/about" className="nav-link active">About</a>
          <a href="/auth" className="nav-link" onClick={(e) => { 
            e.preventDefault(); 
            const url = getCognitoHostedUIUrl();
            if (url) {
              window.location.href = url;
            }
          }}>Login/SignUp</a>
        </nav>
      </header>

      <main className="main">
        <div className="hero">
          <h2 className="hero-title">About Lamhey</h2>
          <p className="hero-description">
            Learn more about our application and the team behind it
          </p>
        </div>

        {/* About the App Section */}
        <section className="about-section">
          <h3 className="section-title">About the Application</h3>
          <div className="about-content">
            <div className="about-card">
              <h4>What is Lamhey?</h4>
              <p>
                Lamhey is a modern web application designed to provide users with a seamless experience 
                for managing their digital content. Built with cutting-edge technologies including React, 
                Node.js, and AWS services, Lamhey offers a robust platform for photo management, 
                content sharing, and collaborative features.
              </p>
              <p>
                Our application is specifically optimized for cloud deployment on AWS EC2, ensuring 
                high availability, scalability, and security for all our users. Whether you're an 
                individual looking to organize your photos or a team needing collaborative tools, 
                Lamhey provides the perfect solution.
              </p>
            </div>

            <div className="about-card">
              <h4>Key Features</h4>
              <ul className="feature-list">
                <li>🔐 Secure authentication with Amazon Cognito</li>
                <li>📸 Advanced photo upload and management</li>
                <li>☁️ Cloud storage integration with AWS S3</li>
                <li>👥 User collaboration and sharing</li>
                <li>📱 Responsive design for all devices</li>
                <li>🚀 Fast and reliable performance</li>
                <li>🔒 Enterprise-grade security</li>
                <li>📊 Real-time analytics and insights</li>
              </ul>
            </div>

            <div className="about-card">
              <h4>Technology Stack</h4>
              <div className="tech-grid">
                <div className="tech-item">
                  <strong>Frontend:</strong> React 18, TypeScript, Custom CSS
                </div>
                <div className="tech-item">
                  <strong>Backend:</strong> Node.js, Express.js, RESTful APIs
                </div>
                <div className="tech-item">
                  <strong>Authentication:</strong> Amazon Cognito
                </div>
                <div className="tech-item">
                  <strong>Storage:</strong> AWS S3, CloudFront CDN
                </div>
                <div className="tech-item">
                  <strong>Deployment:</strong> AWS EC2, Docker, Nginx
                </div>
                <div className="tech-item">
                  <strong>CI/CD:</strong> GitHub Actions, Automated Deployment
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About the Developer Section */}
        <section className="about-section">
          <h3 className="section-title">About the Developer</h3>
          <div className="about-content">
            <div className="about-card developer-card">
              <div className="developer-info">
                <div className="developer-avatar">
                  <span className="avatar-text">👨‍💻</span>
                </div>
                <div className="developer-details">
                  <h4>Neel Kamal Rana</h4>
                  <p className="developer-title">Full Stack Developer & AWS Solutions Architect</p>
                  <p className="developer-bio">
                    Passionate about building scalable web applications and cloud solutions. 
                    With expertise in modern JavaScript frameworks, cloud architecture, and 
                    DevOps practices, I create applications that are not just functional but 
                    also performant and user-friendly.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-card">
              <h4>Skills & Expertise</h4>
              <div className="skills-grid">
                <div className="skill-category">
                  <h5>Frontend Development</h5>
                  <ul>
                    <li>React, TypeScript, JavaScript (ES6+)</li>
                    <li>HTML5, CSS3, Responsive Design</li>
                    <li>State Management (Redux, Context API)</li>
                    <li>Testing (Jest, React Testing Library)</li>
                  </ul>
                </div>
                <div className="skill-category">
                  <h5>Backend Development</h5>
                  <ul>
                    <li>Node.js, Express.js, RESTful APIs</li>
                    <li>Database Design (SQL, NoSQL)</li>
                    <li>Authentication & Authorization</li>
                    <li>Microservices Architecture</li>
                  </ul>
                </div>
                <div className="skill-category">
                  <h5>Cloud & DevOps</h5>
                  <ul>
                    <li>AWS (EC2, S3, Cognito, Lambda)</li>
                    <li>Docker, Kubernetes</li>
                    <li>CI/CD Pipelines</li>
                    <li>Infrastructure as Code</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="about-card">
              <h4>Contact & Links</h4>
              <div className="contact-links">
                <a href="mailto:nkrneelkamalrana@gmail.com" className="contact-link">
                  📧 nkrneelkamalrana@gmail.com
                </a>
                <a href="https://github.com/neelkamalrana" className="contact-link" target="_blank" rel="noopener noreferrer">
                  🐙 GitHub Profile
                </a>
                <a href="https://linkedin.com/in/neelkamalrana" className="contact-link" target="_blank" rel="noopener noreferrer">
                  💼 LinkedIn Profile
                </a>
                <a href="https://portfolio.neelkamalrana.com" className="contact-link" target="_blank" rel="noopener noreferrer">
                  🌐 Portfolio Website
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Lamhey. Built by Neelkamal Rana.</p>
      </footer>
    </div>
  );
};

export default About;
