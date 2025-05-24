# Todo Summary Assistant

A full-stack application that allows users to create and manage todos, generate summaries of pending tasks using an LLM, and send those summaries to Slack.

## Features

- Create, read, update, and delete todo items
- Set priority levels (low, medium, high) for todos
- Add due dates to todos with visual indicators for overdue items
- Filter and sort todos by various criteria
- Generate a summary of pending todos using Google Gemini AI
- Send the generated summary to a Slack channel

## Tech Stack

### Frontend

- React (with Vite)
- Supabase for data storage
- CSS for styling (with Tailwind CSS v4 available)
- Axios for HTTP requests

### Backend

- Node.js
- Express
- Google Gemini API for LLM integration
- Slack API for messaging

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key
- Slack Bot Token and Channel ID or Webhook URL
- Supabase account and project

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/)

2. Create a new table called `todos` with the following schema:

   ```sql
   create table todos (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     description text,
     priority text default 'medium',
     due_date timestamp with time zone,
     completed boolean default false,
     created_at timestamp with time zone default now(),
     updated_at timestamp with time zone
   );
   ```

3. Get your Supabase URL and anon key from the project settings

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:

   ```
   cp .env.example .env
   ```

4. **⚠️ SECURITY WARNING**: Edit the `.env` file and add your **REAL** API keys:

   **NEVER commit real API keys to version control!**

   ```
   # Server Configuration
   PORT=5000

   # Google Gemini API Key
   GEMINI_API_KEY=your_actual_gemini_api_key_here

   # Slack API (Choose one method)
   # Method 1: Bot Token + Channel ID
   SLACK_BOT_TOKEN=your_actual_slack_bot_token_here
   SLACK_CHANNEL_ID=your_actual_slack_channel_id_here

   # Method 2: Webhook URL
   SLACK_WEBHOOK_URL=your_actual_slack_webhook_url_here

   CORS_ORIGIN=http://localhost:5173
   ```

5. Start the backend server:

   ```
   npm run dev
   ```

6. Test the backend connection:

   ```
   npm run test
   ```

   Or manually check the health endpoints:

   - `http://localhost:5000/` - Basic status
   - `http://localhost:5000/health` - Detailed health check
   - `http://localhost:5000/api/health` - API health check

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:

   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your Supabase credentials:

   ```
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # API URL
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:

   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. **Add a Todo**: Click the "+ Add Todo" button to open a modal form. Fill out the form with a title, description (optional), priority level, and due date (optional), then click "Add Todo".

2. **Filter and Sort Todos**: Use the filter controls to view todos by status (all, active, completed) and sort them by different criteria.

3. **Mark as Completed**: Click the checkbox next to a todo to mark it as completed.

4. **Edit a Todo**: Click the "Edit" button to modify a todo's title, description, priority, or due date.

5. **Delete a Todo**: Click the "Delete" button to remove a todo.

6. **Generate Summary**: Click the "Generate Summary" button to create a summary of your pending todos using the LLM.

7. **Send to Slack**: After generating a summary, click "Send to Slack" to send the summary to your configured Slack channel.

## Slack Integration Setup

### Option 1: Bot Token Method

1. Create a Slack App at https://api.slack.com/apps
2. Add the `chat:write` permission to your app
3. Install the app to your workspace
4. Copy the Bot User OAuth Token from the OAuth & Permissions page
5. Find your channel ID by right-clicking on the channel in Slack and selecting "Copy Link"
6. Add these to your backend `.env` file as `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_ID`

### Option 2: Webhook Method

1. Create a Slack App at https://api.slack.com/apps
2. Enable Incoming Webhooks
3. Add a new webhook to your workspace
4. Copy the Webhook URL
5. Add this to your backend `.env` file as `SLACK_WEBHOOK_URL`

## Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a Google account if you don't have one
3. Click "Create API Key"
4. Copy the generated API key
5. Add the key to your backend `.env` file as `GEMINI_API_KEY`

**Note**: Google Gemini offers a generous free tier with 60 requests per minute.

## Environment Variables Reference

### Backend Environment Variables (`.env`)

| Variable            | Required | Description                                | Example                                |
| ------------------- | -------- | ------------------------------------------ | -------------------------------------- |
| `PORT`              | No       | Server port number                         | `5000`                                 |
| `GEMINI_API_KEY`    | Yes      | Google Gemini API key                      | `AIzaSyC...`                           |
| `SLACK_WEBHOOK_URL` | No\*     | Slack webhook URL for sending messages     | `https://hooks.slack.com/services/...` |
| `SLACK_BOT_TOKEN`   | No\*     | Slack bot token (alternative to webhook)   | `xoxb-...`                             |
| `SLACK_CHANNEL_ID`  | No\*     | Slack channel ID (required with bot token) | `C1234567890`                          |
| `CORS_ORIGIN`       | No       | Frontend URL for CORS                      | `http://localhost:5173`                |

