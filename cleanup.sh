#!/bin/bash

# LocallyTrip Project Cleanup Script
# Membersihkan file temporary dan cache

echo "🧹 LocallyTrip Project Cleanup"
echo "=============================="

# Clean macOS files
echo "🍎 Removing macOS system files..."
find . -name ".DS_Store" -type f -delete
find . -name "._*" -type f -delete

# Clean node_modules yang tidak terpakai
echo "📦 Cleaning unused node_modules..."
if [ -d "node_modules" ]; then
    echo "   - Root node_modules found, removing..."
    rm -rf node_modules
fi

# Clean Docker cache (optional)
read -p "🐳 Clean Docker cache? (y/N): " clean_docker
if [[ $clean_docker =~ ^[Yy]$ ]]; then
    echo "   - Cleaning Docker system..."
    docker system prune -f
    echo "   - Removing unused Docker volumes..."
    docker volume prune -f
fi

# Clean logs
echo "📄 Cleaning log files..."
find . -name "*.log" -type f -delete
find . -name "npm-debug.log*" -type f -delete
find . -name "yarn-debug.log*" -type f -delete
find . -name "yarn-error.log*" -type f -delete

# Clean build artifacts
echo "🏗️ Cleaning build artifacts..."
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "build" -type d -exec rm -rf {} + 2>/dev/null || true

echo ""
echo "✅ Cleanup completed!"
echo "📋 To run the project: npm run dev"
