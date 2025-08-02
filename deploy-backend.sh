#!/bin/bash

echo "🚀 Deploying ClinicMS Backend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Navigate to backend directory
cd backend

echo "🔧 Setting up environment variables for Vercel..."

# Set Railway database environment variables
vercel env add DB_HOST production <<< "ballast.proxy.rlwy.net"
vercel env add DB_PORT production <<< "50519"
vercel env add DB_USERNAME production <<< "root"
vercel env add DB_PASSWORD production <<< "huhSgzLfzxTFAeNHEIgrmDoewQaMOxBD"
vercel env add DB_DATABASE production <<< "railway"
vercel env add NODE_ENV production <<< "production"
vercel env add JWT_SECRET production <<< "your-super-secret-jwt-key-change-this-in-production"

echo "📤 Deploying to Vercel..."
vercel --prod

echo "✅ Backend deployment complete!"
echo "🔗 Your backend URL will be shown above"
echo "📝 Copy the URL and use it for frontend deployment" 