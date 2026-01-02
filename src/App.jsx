// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SimplePool, nip19, finalizeEvent } from 'nostr-tools';
import SplashPage from './components/SplashPage';
import LoginButton from './components/LoginButton';
import ProfileButton from './components/ProfileButton';
import ProfilePage from './components/ProfilePage';

const App = () => {
  const [pubkey, setPubkey] = useState(() => localStorage.getItem('pubkey'));
  const [profile, setProfile] = useState(null);
  const [loginMethod, setLoginMethod] = useState(() => localStorage.getItem('loginMethod'));

  useEffect(() => {
    if (!pubkey) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const relays = ['wss://relay.damus.io', 'wss://relay.snort.social', 'wss://nostr.wine'];
      const pool = new SimplePool();
      try {
        const profileEvent = await pool.get(relays, {
          kinds: [0],
          authors: [pubkey],
        });

        if (profileEvent) {
          const parsedProfile = JSON.parse(profileEvent.content);
          setProfile(parsedProfile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        pool.close(relays);
      }
    };

    fetchProfile();
  }, [pubkey]);

  const handleLogin = (pk, method) => {
    setPubkey(pk);
    setLoginMethod(method);
    localStorage.setItem('pubkey', pk);
    localStorage.setItem('loginMethod', method);
  };

  const handleLogout = () => {
    setPubkey(null);
    setProfile(null);
    setLoginMethod(null);
    localStorage.removeItem('pubkey');
    localStorage.removeItem('loginMethod');
  };

  const updateProfile = async (newProfileData, nsec = null) => {
    let signedEvent;
    const unsignedEvent = {
      kind: 0,
      pubkey: pubkey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: JSON.stringify(newProfileData),
    };

    try {
      if (loginMethod === 'extension') {
        signedEvent = await window.nostr.signEvent(unsignedEvent);
      } else if (nsec) {
        const { data: sk } = nip19.decode(nsec);
        signedEvent = finalizeEvent(unsignedEvent, sk);
      } else {
        alert("Cannot sign event: No extension or nsec key provided.");
        return false;
      }
    } catch (error) {
      console.error("Failed to sign event:", error);
      // The modal in ProfilePage will handle the specific error message.
      return false;
    }

    try {
      const relays = ['wss://relay.damus.io', 'wss://relay.snort.social', 'wss://nostr.wine'];
      const pool = new SimplePool();
      const pubs = pool.publish(relays, signedEvent);
      await Promise.any(pubs);
      pool.close(relays);

      setProfile(newProfileData);
      alert("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Failed to publish event:", error);
      alert("Failed to update profile. Check the console for details.");
      return false;
    }
  };

  return (
    <Router>
      <div className="h-100">
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1050 }}>
          {pubkey ? (
            <ProfileButton profile={profile} onLogout={handleLogout} />
          ) : (
            <LoginButton onLogin={handleLogin} />
          )}
        </div>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/profile" element={<ProfilePage profile={profile} pubkey={pubkey} loginMethod={loginMethod} updateProfile={updateProfile} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;