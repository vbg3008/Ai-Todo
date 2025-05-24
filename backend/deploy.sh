#!/bin/bash

# Railway Deployment Helper Script
# This script helps prepare your app for Railway deployment

echo "🚂 Railway Deployment Helper"
echo "=============================="

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    echo "💡 Try: cd backend && ./deploy.sh"
    exit 1
fi

# Check if railway.toml exists
if [ ! -f "railway.toml" ]; then
    echo "❌ Error: railway.toml not found"
    echo "💡 Make sure railway.toml is in the backend directory"
    exit 1
fi

echo "✅ Found package.json and railway.toml"

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  Warning: .env file found in backend directory"
    echo "🔒 Make sure to set environment variables in Railway dashboard instead"
    echo "📝 Required variables:"
    echo "   - NODE_ENV=production"
    echo "   - GEMINI_API_KEY=your_actual_key"
    echo "   - SLACK_BOT_TOKEN=your_actual_token"
    echo "   - SLACK_CHANNEL_ID=your_actual_channel_id"
    echo "   - CORS_ORIGIN=https://your-frontend-domain.com"
    echo ""
fi

# Check dependencies
echo "🔍 Checking dependencies..."
if command -v npm &> /dev/null; then
    npm audit --audit-level=high
    if [ $? -eq 0 ]; then
        echo "✅ No high-severity vulnerabilities found"
    else
        echo "⚠️  Security vulnerabilities detected. Consider running 'npm audit fix'"
    fi
else
    echo "⚠️  npm not found. Please install Node.js"
fi

# Test health endpoint locally
echo ""
echo "🏥 Testing health endpoint..."
if command -v node &> /dev/null; then
    echo "Starting server for health check..."
    timeout 10s npm start &
    SERVER_PID=$!
    sleep 3
    
    if command -v curl &> /dev/null; then
        HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health 2>/dev/null)
        if [ "$HEALTH_CHECK" = "200" ]; then
            echo "✅ Health endpoint working correctly"
        else
            echo "❌ Health endpoint not responding (got $HEALTH_CHECK)"
        fi
    else
        echo "⚠️  curl not found, skipping health check"
    fi
    
    # Clean up
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
else
    echo "⚠️  Node.js not found, skipping health check"
fi

echo ""
echo "🚀 Ready for Railway Deployment!"
echo ""
echo "Next steps:"
echo "1. 🌐 Go to https://railway.app"
echo "2. 🔗 Connect your GitHub repository"
echo "3. 📁 Select 'backend' as the root directory"
echo "4. ⚙️  Set environment variables in Railway dashboard"
echo "5. 🚀 Deploy!"
echo ""
echo "📖 For detailed instructions, see RAILWAY_DEPLOYMENT.md"
