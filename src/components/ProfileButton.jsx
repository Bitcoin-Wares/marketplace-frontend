// src/components/ProfileButton.jsx
import React, { useState, useRef, useEffect } from 'react';

const ProfileButton = ({ profile, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const hasPicture = profile && profile.picture;

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className={`btn ${hasPicture ? 'btn-link' : 'btn-secondary'}`}
        onClick={toggleDropdown}
        style={hasPicture ? { padding: 0, borderRadius: '50%', border: '2px solid white' } : {}}
      >
        {hasPicture ? (
          <img
            src={profile.picture}
            alt="Profile"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        ) : (
          'Profile'
        )}
      </button>

      {dropdownOpen && (
        <div className="dropdown-menu dropdown-menu-right show">
          <a className="dropdown-item" href="/profile">View Profile</a>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={() => { onLogout(); setDropdownOpen(false); }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
