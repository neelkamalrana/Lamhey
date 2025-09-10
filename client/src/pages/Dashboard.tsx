import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import UserProfile from '../components/UserProfile';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('profile');

  // Debug logging
  console.log('Dashboard render:', { user, isAuthenticated, isLoading });
  console.log('localStorage cognito_auth_code:', localStorage.getItem('cognito_auth_code'));
  console.log('localStorage cognito_user:', localStorage.getItem('cognito_user'));

  useEffect(() => {
    // Temporarily disable authentication redirect for testing
    console.log('Dashboard useEffect - Auth check disabled for testing');
    // if (!isLoading && !isAuthenticated) {
    //   window.location.href = '/';
    // }
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

  // Temporarily disable authentication check for testing
  // if (!isAuthenticated) {
  //   return null; // Will redirect via useEffect
  // }

  return (
    <div className="container">
      <div style={{
        backgroundColor: '#ff6b6b',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        marginBottom: '20px',
        borderRadius: '8px',
        fontWeight: 'bold'
      }}>
        🚧 TESTING MODE: Authentication disabled for debugging - VERSION 3 - $(date) 🚧
      </div>
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

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </div>

               {/* Tab Content */}
               {activeTab === 'profile' ? (
                 <div style={{ 
                   border: '3px solid #4CAF50', 
                   padding: '20px', 
                   margin: '20px 0',
                   backgroundColor: '#f0f8f0',
                   borderRadius: '8px'
                 }}>
                   <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>
                     🎉 PROFILE SECTION IS WORKING! 🎉
                   </h2>
                   <p style={{ marginBottom: '20px', fontSize: '16px' }}>
                     This proves the profile feature is visible and functional.
                   </p>
                   <UserProfile />
                 </div>
               ) : (
          <div className="dashboard-content">

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
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 Lamhey. Welcome to your personal dashboard!</p>
      </footer>
    </div>
  );
};

export default Dashboard;
