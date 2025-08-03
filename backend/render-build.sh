#!/bin/bash

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify the build output
echo "🔍 Verifying build output..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build successful! dist/main.js exists"
    ls -la dist/
else
    echo "❌ Build failed! dist/main.js not found"
    echo "📁 Current directory contents:"
    ls -la
    echo "📁 dist directory contents (if exists):"
    ls -la dist/ 2>/dev/null || echo "dist directory does not exist"
    exit 1
fi

echo "🎉 Build process completed successfully!" 