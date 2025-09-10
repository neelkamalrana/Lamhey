import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">Lamhey Dashboard</h1>
        <Navigation currentPage="dashboard" />
      </header>

      <main className="main">
        <div className="hero">
          <h2 className="hero-title">Welcome back, {user?.attributes?.name || 'User'}!</h2>
          <p className="hero-description">
            Manage your photos, explore features, and make the most of your Lamhey experience.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📸</div>
            <div className="stat-content">
              <h3>Photos</h3>
              <p className="stat-number">0</p>
              <p className="stat-label">Total uploaded</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <h3>Albums</h3>
              <p className="stat-number">0</p>
              <p className="stat-label">Created</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Shares</h3>
              <p className="stat-number">0</p>
              <p className="stat-label">Shared items</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-content">
              <h3>Storage</h3>
              <p className="stat-number">0 MB</p>
              <p className="stat-label">Used</p>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="features-section">
          <h3 className="section-title">What would you like to do?</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h4>Upload Photos</h4>
              <p>Upload and organize your photos with our advanced tools</p>
              <button className="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h4>Create Albums</h4>
              <p>Organize your photos into beautiful albums and collections</p>
              <button className="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h4>Search & Filter</h4>
              <p>Find your photos quickly with smart search and filters</p>
              <button className="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h4>Share & Collaborate</h4>
              <p>Share albums with friends and collaborate on projects</p>
              <button className="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h4>Edit Photos</h4>
              <p>Enhance your photos with built-in editing tools</p>
              <button className="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Analytics</h4>
              <p>Track your usage and get insights about your photos</p>
              <button className="btn btn-primary" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h3 className="section-title">Recent Activity</h3>
          <div className="activity-card">
            <div className="activity-item">
              <div className="activity-icon">🎉</div>
              <div className="activity-content">
                <h4>Welcome to Lamhey!</h4>
                <p>You've successfully signed in to your account</p>
                <span className="activity-time">Just now</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <h4>Account Created</h4>
                <p>Your Lamhey account has been set up successfully</p>
                <span className="activity-time">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Lamhey. Welcome to your personal dashboard!</p>
      </footer>
    </div>
  );
};

export default Dashboard;
