import React, { useState, useEffect, useRef } from 'react';
import { fetchMessages, createMessage, resetChat } from '../services/api';
import '../styles/chatRoom.css';

interface Message {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

interface ChatRoomProps {
  username: string;
  onLogout: () => void;
}

export function ChatRoom({ username, onLogout }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await fetchMessages();
      // Sort messages by created_at in ascending order
      const sortedMessages = data.sort((a: Message, b: Message) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setMessages(sortedMessages);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await createMessage(newMessage, username);
      setMessages(prev => [...prev, message]); // Add new message to the end
      setNewMessage('');
      setError(null);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleReset = async () => {
    try {
      await resetChat();
      loadMessages(); // Reload messages after reset
    } catch (err) {
      setError('Failed to reset chat');
      console.error('Error resetting chat:', err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h1>Public Chat Room</h1>
          <div className="online-status">
            <span className="online-dot"></span>
            <span>Online</span>
          </div>
        </div>
        <div className="user-info">
          <div className="username-badge">
            <i className="fas fa-user"></i>
            <span>{username}</span>
          </div>
          <button onClick={handleReset} className="reset-button">
            <i className="fas fa-redo-alt"></i>
            Reset Chat
          </button>
          <button onClick={onLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <div className="messages-container">
        <div className="messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.username === username ? 'own-message' : ''}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <div className="message-user">
                    <i className="fas fa-user-circle"></i>
                    <span>{message.username}</span>
                  </div>
                  <span className="message-time">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <div className="input-container">
          <i className="fas fa-paper-plane"></i>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            maxLength={500}
          />
        </div>
        <button type="submit">
          Send
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}