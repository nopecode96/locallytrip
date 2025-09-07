#!/bin/bash

# =============================================================================
# Dynamic Environment Configuration Script
# Generates production-ready environment files with dynamic values
# =============================================================================

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Logging functions
log() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to generate secure password
generate_password() {
    local length=${1:-32}
    openssl rand -base64 $length | tr -d "=+/" | cut -c1-$length
}

# Function to generate JWT secret
generate_jwt_secret() {
    openssl rand -base64 64 | tr -d "=+/" | cut -c1-64
}

# Function to validate domain format
validate_domain() {
    local domain=$1
    if [[ ! $domain =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]] && [[ $domain != "localhost" ]]; then
        error "Invalid domain format: $domain"
        return 1
    fi
    return 0
}

# Function to prompt for user input with validation
prompt_input() {
    local prompt=$1
    local default=$2
    local validator=$3
    local value
    
    while true; do
        echo -n "$prompt [$default]: "
        read -r value
        value=${value:-$default}
        
        if [ -z "$validator" ] || $validator "$value"; then
            echo "$value"
            break
        else
            error "Invalid input. Please try again."
        fi
    done
}

# Function to create environment file
create_env_file() {
    local env_file=".env"
    local template_file=".env.production"
    
    log "Creating production environment file..."
    
    # Check if template exists
    if [[ ! -f "$template_file" ]]; then
        error "Template file $template_file not found!"
        exit 1
    fi
    
    # Get domain configuration
    log "Domain Configuration"
    echo "=================================================="
    local domain
    domain=$(prompt_input "Enter your domain name" "locallytrip.com" "validate_domain")
    
    local alt_domains
    alt_domains=$(prompt_input "Enter alternative domains (comma-separated, optional)" "www.$domain" "")
    
    # SSL Configuration
    log "\nSSL Configuration"
    echo "=================================================="
    local ssl_enabled
    ssl_enabled=$(prompt_input "Enable SSL/TLS? (true/false)" "true" "")
    
    local ssl_email
    ssl_email=$(prompt_input "Enter email for SSL certificate" "admin@$domain" "")
    
    # Database Configuration
    log "\nDatabase Configuration"
    echo "=================================================="
    local db_password
    db_password=$(generate_password 32)
    log "Generated secure database password: ${db_password:0:8}..."
    
    local postgres_password
    postgres_password=$(generate_password 32)
    log "Generated secure PostgreSQL password: ${postgres_password:0:8}..."
    
    # JWT Configuration
    log "\nSecurity Configuration"
    echo "=================================================="
    local jwt_secret
    jwt_secret=$(generate_jwt_secret)
    log "Generated secure JWT secret: ${jwt_secret:0:16}..."
    
    local session_secret
    session_secret=$(generate_password 32)
    log "Generated secure session secret: ${session_secret:0:8}..."
    
    # Email Configuration
    log "\nEmail Configuration (Optional)"
    echo "=================================================="
    local email_user
    email_user=$(prompt_input "Enter email username (optional)" "your-email@gmail.com" "")
    
    local email_password
    email_password=$(prompt_input "Enter email password/app password (optional)" "your-app-password" "")
    
    # Create environment file
    log "\nGenerating environment file..."
    cp "$template_file" "$env_file"
    
    # Replace template values
    sed -i.bak \
        -e "s/DOMAIN=locallytrip.com/DOMAIN=$domain/g" \
        -e "s/ALT_DOMAINS=www.locallytrip.com/ALT_DOMAINS=$alt_domains/g" \
        -e "s/SSL_ENABLED=true/SSL_ENABLED=$ssl_enabled/g" \
        -e "s/SSL_EMAIL=admin@locallytrip.com/SSL_EMAIL=$ssl_email/g" \
        -e "s/DB_PASSWORD=your-super-secure-database-password-here/DB_PASSWORD=$db_password/g" \
        -e "s/POSTGRES_PASSWORD=your-secure-postgres-password-here/POSTGRES_PASSWORD=$postgres_password/g" \
        -e "s/JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters/JWT_SECRET=$jwt_secret/g" \
        -e "s/SESSION_SECRET=your-session-secret-here/SESSION_SECRET=$session_secret/g" \
        -e "s/EMAIL_USER=your-email@gmail.com/EMAIL_USER=$email_user/g" \
        -e "s/EMAIL_PASSWORD=your-app-password/EMAIL_PASSWORD=$email_password/g" \
        "$env_file"
    
    # Remove backup file
    rm -f "$env_file.bak"
    
    # Set secure permissions
    chmod 600 "$env_file"
    
    success "Environment file created: $env_file"
    log "File permissions set to 600 (owner read/write only)"
    
    # Display summary
    echo ""
    log "Configuration Summary:"
    echo "=================================================="
    echo "Domain: $domain"
    echo "SSL Enabled: $ssl_enabled"
    echo "SSL Email: $ssl_email"
    echo "Database Password: ${db_password:0:8}... (32 chars)"
    echo "JWT Secret: ${jwt_secret:0:16}... (64 chars)"
    echo ""
    
    # Security warnings
    warn "SECURITY NOTES:"
    echo "- Environment file contains sensitive information"
    echo "- File permissions set to 600 (owner only)"
    echo "- Backup this file securely"
    echo "- Never commit .env to version control"
    echo "- Consider using Docker secrets for production"
    
    # Next steps
    echo ""
    log "Next Steps:"
    echo "1. Review and customize $env_file if needed"
    echo "2. Ensure DNS records point to your server"
    echo "3. Run: ./deploy-ubuntu-server.sh"
    
    return 0
}

# Function to show help
show_help() {
    cat << EOF
Dynamic Environment Configuration Script

USAGE:
    $0 [OPTIONS]

OPTIONS:
    -h, --help      Show this help message
    -f, --force     Overwrite existing .env file
    --domain DOMAIN Set domain name (skip interactive prompt)
    --no-ssl        Disable SSL (for development)
    --silent        Silent mode (use defaults)

EXAMPLES:
    $0                          # Interactive mode
    $0 --domain example.com     # Set domain, interactive for rest
    $0 --silent --no-ssl        # Silent mode without SSL
    $0 --force                  # Overwrite existing .env file

DESCRIPTION:
    This script generates a production-ready .env file from the template
    with secure passwords, proper domain configuration, and SSL settings.
    
    Generated passwords are cryptographically secure and appropriate
    for production use.

EOF
}

# Main function
main() {
    local force=false
    local domain=""
    local ssl_enabled="true"
    local silent=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -f|--force)
                force=true
                shift
                ;;
            --domain)
                domain="$2"
                if ! validate_domain "$domain"; then
                    error "Invalid domain: $domain"
                    exit 1
                fi
                shift 2
                ;;
            --no-ssl)
                ssl_enabled="false"
                shift
                ;;
            --silent)
                silent=true
                shift
                ;;
            *)
                error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Check if .env exists and force not specified
    if [[ -f ".env" ]] && [[ "$force" != "true" ]]; then
        error ".env file already exists!"
        warn "Use --force to overwrite existing file"
        exit 1
    fi
    
    # Check if template exists
    if [[ ! -f ".env.production" ]]; then
        error "Template file .env.production not found!"
        exit 1
    fi
    
    log "LocallyTrip Dynamic Environment Configuration"
    echo "=============================================="
    
    if [[ "$silent" == "true" ]]; then
        log "Silent mode - using default values"
        # TODO: Implement silent mode with defaults
        warn "Silent mode not yet implemented. Using interactive mode."
    fi
    
    create_env_file
    
    success "Environment configuration completed!"
}

# Run main function with all arguments
main "$@"
