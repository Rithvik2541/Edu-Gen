import React, { useState } from 'react';
import './PasteModal.css';

const PasteModal = ({ onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = () => {
    onSubmit(url, text);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 0 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            YouTube, Website, Etc
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            Enter a YouTube Link
          </p>
          
          <input
            type="text"
            placeholder="https://youtu.be/dQw4w9WgXcQ"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="url-input"
          />

          <div className="divider">
            <span>or</span>
          </div>

          <div className="paste-section">
            <div className="paste-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Paste Text
            </div>
            <p className="paste-description">
              Copy and paste text to add as content
            </p>
            <textarea
              placeholder="Paste your notes here"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-area"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="add-btn" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasteModal;