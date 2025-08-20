import React, { useState, useRef } from 'react';
import PasteModal from './PasteModal';
import './LearningPage.css';

const LearningPage = () => {
  const [showFileTooltip, setShowFileTooltip] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [learningText, setLearningText] = useState('');
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file.name);
      // Handle file upload logic here
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected video:', file.name);
      // Handle video upload logic here
    }
  };

  const handlePasteClick = () => {
    setShowPasteModal(true);
  };

  const handleModalClose = () => {
    setShowPasteModal(false);
  };

  const handleModalSubmit = (url, text) => {
    console.log('URL:', url, 'Text:', text);
    setShowPasteModal(false);
    // Handle the submitted data here
  };

  return (
    <div className="learning-page">
      {/* Header */}
      {/* <header className="header">
        <div className="header-left">
          <button className="menu-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="logo">
            <div className="logo-icon"></div>
          </div>
        </div>
        <div className="header-right">
          <button className="upgrade-btn">Upgrade</button>
          <button className="profile-btn">Complete Profile 60%</button>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <h1 className="main-title">What do you want to learn?</h1>
          
          {/* File tooltip */}
          {showFileTooltip && (
            <div className="file-tooltip">
              <span className="tooltip-icon">📄</span>
              PDF, PPT, DOC, TXT, Audio, Video, Image
            </div>
          )}

          {/* Action Cards */}
          <div className="action-cards">
            <div 
              className="action-card upload-card"
              onClick={handleUploadClick}
              onMouseEnter={() => setShowFileTooltip(true)}
              onMouseLeave={() => setShowFileTooltip(false)}
            >
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="card-title">Upload</h3>
              <p className="card-description">File, audio, video</p>
            </div>

            <div 
              className="action-card paste-card"
              onClick={handlePasteClick}
            >
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 0 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="card-title">Paste</h3>
              <p className="card-description">YouTube, website, text</p>
            </div>

            <div 
              className="action-card meeting-card"
              onClick={handleVideoClick}
            >
              <div className="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="card-title">Meeting Summarizer</h3>
              <p className="card-description">Upload meeting video</p>
            </div>
          </div>

          {/* Learning Input */}
          <div className="learning-input-container">
            <input
              type="text"
              placeholder="Learn anything"
              value={learningText}
              onChange={(e) => setLearningText(e.target.value)}
              className="learning-input"
            />
            <button className="submit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Spaces Section */}
        <div className="spaces-section">
          <div className="spaces-header">
            <h2>Spaces</h2>
            <button className="practice-btn">Practice with exams →</button>
          </div>
          
          <div className="spaces-grid">
            <div className="space-card">
              <div className="space-icon">🎯</div>
              <div className="space-info">
                <h3>Spam's Space</h3>
                <p>0 contents</p>
              </div>
            </div>
            <button className="add-space-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,audio/*,video/*,image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoChange}
        style={{ display: 'none' }}
      />

      {/* Paste Modal */}
      {showPasteModal && (
        <PasteModal
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default LearningPage;