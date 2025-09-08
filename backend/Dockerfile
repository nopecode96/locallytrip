# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl \
    bash \
    dumb-init

WORKDIR /app

# Development stage
FROM base AS development
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN mkdir -p logs public/images public/uploads
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Create non-root user first
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy source code with correct ownership
COPY --chown=nodejs:nodejs . .

# Create necessary directories with correct ownership
RUN mkdir -p logs public/images public/uploads && \
    chown nodejs:nodejs logs public/images public/uploads

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/ping || exit 1

# Expose port
EXPOSE 3001

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
