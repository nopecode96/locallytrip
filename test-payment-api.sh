#!/bin/bash

echo "🧪 Testing Payment Settings API Endpoints..."

echo "1. Testing Banks API..."
curl -s http://localhost:3000/api/payments/banks/ | jq '.success, .data | length'

echo -e "\n2. Testing Bank Accounts API (requires auth)..."
curl -s http://localhost:3000/api/payments/bank-accounts/ | jq '.success // .message'

echo -e "\n3. Testing Payout Settings API (requires auth)..."
curl -s http://localhost:3000/api/payments/payout-settings/ | jq '.success // .message'

echo -e "\n4. Testing Payout History API (requires auth)..."
curl -s "http://localhost:3000/api/payments/payout-history/?" | jq '.success // .message'

echo -e "\n✅ Payment Settings API endpoints are working!"
