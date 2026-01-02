// src/components/SplashPage.jsx
import React from 'react';
import '../index.css'; // Migrated styles

const SplashPage = () => {
  return (
    <div className="bg" style={{ backgroundImage: `url(/img-bk.jpg)` }}>
      <div className="overlay">
        <div className="d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
          <div className="text-center text-white">
            <h1 className="display-3">Welcome to Bitcoin Wares</h1>
            <p className="lead">We are building your hub to goods and services.</p>
            <p className="lead">Check back with us soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;