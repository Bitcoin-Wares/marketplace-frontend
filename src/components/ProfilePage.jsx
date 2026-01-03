// src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { nip19 } from 'nostr-tools';

const ProfilePage = ({ profile, pubkey, loginMethod, updateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', about: '', picture: '', website: '' });
  const [showNsecModal, setShowNsecModal] = useState(false);
  const [nsecInput, setNsecInput] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        about: profile.about || '',
        picture: profile.picture || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  if (!pubkey) {
    return <div className="container mt-5 text-center"><h2>Please log in to view your profile.</h2></div>;
  }

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) { setFormData({ name: profile.name || '', about: profile.about || '', picture: profile.picture || '', website: profile.website || '' }); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (loginMethod === 'extension') {
      const success = await updateProfile(formData);
      if (success) {
        setIsEditing(false);
      }
    } else {
      setModalError('');
      setNsecInput('');
      setShowNsecModal(true);
    }
  };

  const handleNsecSave = async () => {
    if (!nsecInput || !nsecInput.startsWith('nsec1')) {
        setModalError('Please enter a valid nsec key.');
        return;
    }
    const success = await updateProfile(formData, nsecInput);
    if (success) {
      setShowNsecModal(false);
      setIsEditing(false);
    } else {
        setModalError('Failed to update profile. Is your nsec key correct?');
    }
  };

  const npub = nip19.npubEncode(pubkey);

  return (
    <>
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Profile</h2>
          {!isEditing && <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>}
        </div>

        <div className="row">
          <div className="col-md-3 text-center">
            {isEditing ? (
              <>
                <label htmlFor="picture" className="form-label">Picture URL</label>
                <input type="text" className="form-control mb-2" id="picture" name="picture" value={formData.picture} onChange={handleInputChange} placeholder="https://example.com/image.jpg"/>
                <img src={formData.picture || 'https://via.placeholder.com/150'} alt="Avatar Preview" className="img-fluid rounded-circle mb-3" style={{width: '150px', height: '150px', border: '2px solid #ccc'}}/>
              </>
            ) : (
              <img src={profile?.picture || 'https://via.placeholder.com/150'} alt={profile?.name || 'profile avatar'} className="img-fluid rounded-circle mb-3" style={{width: '150px', height: '150px', border: '2px solid #ccc'}}/>
            )}
          </div>
          <div className="col-md-9">
            {isEditing ? (
              <>
                <div className="mb-3"><label htmlFor="name" className="form-label">Name</label><input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} /></div>
                <div className="mb-3"><label htmlFor="about" className="form-label">About</label><textarea className="form-control" id="about" name="about" rows="3" value={formData.about} onChange={handleInputChange}></textarea></div>
                <div className="mb-3"><label htmlFor="website" className="form-label">Website</label><input type="text" className="form-control" id="website" name="website" value={formData.website} onChange={handleInputChange} /></div>
                <button className="btn btn-success me-2" onClick={handleSave}>Save Changes</button>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{profile?.name || 'No Name'}</h3>
                <p className="text-muted">{profile?.display_name}</p><hr />
                <h4>About</h4>
                <p>{profile?.about || 'No description provided.'}</p><hr />
                <h4>Website</h4>
                <p><a href={profile?.website} target="_blank" rel="noopener noreferrer">{profile?.website || 'Not set'}</a></p>
              </>
            )}
            <hr />
            <h4>Public Key</h4>
            <p style={{wordBreak: 'break-all'}}><strong>npub:</strong> {npub}</p>
            <p style={{wordBreak: 'break-all'}}><strong>hex:</strong> {pubkey}</p>
          </div>
        </div>
      </div>

      {showNsecModal && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Authorize Profile Update</h5><button type="button" className="btn-close" onClick={() => setShowNsecModal(false)} aria-label="Close"></button></div>
              <div className="modal-body">
                {modalError && <div className="alert alert-danger">{modalError}</div>}
                <p>To save your profile changes, please enter your secret key (nsec) to sign the update event.</p>
                <div className="form-group">
                  <label htmlFor="nsec-auth-input">Secret Key (nsec)</label>
                  <input id="nsec-auth-input" type="password" className="form-control" placeholder="nsec1..." value={nsecInput} onChange={(e) => setNsecInput(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNsecModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleNsecSave}>Sign and Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
