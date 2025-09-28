// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from './components/SplashPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/dev" element={<DevPage />} />
    </Routes>
  </BrowserRouter>
);

const DevPage = () => (
  <div>
    <h1>Development Progress</h1>
    <p>Follow our open-source journey!</p>
    <ul>
      <li><a href="https://github.com/your-org/marketplace-backend">Backend Repo</a></li>
      <li><a href="https://github.com/your-org/marketplace-frontend">Frontend Repo</a></li>
      <li><a href="https://nostr.com/your-pubkey">Nostr Updates</a></li>
    </ul>
  </div>
);

export default App;
