// src/components/LoginButton.jsx
import React, { useState } from 'react';
import { nip19, generateSecretKey, getPublicKey } from 'nostr-tools';

const LoginButton = ({ onLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const [nsec, setNsec] = useState('');
  const [generatedNsec, setGeneratedNsec] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (!nsec) {
      setError('Please enter an nsec key.');
      return;
    }
    try {
      const { type, data } = nip19.decode(nsec);
      if (type === 'nsec') {
        const userPubkey = getPublicKey(data);
        onLogin(userPubkey, 'nsec');
        setShowModal(false);
        setNsec('');
      } else {
        setError('Invalid nsec key.');
      }
    } catch (e) {
      setError('Invalid nsec key.');
    }
  };

  const handleExtensionLogin = async () => {
    setError('');
    if (window.nostr) {
      try {
        const userPubkey = await window.nostr.getPublicKey();
        onLogin(userPubkey, 'extension');
        setShowModal(false);
      } catch (e) {
        setError('Failed to get public key from extension.');
      }
    } else {
      setError('Nostr extension not found.');
    }
  };

  const handleRegister = () => {
    const sk = generateSecretKey();
    const newNsec = nip19.nsecEncode(sk);
    setGeneratedNsec(newNsec);
  };

  const handleRegistrationDone = () => {
    try {
        const {data} = nip19.decode(generatedNsec);
        const userPubkey = getPublicKey(data);
        onLogin(userPubkey, 'nsec');
        setGeneratedNsec('');
        setShowModal(false);
    } catch (e) {
        setError('Failed to process newly generated key.');
    }
  }

  const openModal = () => {
    setError('');
    setNsec('');
    setGeneratedNsec('');
    setShowModal(true);
  }

  return (
    <>
      <button className="btn btn-primary" onClick={openModal}>
        Login
      </button>

      {showModal && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login or Register</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                
                {generatedNsec ? (
                  <div>
                    <h5>Your New Secret Key (nsec)</h5>
                    <p className="text-danger">
                      <strong>Save this somewhere safe!</strong> This is your private key. It acts as both your username and password. If you lose it, it cannot be recovered.
                    </p>
                    <textarea readOnly rows="4" className="form-control" value={generatedNsec}></textarea>
                    <button className="btn btn-primary w-100 mt-3" onClick={handleRegistrationDone}>
                      I have saved my key. Log me in!
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="nsec-input" className="form-label">Login with your nsec</label>
                      <input
                        id="nsec-input"
                        type="password"
                        className="form-control"
                        placeholder="nsec1..."
                        value={nsec}
                        onChange={(e) => setNsec(e.target.value)}
                      />
                      <button className="btn btn-primary w-100 mt-2" onClick={handleLogin}>
                        Login
                      </button>
                    </div>
                    <div className="text-center my-2">OR</div>
                    <button className="btn btn-secondary w-100" onClick={handleExtensionLogin}>
                      Login with Browser Extension
                    </button>
                    <hr />
                    <p className="text-center">New to Nostr?</p>
                    <button className="btn btn-info w-100" onClick={handleRegister}>
                      Generate a New Key
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton;
