# Multi-stage build for production optimization
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache curl bash dumb-init

WORKDIR /app

# Development stage
FROM base AS development
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .

# Build the application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM base AS production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next

# Copy necessary files for Next.js to run without standalone mode
COPY next.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY --from=builder /app/src ./src

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set proper permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3002 || exit 1

# Expose port
EXPOSE 3002

# Start application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
# Use npm start for production (not standalone mode since we disabled it)
CMD ["npm", "start"]
