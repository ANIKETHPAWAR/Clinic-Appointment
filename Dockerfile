# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only backend package files
COPY backend/package*.json ./backend/

# Install all backend dependencies (including dev dependencies for build)
WORKDIR /app/backend
RUN npm install

# Copy only backend source code
COPY backend/ ./

# Build the application using local TypeScript compiler
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the application
WORKDIR /app/backend
CMD ["npm", "start"] 