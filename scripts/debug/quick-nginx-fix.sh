#!/bin/bash

# Quick Nginx Fix for "unknown directive kee" error

set -e

echo "🔧 Quick Nginx Fix"
echo "=================="

echo "📥 Pulling latest config..."
git pull origin main

echo "🔄 Restarting nginx..."
docker compose -f docker-compose.prod.yml restart nginx

echo "⏳ Waiting 10 seconds..."
sleep 10

echo "📊 Checking status..."
docker compose -f docker-compose.prod.yml ps nginx

echo "🧪 Testing..."
if curl -k -s --connect-timeout 5 https://localhost > /dev/null 2>&1; then
    echo "✅ HTTPS working!"
else
    echo "❌ Still issues. Check logs:"
    docker compose -f docker-compose.prod.yml logs nginx --tail=5
fi

echo "🏁 Quick fix done!"
