import React, { useState } from 'react';
import { Login } from './components/Login';
import { ChatRoom } from './components/ChatRoom';
import './styles/app.css';

function App() {
  const [username, setUsername] = useState<string>('');

  const handleLogin = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handleLogout = () => {
    setUsername('');
  };

  return (
    <div className="App">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom username={username} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;