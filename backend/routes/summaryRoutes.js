import express from 'express';
import { generateSummary, sendToSlack } from '../controllers/summaryController.js';

const router = express.Router();

// Generate summary of todos
router.post('/generate', generateSummary);

// Send summary to Slack
router.post('/send-to-slack', sendToSlack);

export default router;
