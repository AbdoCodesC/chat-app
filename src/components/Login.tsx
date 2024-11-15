import React, { useState } from 'react';
import '../styles/login.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [isError, setIsError] = useState(false);
  const [placeholder, setPlaceholder] = useState('Enter your username');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (username.length < 3 && username.length > 0) {
        setIsError(true);
        setPlaceholder('Username must be at least 3 characters');
        setUsername('');
        
        setTimeout(() => {
          setIsError(false);
          setPlaceholder('Enter your username');
        }, 2000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setIsError(true);
      setPlaceholder('Username is required');
      setTimeout(() => {
        setIsError(false);
        setPlaceholder('Enter your username');
      }, 2000);
      return;
    }

    if (username.length < 3) {
      setIsError(true);
      setPlaceholder('Username must be at least 3 characters');
      setUsername('');
      setTimeout(() => {
        setIsError(false);
        setPlaceholder('Enter your username');
      }, 2000);
      return;
    }

    onLogin(username);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to Chat</h1>
          <p>Connect with others in real-time</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Choose your username</label>
            <div className={`input-wrapper ${isError ? 'shake error' : ''}`}>
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="join-button">
            Join Chat Room
          </button>
        </form>

        <div className="login-footer">
          <div className="features">
            <div className="feature">
              <i className="fas fa-comments"></i>
              <span>Real-time messaging</span>
            </div>
            <div className="feature">
              <i className="fas fa-user-friends"></i>
              <span>Group chat</span>
            </div>
            <div className="feature">
              <i className="fas fa-lock"></i>
              <span>Secure communication</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}