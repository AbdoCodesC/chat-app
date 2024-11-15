import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Message {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

const ChatContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const MessageList = styled.div`
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
  background: #f9f9f9;
`;

const MessageItem = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const MessageForm = styled.form`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load initial messages
    fetchMessages();
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/chat/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim()) return;

    try {
      await axios.post('/api/chat/messages', {
        username,
        message: newMessage,
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <ChatContainer>
      <h2>Public Chat Room</h2>
      {!username && (
        <div style={{ marginBottom: '20px' }}>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      )}
      <MessageList>
        {messages.map((msg) => (
          <MessageItem key={msg.id}>
            <strong>{msg.username}:</strong> {msg.message}
            <div style={{ fontSize: '0.8em', color: '#666' }}>
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <MessageForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!username}
        />
        <Button type="submit" disabled={!username}>
          Send
        </Button>
      </MessageForm>
    </ChatContainer>
  );
}