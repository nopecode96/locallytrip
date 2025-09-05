#!/bin/bash

# Production Secrets Setup Script for LocallyTrip
# This script helps setup secure production secrets

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log "🔐 LocallyTrip Production Secrets Setup"
log "========================================"

# Check if .env.production exists
if [[ ! -f ".env.production" ]]; then
    error "❌ .env.production file not found!"
    exit 1
fi

log "📋 Current Production Configuration Status:"

# Check Database Password
if grep -q "ucsaBQIJOcN+ui5nzYZHQw4S/17btJ/0VS7Wi+Ts1Ns=" .env.production; then
    success "✅ Database password: Secure (auto-generated)"
else
    warning "⚠️ Database password: May need update"
fi

# Check JWT Secret
if grep -q "63cc127cb954806ae930d176c9008501f2390b182b729d4e026bffaff52a4757" .env.production; then
    success "✅ JWT Secret: Secure (auto-generated)"
else
    warning "⚠️ JWT Secret: May need update"
fi

# Check Maileroo Credentials
if grep -q "REPLACE_WITH_YOUR_MAILEROO" .env.production; then
    warning "⚠️ Maileroo credentials: Need to be updated with actual values"
    log "📧 Please update the following in .env.production:"
    log "   EMAIL_USER=your-actual-maileroo-username"
    log "   EMAIL_PASSWORD=your-actual-maileroo-password"
else
    success "✅ Maileroo credentials: Configured"
fi

# Check SSL Email
SSL_EMAIL=$(grep "SSL_EMAIL=" .env.production | cut -d'=' -f2)
if [[ "$SSL_EMAIL" == "admin@locallytrip.com" ]]; then
    success "✅ SSL Email: Configured ($SSL_EMAIL)"
else
    warning "⚠️ SSL Email: Please verify ($SSL_EMAIL)"
fi

log ""
log "🎯 Next Steps for Production Setup:"
log "1. Update Maileroo credentials with your actual values"
log "2. Verify domain ownership and DNS settings"
log "3. Run deployment: ./deploy-production-complete.sh"

log ""
log "💡 Optional: Generate new secrets if needed:"
log "   JWT Secret: openssl rand -hex 32"
log "   DB Password: openssl rand -base64 32"

success "🔐 Production secrets configuration checked!"
