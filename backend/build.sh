#!/bin/bash
set -e

echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Build the application
echo "🔨 Building application..."
npm run build

# Verify the build output
echo "🔍 Verifying build output..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build successful! dist/main.js exists"
    echo "📁 dist directory contents:"
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