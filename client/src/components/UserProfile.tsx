import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.attributes?.name || 'User',
    email: user?.attributes?.email || 'user@example.com',
    bio: 'Welcome to Lamhey! This is your profile.',
    location: 'Unknown',
    website: ''
  });

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log('Profile saved:', profile);
    setIsEditing(false);
    alert('Profile saved successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setProfile({
      name: user?.attributes?.name || 'User',
      email: user?.attributes?.email || 'user@example.com',
      bio: 'Welcome to Lamhey! This is your profile.',
      location: 'Unknown',
      website: ''
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">
            {profile.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>About</h3>
          {isEditing ? (
            <textarea
              className="profile-bio-input"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="profile-bio">{profile.bio}</p>
          )}
        </div>

        <div className="profile-section">
          <h3>Location</h3>
          {isEditing ? (
            <input
              type="text"
              className="profile-input"
              value={profile.location}
              onChange={(e) => setProfile({...profile, location: e.target.value})}
              placeholder="Where are you located?"
            />
          ) : (
            <p className="profile-location">{profile.location}</p>
          )}
        </div>

        <div className="profile-section">
          <h3>Website</h3>
          {isEditing ? (
            <input
              type="url"
              className="profile-input"
              value={profile.website}
              onChange={(e) => setProfile({...profile, website: e.target.value})}
              placeholder="https://your-website.com"
            />
          ) : (
            <p className="profile-website">
              {profile.website ? (
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  {profile.website}
                </a>
              ) : (
                'No website provided'
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
