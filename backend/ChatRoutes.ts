import express from 'express';
import { ChatController } from './ChatController.js';

const router = express.Router();
const chatController = new ChatController();

// Wrap async route handlers
router.get('/messages', async (req, res) => {
  console.log('GET /messages request received');
  try {
    await chatController.getMessages(req, res);
  } catch (error) {
    console.error('Route error in GET /messages:', error);
    res.status(500).json({ error: 'Server error in GET /messages' });
  }
});

router.post('/messages', async (req, res) => {
  console.log('POST /messages request received', req.body);
  try {
    await chatController.postMessage(req, res);
  } catch (error) {
    console.error('Route error in POST /messages:', error);
    res.status(500).json({ error: 'Server error in POST /messages' });
  }
});

router.post('/reset', chatController.resetChat.bind(chatController));

export default router;