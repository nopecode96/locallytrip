#!/bin/bash

echo "🔍 LocallyTrip Diagnostic Script"
echo "================================="

echo ""
echo "📋 Git Status:"
git log --oneline -3

echo ""
echo "🔧 Current init-db-from-models.js first 10 lines:"
head -10 backend/init-db-from-models.js

echo ""
echo "📊 Docker containers status:"
docker ps -a | grep locallytrip

echo ""
echo "🗂️ Backend container files:"
if docker ps -q -f name=locallytrip-backend-prod; then
    echo "Backend container is running, checking files..."
    docker exec locallytrip-backend-prod ls -la /app/init-db-from-models.js 2>/dev/null || echo "File not found in container"
    docker exec locallytrip-backend-prod head -5 /app/init-db-from-models.js 2>/dev/null || echo "Cannot read file in container"
else
    echo "Backend container is not running"
fi

echo ""
echo "🎯 Diagnosis complete!"
