import React, { useEffect, useState } from 'react';
import { handleCognitoCallback, createMockUser } from '../config/cognito';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

const Callback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');
  const { refreshUser } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = handleCognitoCallback();
        
        if (result.success) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting to dashboard...');
          
          // Create mock user data using the auth code
          createMockUser(result.code);
          
          // Refresh the authentication context
          refreshUser();
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          setStatus('error');
          setMessage(`Authentication failed: ${result.error}`);
          
          // Redirect to home after error
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred during authentication.');
        console.error('Callback error:', error);
        
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    processCallback();
  }, [refreshUser]);

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">Lamhey</h1>
        <Navigation />
      </header>

      <main className="main">
        <div className="hero">
          <h2 className="hero-title">Authentication</h2>
          <div className="auth-status">
            <div className={`status-indicator ${status}`}>
              {status === 'processing' && <div className="loading-spinner"></div>}
              {status === 'success' && <span className="success-icon">✅</span>}
              {status === 'error' && <span className="error-icon">❌</span>}
            </div>
            <p className="status-message">{message}</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Lamhey. Secure authentication powered by Amazon Cognito.</p>
      </footer>
    </div>
  );
};

export default Callback;
