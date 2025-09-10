import React, { useState } from 'react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Simulate authentication (replace with actual Cognito integration)
    setTimeout(() => {
      if (isLogin) {
        // Simulate login
        if (formData.email && formData.password) {
          localStorage.setItem('user', JSON.stringify({ email: formData.email, name: formData.email.split('@')[0] }));
          setMessage('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else {
          setMessage('Please fill in all fields');
        }
      } else {
        // Simulate signup
        if (formData.email && formData.password && formData.name && formData.confirmPassword) {
          if (formData.password === formData.confirmPassword) {
            localStorage.setItem('user', JSON.stringify({ email: formData.email, name: formData.name }));
            setMessage('Account created successfully! Redirecting...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          } else {
            setMessage('Passwords do not match');
          }
        } else {
          setMessage('Please fill in all fields');
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo">Lamhey</h1>
        <nav className="nav">
          <a href="/about" className="nav-link">About</a>
          <a href="/auth" className="nav-link active">Login/SignUp</a>
        </nav>
      </header>

      <main className="main">
        <div className="hero">
          <h2 className="hero-title">Welcome to Lamhey</h2>
          <p className="hero-description">
            Sign in to your account or create a new one to access all features
          </p>
        </div>

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            <h3>{isLogin ? 'Sign In' : 'Create Account'}</h3>
            <p className="auth-description">
              {isLogin 
                ? 'Enter your credentials to access your account'
                : 'Create a new account to get started with Lamhey'
              }
            </p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {message && (
                <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="auth-info">
              <h4>Why {isLogin ? 'Sign In' : 'Sign Up'}?</h4>
              <ul className="benefits-list">
                <li>📸 Upload and manage your photos securely</li>
                <li>☁️ Access your content from anywhere</li>
                <li>👥 Share with friends and family</li>
                <li>🔒 Enterprise-grade security</li>
                <li>📊 Track your usage and analytics</li>
                <li>🚀 Fast and reliable performance</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Lamhey. Secure authentication powered by Amazon Cognito.</p>
      </footer>
    </div>
  );
};

export default AuthPage;
