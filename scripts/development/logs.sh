#!/bin/bash

# LocallyTrip Development Logs Script
# This script shows logs for development services

echo "📝 LocallyTrip Development Logs"
echo "==============================="

# Navigate to project root
cd "$(dirname "$0")/../.."

# Show menu
echo "Select service to view logs:"
echo "1) All services"
echo "2) Backend API"
echo "3) Frontend Web"
echo "4) Admin Panel"
echo "5) Database"
echo "6) Follow all logs (real-time)"
echo ""
read -p "Enter choice (1-6): " choice

case $choice in
    1)
        echo "📋 Showing all service logs..."
        docker compose logs --tail=50
        ;;
    2)
        echo "📋 Showing Backend API logs..."
        docker compose logs --tail=50 backend
        ;;
    3)
        echo "📋 Showing Frontend Web logs..."
        docker compose logs --tail=50 web
        ;;
    4)
        echo "📋 Showing Admin Panel logs..."
        docker compose logs --tail=50 web-admin
        ;;
    5)
        echo "📋 Showing Database logs..."
        docker compose logs --tail=50 postgres
        ;;
    6)
        echo "📋 Following all logs (Press Ctrl+C to stop)..."
        docker compose logs -f
        ;;
    *)
        echo "❌ Invalid choice. Showing all logs..."
        docker compose logs --tail=50
        ;;
esac
