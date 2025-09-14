#!/bin/bash

# LocallyTrip Development Stop Script
# This script stops the development environment cleanly

echo "🛑 Stopping LocallyTrip Development Environment..."
echo "================================================="

# Navigate to project root
cd "$(dirname "$0")/../.."

# Stop all services
echo "🔽 Stopping all services..."
docker compose down

# Optional: Remove volumes (uncomment if you want to reset database)
# echo "🗑️  Removing volumes..."
# docker compose down -v

echo ""
echo "✅ All services stopped successfully!"
echo ""
echo "🔄 To start again: ./scripts/development/start.sh"
