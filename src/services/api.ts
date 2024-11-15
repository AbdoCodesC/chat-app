const API_BASE_URL = 'http://localhost:3001/api/chat';

export const fetchMessages = async (page = 1, limit = 50) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const createMessage = async (content: string, username: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, username }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const resetChat = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error resetting chat:', error);
    throw error;
  }
};