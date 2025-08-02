# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only backend package files
COPY backend/package*.json ./backend/

# Install only backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy only backend source code
COPY backend/ ./backend/

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
WORKDIR /app/backend
CMD ["npm", "start"] 