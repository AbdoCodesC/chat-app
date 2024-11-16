import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { parse } from 'path/posix';
dotenv.config();

export class ChatController {
    private pool: any;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT || '5432'),
        });
    }

    async getMessages(req: any, res: any) {
    try {
        console.log('Attempting to fetch public_messages...');
        const result = await this.pool.query(
            `SELECT 
                id,
                content,
                username,
                created_at::timestamp with time zone
            FROM public_messages 
            ORDER BY created_at ASC`
        );
        
        console.log('Raw database rows:', result.rows); // Debug log

        const messages = result.rows.map((row: any) => {
            console.log('Processing row created_at:', row.created_at); // Debug log
            return {
                id: row.id,
                content: row.content,
                username: row.username,
                timestamp: row.created_at ? row.created_at.toISOString() : null
            };
        });
        
        console.log('Processed messages:', messages);
        return res.status(200).json(messages);
    } catch (error) {
        console.error('Database error in getMessages:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch messages',
            details: (error as Error).message
        });
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
            `INSERT INTO public_messages (content, username) 
             VALUES ($1, $2) 
             RETURNING id, content, username, created_at::timestamp with time zone`,
            [content, username]
        );

        console.log('Raw insert result:', result.rows[0]); // Debug log

        const message = {
            id: result.rows[0].id,
            content: result.rows[0].content,
            username: result.rows[0].username,
            timestamp: result.rows[0].created_at.toISOString()
        };

        console.log('Processed message:', message);
        return res.status(201).json(message);
    } catch (error) {
        console.error('Database error in postMessage:', error);
        return res.status(500).json({ 
            error: 'Failed to create message',
            details: (error as Error).message 
        });
    }
}

    async resetChat(req: any, res: any) {
        try {
            await this.pool.query('TRUNCATE TABLE public_messages RESTART IDENTITY');

            // Optional: Add a system message after reset
            await this.pool.query(
                'INSERT INTO public_messages (content, username) VALUES ($1, $2)',
                ['Chat has been reset', 'System']
            );

            return res.status(200).json({ message: 'Chat reset successfully' });
        } catch (error) {
            console.error('Database error in resetChat:', error);
            return res.status(500).json({ error: 'Failed to reset chat' });
        }
    }
}