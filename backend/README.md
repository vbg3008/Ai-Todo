# Todo Summary Assistant Backend

This is the backend server for the Todo Summary Assistant application. It provides API endpoints for managing todos, generating summaries using Google Gemini API, and sending those summaries to Slack.

## Features

- RESTful API for CRUD operations on todos
- Integration with Google Gemini API for generating summaries
- Integration with Slack for sending messages
- Error handling middleware
- Input validation

## API Endpoints

### Todos

- `GET /api/todos` - Get all todos (with optional filtering and sorting)
  - Query parameters:
    - `status`: Filter by status (`completed` or `active`)
    - `sortBy`: Sort field (`title` or `createdAt`)
    - `order`: Sort order (`asc` or `desc`)
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Summary

- `POST /api/summary/generate` - Generate a summary of pending todos
- `POST /api/summary/send-to-slack` - Send a summary to Slack

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file based on the `.env.example` file:

   ```
   cp .env.example .env
   ```

3. Add your API keys to the `.env` file:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000

   # Choose one of the following Slack integration methods:

   # Method 1: Slack Webhook (Simpler)
   SLACK_WEBHOOK_URL=your_slack_webhook_url_here

   # Method 2: Slack Bot Token (More flexible)
   SLACK_BOT_TOKEN=your_slack_bot_token_here
   SLACK_CHANNEL_ID=your_slack_channel_id_here
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Project Structure

```
backend/
├── controllers/        # Request handlers
│   ├── todoController.js
│   └── summaryController.js
├── middleware/         # Middleware functions
│   ├── errorHandler.js
│   └── validateTodo.js
├── routes/             # API routes
│   ├── todoRoutes.js
│   └── summaryRoutes.js
├── .env                # Environment variables (not in repo)
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── README.md           # This file
└── server.js           # Main server file
```

## Setting Up Slack Integration

You have two options for integrating with Slack:

### Option 1: Using a Slack Webhook (Recommended for Beginners)

1. Go to [Slack API: Incoming Webhooks](https://api.slack.com/messaging/webhooks)
2. Click on "Create your Slack app"
3. Choose "From scratch"
4. Give your app a name (e.g., "Todo Summary") and select your workspace
5. Click "Create App"
6. In the left sidebar, under "Features", click on "Incoming Webhooks"
7. Toggle "Activate Incoming Webhooks" to On
8. Click "Add New Webhook to Workspace"
9. Select the channel where you want to post summaries
10. Click "Allow"
11. Copy the Webhook URL
12. Add it to your `.env` file:
    ```
    SLACK_WEBHOOK_URL=your_webhook_url_here
    ```

### Option 2: Using a Slack Bot Token

1. Go to [Slack API: Your Apps](https://api.slack.com/apps)
2. Click "Create New App" > "From scratch"
3. Give your app a name (e.g., "Todo Summary Bot") and select your workspace
4. Click "Create App"
5. In the left sidebar, under "Features", click on "OAuth & Permissions"
6. Scroll down to "Scopes" and add the following Bot Token Scopes:
   - `chat:write`
   - `chat:write.public`
7. Scroll back up and click "Install to Workspace"
8. Copy the "Bot User OAuth Token" (starts with `xoxb-`)
9. Add it to your `.env` file:
   ```
   SLACK_BOT_TOKEN=your_bot_token_here
   ```
10. Get your channel ID by right-clicking on the channel in Slack and selecting "Copy Link"
    - The channel ID is the part after the last `/` in the URL
11. Add it to your `.env` file:
    ```
    SLACK_CHANNEL_ID=your_channel_id_here
    ```

## Technologies Used

- Node.js
- Express
- Google Gemini API
- Slack API
- Cors
- Dotenv
