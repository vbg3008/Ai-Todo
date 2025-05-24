# 🚂 Railway Deployment Guide

This guide will help you deploy your Todo Summary Assistant backend to Railway.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Have your API keys ready

## 🚀 Quick Deployment Steps

### 1. **Connect to Railway**

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder as the root directory

### 2. **Configure Environment Variables**

In your Railway project dashboard, go to **Variables** and add:

```bash
# Required Variables
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Slack Integration (Choose one method)
# Method 1: Bot Token
SLACK_BOT_TOKEN=your_actual_slack_bot_token_here
SLACK_CHANNEL_ID=your_actual_slack_channel_id_here

# Method 2: Webhook URL
SLACK_WEBHOOK_URL=your_actual_slack_webhook_url_here

# CORS (Update with your frontend URL after deployment)
CORS_ORIGIN=https://your-frontend-domain.com
```

### 3. **Deploy**

1. Railway will automatically detect your Node.js app
2. It will use the `railway.toml` configuration
3. The deployment will start automatically
4. Wait for the build to complete

### 4. **Get Your Backend URL**

1. Once deployed, Railway will provide a URL like:
   ```
   https://your-app-name.up.railway.app
   ```
2. Test your deployment:
   ```
   https://your-app-name.up.railway.app/health
   ```

## 🔧 Configuration Details

### Railway Configuration (`railway.toml`)

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[environments.production]
variables = { NODE_ENV = "production" }
```

### Key Features:
- **Health Check**: Uses `/health` endpoint for monitoring
- **Auto Restart**: Restarts on failure (max 10 retries)
- **Production Environment**: Sets NODE_ENV automatically

## 🔍 Testing Your Deployment

### Health Check Endpoints:
- **Basic**: `https://your-app.up.railway.app/`
- **Detailed**: `https://your-app.up.railway.app/health`
- **API**: `https://your-app.up.railway.app/api/health`

### Test with curl:
```bash
# Basic health check
curl https://your-app.up.railway.app/health

# Test todos endpoint
curl https://your-app.up.railway.app/api/todos
```

## 🔄 Updating Your Frontend

After deployment, update your frontend environment variables:

**Frontend `.env`:**
```bash
VITE_API_URL=https://your-app.up.railway.app/api
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variables**
   - Ensure all required variables are set in Railway dashboard
   - Check for typos in variable names

3. **CORS Errors**
   - Update `CORS_ORIGIN` with your frontend URL
   - Use `*` for testing (not recommended for production)

4. **Health Check Failures**
   - Verify `/health` endpoint is working locally
   - Check server logs in Railway dashboard

### Viewing Logs:
1. Go to your Railway project dashboard
2. Click on "Deployments"
3. Select the latest deployment
4. View build and runtime logs

## 💰 Railway Pricing

- **Hobby Plan**: $5/month with generous limits
- **Free Tier**: Available for testing (with limitations)
- **Usage-based**: Pay for what you use

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit API keys to git
2. **CORS**: Set specific origins in production
3. **HTTPS**: Railway provides HTTPS by default
4. **API Keys**: Rotate keys regularly

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
- [Railway Discord Community](https://discord.gg/railway)

## 🎉 Success!

Once deployed, your backend will be available at:
```
https://your-app-name.up.railway.app
```

Your API endpoints will be:
- `GET /health` - Health check
- `GET /api/todos` - Get todos
- `POST /api/todos` - Create todo
- `POST /api/summary/generate` - Generate summary
- `POST /api/summary/send-to-slack` - Send to Slack
