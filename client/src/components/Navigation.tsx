import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCognitoHostedUIUrl } from '../config/cognito';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage = '' }) => {
  const { user, isAuthenticated, signOut } = useAuth();

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getCognitoHostedUIUrl();
    if (url) {
      window.location.href = url;
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <nav className="nav">
      <a href="/about" className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}>
        About
      </a>
      {isAuthenticated ? (
        <>
          <a href="/dashboard" className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}>
            Dashboard
          </a>
          <div className="nav-user">
            <span className="nav-user-name">Welcome, {user?.attributes?.name || 'User'}</span>
            <button onClick={handleSignOut} className="btn btn-secondary nav-signout">
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <a 
          href="/auth" 
          className={`nav-link ${currentPage === 'auth' ? 'active' : ''}`}
          onClick={handleLoginClick}
        >
          Login/SignUp
        </a>
      )}
    </nav>
  );
};

export default Navigation;
