import { Request, Response } from "express";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

export class ChatController {
  async getMessages(req: Request, res: Response) {
    try {
      const result = await pool.query(
        "SELECT * FROM public_messages ORDER BY timestamp DESC LIMIT 100"
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  }

  async postMessage(req: Request, res: Response) {
    const { username, message } = req.body;

    if (!username || !message) {
      return res
        .status(400)
        .json({ error: "Username and message are required" });
    }

    try {
      const result = await pool.query(
        "INSERT INTO public_messages (username, message) VALUES ($1, $2) RETURNING *",
        [username, message]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to save message" });
    }
  }
}
