import express from "express";
import { ChatController } from "../backend/ChatController";

const router = express.Router();
const chatController = new ChatController();

router.get("/messages", chatController.getMessages);
router.post("/messages", chatController.postMessage);

export default router;
