import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ title, onLogout }) {
  return (
    <>
      {onLogout && (
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      )}
      <header className="app-header">
        <div className="logo-container">
          <Link to="/dashboard">
            <img src="/logo.png" className="app-logo" alt="AgriLink logo" />
          </Link>
        </div>
        <h2>{title}</h2>
      </header>
    </>
  );
}

export default Header;
