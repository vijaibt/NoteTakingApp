import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <div className="landing-logo">Second Brain</div>
            <div>
              <Link to="/dashboard">
                <button className="primary-btn">Demo Login</button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      <div className="landing-hero container">
        <h1>Your Second Brain</h1>
        <p>
          Capture thoughts instantly. Find them effortlessly. 
          Connect ideas automatically. The note-taking app that works the way your mind does.
        </p>
        <Link to="/dashboard">
          <button className="primary-btn">Try the Demo</button>
        </Link>
      </div>
      
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2025 Second Brain App. For demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;