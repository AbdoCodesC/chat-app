# Real-Time Chat Application

A modern, real-time chat application built with React, TypeScript, Node.js, and PostgreSQL. Users can join chat rooms with a username and exchange messages in real-time.

## Features

- 🚀 Real-time messaging
- 👥 Multiple user support
- 🔒 Secure communication
- 💫 Modern UI with smooth animations
- 🔄 Chat reset functionality
- 📱 Responsive design

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - CSS3 with modern animations

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - WebSocket for real-time communication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
  git clone [your-repo-link]

2. Install dependencies
  npm install

3. Create a `.env` file in the root directory and add your PostgreSQL configuration:
  DB_USER=your_username
  DB_PASSWORD=your_password
  DB_HOST=localhost
  DB_PORT=5432
  DB_DATABASE=chat_db

4. Set up the database
  bash
  psql -U postgres
  CREATE DATABASE chat_db;

5. Run the application
  npm run dev


The application will be available at `http://localhost:3000`

## Usage

1. Enter a username (minimum 3 characters)
2. Join the chat room
3. Start sending and receiving messages
4. Use the reset button to clear chat history
5. Logout when finished

