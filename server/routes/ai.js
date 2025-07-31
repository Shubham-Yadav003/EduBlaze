import express from 'express';
import { askAI, getAIContext } from '../controllers/ai.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

// AI chat endpoint
router.post("/ai/ask", isAuth, askAI);

// Get AI context for better responses
router.get("/ai/context", isAuth, getAIContext);

export default router; 