\*Either `SLACK_WEBHOOK_URL` OR both `SLACK_BOT_TOKEN` and `SLACK_CHANNEL_ID` are required for Slack integration.

### Frontend Environment Variables (`.env`)

| Variable                 | Required | Description            | Example                                   |
| ------------------------ | -------- | ---------------------- | ----------------------------------------- |
| `VITE_SUPABASE_URL`      | Yes      | Supabase project URL   | `https://xyz.supabase.co`                 |
| `VITE_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_API_URL`           | Yes      | Backend API URL        | `http://localhost:5000/api`               |

## Troubleshooting

### Common Issues

1. **Supabase 401 Unauthorized Error**

   - Check if Row Level Security (RLS) is enabled on your `todos` table
   - If RLS is enabled, either disable it or create appropriate policies
   - Verify your Supabase URL and anon key are correct

2. **Slack Integration Not Working**

   - Verify your webhook URL or bot token is correct
   - Check that your Slack app has the necessary permissions
   - Ensure the channel ID is correct (if using bot token method)

3. **Gemini API Errors**

   - Verify your API key is correct and active
   - Check if you've exceeded the rate limit (60 requests/minute)
   - Ensure you have access to the Gemini API in your region

4. **CORS Errors**

   - Make sure `CORS_ORIGIN` in backend `.env` matches your frontend URL
   - Restart the backend server after changing environment variables

5. **Backend Connection Issues**
   - Run the health check: `cd backend && npm run test`
   - Check if the server is running on the correct port
   - Verify no other service is using port 5000
   - Check the server logs for error messages

## Design Decisions

### Frontend

- Used React with Vite for fast development and modern features
- Implemented local filtering and sorting for better user experience
- Added priority levels and due dates for better task management
- Used Supabase for data persistence
- Styled with custom CSS for polished, responsive design
- Modal-based todo creation for improved user experience
- Inline editing functionality for todos

### Backend

- Used Express for a lightweight and flexible API
- Implemented proper error handling and validation
- Added support for both Slack Bot Token and Webhook methods
- Used Google Gemini AI for intelligent summarization

### Data Flow

- Frontend communicates with Supabase for CRUD operations
- Summary generation sends data to the backend
- Backend processes the data with Google Gemini and sends to Slack

## Deployment

### Backend (Railway - Recommended)

**Quick Deploy to Railway:**

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect GitHub** and select your repository
3. **Choose backend folder** as root directory
4. **Set environment variables** in Railway dashboard:
   ```
   NODE_ENV=production
   GEMINI_API_KEY=your_actual_key
   SLACK_BOT_TOKEN=your_actual_token
   SLACK_CHANNEL_ID=your_actual_channel_id
   CORS_ORIGIN=https://your-frontend-domain.com
   ```
5. **Deploy** - Railway will automatically build and deploy

**Railway Configuration:**

- ✅ `railway.toml` included for optimal deployment
- ✅ Health checks configured at `/health`
- ✅ Auto-restart on failures
- ✅ Production environment settings

📖 **Detailed Guide**: See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### Alternative Backend Deployment

Deploy to other platforms like Heroku, Render, or Vercel:

1. Set environment variables in the platform dashboard
2. Use `npm start` as the start command
3. Set health check endpoint to `/health`

### Frontend

1. **Build the frontend:**

   ```bash
   cd frontend
   npm run build
   ```

2. **Update API URL** in frontend `.env`:

   ```bash
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

3. **Deploy** the `dist` folder to:
   - **Vercel** (recommended)
   - **Netlify**
   - **Firebase Hosting**
   - **GitHub Pages**

## Security Considerations

- **Environment Variables**: Never commit `.env` files to version control. They contain sensitive API keys.
- **API Keys**: Keep your API keys secure and rotate them regularly.
- **Supabase RLS**: Consider enabling Row Level Security (RLS) for production deployments.
- **CORS**: Configure CORS properly for production to only allow requests from your frontend domain.

## License

MIT
