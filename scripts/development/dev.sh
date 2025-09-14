#!/bin/bash

# LocallyTrip Development Helper Script
# This script provides quick access to common development tasks

echo "🛠️  LocallyTrip Development Helper"
echo "=================================="
echo ""
echo "Select an action:"
echo "1) Start development environment"
echo "2) Stop development environment"
echo "3) Check status"
echo "4) View logs"
echo "5) Reset database"
echo "6) Restart specific service"
echo "7) Open browser tabs"
echo "8) Clean Docker cache"
echo "0) Exit"
echo ""
read -p "Enter choice (0-8): " choice

# Navigate to project root
cd "$(dirname "$0")/../.."

case $choice in
    1)
        echo "🚀 Starting development environment..."
        ./scripts/development/start.sh
        ;;
    2)
        echo "🛑 Stopping development environment..."
        ./scripts/development/stop.sh
        ;;
    3)
        echo "🔍 Checking status..."
        ./scripts/development/status.sh
        ;;
    4)
        echo "📝 Viewing logs..."
        ./scripts/development/logs.sh
        ;;
    5)
        echo "🗄️  Resetting database..."
        ./scripts/development/reset-database.sh
        ;;
    6)
        echo ""
        echo "Select service to restart:"
        echo "1) Backend API"
        echo "2) Frontend Web"
        echo "3) Admin Panel"
        echo "4) Database"
        echo ""
        read -p "Enter choice (1-4): " service_choice
        
        case $service_choice in
            1)
                echo "🔄 Restarting Backend API..."
                docker compose restart backend
                ;;
            2)
                echo "🔄 Restarting Frontend Web..."
                docker compose restart web
                ;;
            3)
                echo "🔄 Restarting Admin Panel..."
                docker compose restart web-admin
                ;;
            4)
                echo "🔄 Restarting Database..."
                docker compose restart postgres
                ;;
            *)
                echo "❌ Invalid choice."
                ;;
        esac
        ;;
    7)
        echo "🌐 Opening browser tabs..."
        if command -v open >/dev/null 2>&1; then
            # macOS
            open http://localhost:3000
            open http://localhost:3002
            open http://localhost:3001/health
        elif command -v xdg-open >/dev/null 2>&1; then
            # Linux
            xdg-open http://localhost:3000
            xdg-open http://localhost:3002
            xdg-open http://localhost:3001/health
        else
            echo "Please open these URLs manually:"
            echo "🌐 Frontend:    http://localhost:3000"
            echo "🔧 Admin:       http://localhost:3002"
            echo "📡 API Health:  http://localhost:3001/health"
        fi
        ;;
    8)
        echo "🧹 Cleaning Docker cache..."
        read -p "This will remove unused Docker images and cache. Continue? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            docker system prune -f
            docker image prune -f
            echo "✅ Docker cache cleaned!"
        else
            echo "❌ Operation cancelled."
        fi
        ;;
    0)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice."
        ;;
esac
