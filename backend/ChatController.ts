import pkg from 'pg';
const { Pool } = pkg;

export class ChatController {
  private pool: any;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
  });
  }

  async getMessages(req: any, res: any) {
    try {
      console.log('Attempting to fetch messages...');
      const result = await this.pool.query('SELECT * FROM messages ORDER BY created_at DESC');
      console.log('Messages fetched:', result.rows);
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Database error in getMessages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  async postMessage(req: any, res: any) {
    try {
      const { content, username } = req.body;
      console.log('Received message:', { content, username });

      if (!content || !username) {
        return res.status(400).json({ error: 'Content and username are required' });
      }

      const result = await this.pool.query(
        'INSERT INTO messages (content, username) VALUES ($1, $2) RETURNING *',
        [content, username]
      );

      console.log('Message created:', result.rows[0]);
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Database error in postMessage:', error);
      return res.status(500).json({ error: 'Failed to create message' });
    }
  }

  async resetChat(req: any, res: any) {
    try {
      await this.pool.query('TRUNCATE TABLE messages RESTART IDENTITY');

      // Optional: Add a system message after reset
      await this.pool.query(
        'INSERT INTO messages (content, username) VALUES ($1, $2)',
        ['Chat has been reset', 'System']
      );

      return res.status(200).json({ message: 'Chat reset successfully' });
    } catch (error) {
      console.error('Database error in resetChat:', error);
      return res.status(500).json({ error: 'Failed to reset chat' });
    }
  }
}