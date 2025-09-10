import React, { useState, useEffect } from 'react';
import { getCognitoHostedUIUrl } from '../config/cognito';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

interface AppInfo {
  name: string;
  version: string;
  description: string;
  server: {
    port: number;
    environment: string;
  };
  features: string[];
}

interface ApiData {
  message: string;
  data: {
    users: number;
    projects: number;
    uptime: number;
  };
  timestamp: string;
}

const Home: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (endpoint: string, setter: (data: any) => void) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = () => fetchData('/health', setHealthData);
  const getAppInfo = () => fetchData('/info', setAppInfo);
  const getApiData = () => fetchData('/data', setApiData);

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1 className="logo">Lamhey</h1>
        <nav className="nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/auth" className="nav-link" onClick={(e) => { 
            e.preventDefault(); 
            const url = getCognitoHostedUIUrl();
            if (url) {
              window.location.href = url;
            }
          }}>Login/SignUp</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <h2 className="hero-title">
            Welcome to Lamhey
          </h2>
          <p className="hero-description">
            A modern web application built with React and Node.js. 
            Optimized for EC2 deployment with GitHub integration and seamless development workflows.
          </p>
          <div className="hero-buttons">
            <button
              onClick={checkHealth}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Checking...' : 'Check Health'}
            </button>
            <button
              onClick={getAppInfo}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? 'Loading...' : 'App Info'}
            </button>
            <button
              onClick={getApiData}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Loading...' : 'API Data'}
            </button>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="error">
            <h3>Error</h3>
            <div>{error}</div>
          </div>
        )}

        {/* Status Cards */}
        <div className="status-section">
          <h3 className="section-title">System Status</h3>
          <div className="status-cards">
            {/* Health Status */}
            <div className="status-card">
              <h3>Health Status</h3>
              {healthData ? (
                <div>
                  <div className="status-item">
                    <span className="status-label">Status:</span>
                    <span className="status-value" style={{color: healthData.status === 'OK' ? 'green' : 'red'}}>
                      {healthData.status}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Uptime:</span>
                    <span className="status-value">{Math.floor(healthData.uptime)}s</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Environment:</span>
                    <span className="status-value">{healthData.environment}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Version:</span>
                    <span className="status-value">{healthData.version}</span>
                  </div>
                </div>
              ) : (
                <p>Click "Check Health" to see status</p>
              )}
            </div>

            {/* App Info */}
            <div className="status-card">
              <h3>App Information</h3>
              {appInfo ? (
                <div>
                  <div className="status-item">
                    <span className="status-label">Name:</span>
                    <span className="status-value">{appInfo.name}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Version:</span>
                    <span className="status-value">{appInfo.version}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Port:</span>
                    <span className="status-value">{appInfo.server.port}</span>
                  </div>
                  <div style={{marginTop: '1rem'}}>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem'}}>Features:</p>
                    <ul style={{fontSize: '0.9rem', listStyle: 'none', padding: 0}}>
                      {appInfo.features.map((feature, index) => (
                        <li key={index} style={{marginBottom: '0.25rem'}}>
                          <span style={{color: '#667eea', marginRight: '0.5rem'}}>•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p>Click "App Info" to see details</p>
              )}
            </div>

            {/* API Data */}
            <div className="status-card">
              <h3>API Data</h3>
              {apiData ? (
                <div>
                  <div className="status-item">
                    <span className="status-label">Users:</span>
                    <span className="status-value">{apiData.data.users}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Projects:</span>
                    <span className="status-value">{apiData.data.projects}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Uptime:</span>
                    <span className="status-value">{Math.floor(apiData.data.uptime)}s</span>
                  </div>
                  <div style={{marginTop: '1rem'}}>
                    <p style={{fontSize: '0.9rem', color: '#666'}}>{apiData.message}</p>
                  </div>
                </div>
              ) : (
                <p>Click "API Data" to see information</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Lamhey. Built with ❤️ for EC2 deployment.</p>
      </footer>
    </div>
  );
};

export default Home;
