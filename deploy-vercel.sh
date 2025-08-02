#!/bin/bash

echo "🚀 Deploying ClinicMS to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy Backend
echo "📦 Deploying Backend..."
cd backend
vercel --prod --yes

# Get backend URL
BACKEND_URL=$(vercel ls | grep clinicms-backend | awk '{print $2}')
echo "✅ Backend deployed at: $BACKEND_URL"

# Deploy Frontend
echo "📦 Deploying Frontend..."
cd ../frontend

# Set environment variable for frontend
export VITE_API_URL="$BACKEND_URL/api"

vercel --prod --yes

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://clinicms-frontend.vercel.app"
echo "🔧 Backend: $BACKEND_URL" 