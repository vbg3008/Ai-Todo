import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We now get todos directly from the frontend request
// This allows us to use localStorage for persistence

// Generate summary of todos using Google Gemini
export const generateSummary = async (req, res) => {
  try {
    // Get todos from request body
    const { todos } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key is missing or empty");
      return res.status(500).json({
        message: "Server configuration error: Gemini API key is missing",
      });
    }

    if (!todos || !Array.isArray(todos)) {
      console.error("Invalid request: todos array is missing or not an array");
      return res.status(400).json({
        message: "Invalid request. Todos array is required.",
      });
    }

    // Filter for incomplete todos (just in case)
    const pendingTodos = todos.filter((todo) => !todo.completed);

    if (pendingTodos.length === 0) {
      return res.status(200).json({
        summary: "You have no pending tasks. Great job!",
      });
    }

    // Format todos for the prompt
    const todoList = pendingTodos
      .map((todo) => {
        // Format due date if available
        let dueDateInfo = "";
        if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          if (!isNaN(dueDate.getTime())) {
            dueDateInfo = ` (Due: ${dueDate.toLocaleDateString()})`;
          }
        }

        // Ensure priority exists and has a default value
        const priority = todo.priority ? todo.priority.toUpperCase() : "MEDIUM";

        return `- [${priority}]${dueDateInfo} ${todo.title}${
          todo.description ? `: ${todo.description}` : ""
        }`;
      })
      .join("\n");

    // Create prompt for OpenAI
    const prompt = `
      Please summarize the following pending to-do items in a concise,
      organized way. Each item is marked with its priority level (LOW, MEDIUM, or HIGH)
      and may include a due date.

      1. Group related items together
      2. Respect the priority levels that are already assigned
      3. Consider due dates when suggesting task order (items due sooner should generally be done first)
      4. Suggest a logical order for completing the tasks
      5. If there are many high priority items, suggest which ones to tackle first
      6. Highlight any overdue items or items due very soon

      Pending to-do items:
      ${todoList}
    `;

    // Call Google Gemini API
    try {
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Generate content
      const result = await model.generateContent(prompt);
      const response = result.response;
      const summary = response.text();

      res.status(200).json({ summary });
    } catch (geminiError) {
      console.error("Gemini API call failed:", geminiError);
      console.error("Error details:", geminiError.stack);

      // Check for specific Gemini error types
      if (geminiError.message && geminiError.message.includes("API key")) {
        return res.status(500).json({
          message: "Gemini API authentication error. Check your API key.",
          error: geminiError.message,
        });
      } else if (geminiError.message && geminiError.message.includes("quota")) {
        return res.status(500).json({
          message: "Gemini API quota exceeded. Try again later.",
          error: geminiError.message,
        });
      }

      // Re-throw to be caught by the outer catch block
      throw geminiError;
    }
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({
      message: "Error generating summary",
      error: error.message,
    });
  }
};

// Send summary to Slack
export const sendToSlack = async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary) {
      return res.status(400).json({ message: "Summary is required" });
    }

    // Format the message
    const formattedMessage = `*Todo Summary*\n\n${summary}`;

    // Check if webhook URL is available
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        // Use webhook URL method
        const response = await axios.post(webhookUrl, {
          text: formattedMessage,
          mrkdwn: true,
        });

        if (response.status !== 200) {
          throw new Error(`Slack webhook error: ${response.statusText}`);
        }

        return res.status(200).json({
          message: "Summary sent to Slack successfully via webhook",
        });
      } catch (webhookError) {
        console.error("Error sending to Slack via webhook:", webhookError);
        throw webhookError;
      }
    }

    // Fallback to Bot Token method
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const channelId = process.env.SLACK_CHANNEL_ID;

    if (!slackToken || !channelId) {
      return res.status(400).json({
        message: "Slack configuration is missing. Please check your .env file.",
      });
    }

    try {
      // Send message to Slack using Bot Token
      const response = await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          channel: channelId,
          text: formattedMessage,
          mrkdwn: true,
        },
        {
          headers: {
            Authorization: `Bearer ${slackToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.ok) {
        throw new Error(response.data.error || "Unknown Slack API error");
      }

      res.status(200).json({
        message: "Summary sent to Slack successfully via bot token",
        slackResponse: response.data,
      });
    } catch (botError) {
      console.error("Error sending to Slack via bot token:", botError);
      throw botError;
    }
  } catch (error) {
    console.error("Error sending to Slack:", error);
    res.status(500).json({
      message: "Error sending to Slack",
      error: error.message,
    });
  }
};
