#!/bin/bash

# LocallyTrip Unified Deployment Script
# Supports multiple environments: development, staging, production
# Compatible with macOS and Ubuntu 24.04 LTS
# Requires bash 4.0+ for associative arrays

set -euo pipefail

# Check bash version - handle macOS bash 3.x gracefully and zsh compatibility
if [[ -n "${ZSH_VERSION:-}" ]]; then
    echo "🐚 zsh detected - running in compatibility mode"
    MACOS_COMPAT_MODE=true
elif [[ -n "${BASH_VERSION:-}" ]]; then
    BASH_MAJOR_VERSION=${BASH_VERSION%%.*}
    if [[ $BASH_MAJOR_VERSION -lt 4 ]]; then
        # On macOS with bash 3.x, provide helpful guidance
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "⚠️  macOS default bash 3.x detected"
            echo ""
            echo "🔧 Options to run this script:"
            echo "   1. Install bash 4+ with Homebrew: brew install bash"
            echo "   2. Use zsh (mostly compatible): zsh deploy-locallytrip.sh"
            echo "   3. Run with specific bash: /usr/local/bin/bash deploy-locallytrip.sh"
            echo ""
            echo "💡 For development on macOS:"
            echo "   - Basic functionality will work with limitations"
            echo "   - SSL auto-setup requires bash 4+ or Ubuntu server"
            echo "   - For production deployment, use Ubuntu 24.04 LTS server"
            echo ""
            echo "🚀 Quick start for macOS development:"
            echo "   docker compose up --build  # Simple development mode"
            echo ""
            
            # Ask user if they want to continue with limited functionality
            read -p "Continue with limited functionality? (y/N): " -r
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
            
            echo "📢 Running in macOS compatibility mode..."
            MACOS_COMPAT_MODE=true
        else
            echo "Error: This script requires bash 4.0 or higher"
            echo "Current bash version: $BASH_VERSION"
            exit 1
        fi
    else
        MACOS_COMPAT_MODE=false
    fi
else
    echo "⚠️  Unknown shell detected - attempting compatibility mode"
    MACOS_COMPAT_MODE=true
fi

# Script version and metadata
SCRIPT_VERSION="1.0.0"
PROJECT_NAME="LocallyTrip"
SUPPORTED_ENVIRONMENTS=("development" "staging" "production")
SUPPORTED_PLATFORMS=("macos" "ubuntu" "linux")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration variables
ENVIRONMENT=""
PLATFORM=""
PROJECT_DIR=""
LOG_FILE=""
BACKUP_DIR=""
FORCE_REBUILD=false
SKIP_TESTS=false
SKIP_BACKUP=false
VERBOSE=false
DRY_RUN=false

# SSL Configuration
SSL_AUTO=false
SSL_MANUAL=false
SSL_DOMAIN=""

# Default configurations per environment (format: compose_file:env_file:port:domain)
ENV_CONFIG_DEVELOPMENT="docker-compose.yml:.env:3000:localhost"
ENV_CONFIG_STAGING="docker-compose.staging.yml:.env.staging:3000:staging.locallytrip.com"  
ENV_CONFIG_PRODUCTION="docker-compose.prod.yml:.env.production:443:locallytrip.com"

get_env_config() {
    local env=$1
    case $env in
        "development") echo "$ENV_CONFIG_DEVELOPMENT" ;;
        "staging")     echo "$ENV_CONFIG_STAGING" ;;
        "production")  echo "$ENV_CONFIG_PRODUCTION" ;;
        *) echo "" ;;
    esac
}

print_banner() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    ${PROJECT_NAME} Deployment                    ║${NC}"
    echo -e "${BLUE}║                      Version ${SCRIPT_VERSION}                        ║${NC}"
    echo -e "${BLUE}║           Universal deployment for all environments          ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
}

print_usage() {
    cat << EOF
Usage: $0 [ENVIRONMENT] [OPTIONS]

ENVIRONMENTS:
    development     Deploy to local development environment (macOS/Ubuntu)
    staging         Deploy to staging server
    production      Deploy to production server

SPECIAL COMMANDS:
    ssl-verify      Verify SSL certificate configuration

OPTIONS:
    --platform=PLATFORM     Force platform (macos, ubuntu, linux)
    --project-dir=DIR       Custom project directory
    --force-rebuild         Force rebuild all Docker images
    --skip-tests           Skip health checks and tests
    --skip-backup          Skip backup creation
    --verbose              Enable verbose logging
    --dry-run              Show what would be done without executing
    --help                 Show this help message

SSL OPTIONS:
    --ssl-auto             Automatically setup SSL certificates with Let's Encrypt
    --ssl-manual           Show manual SSL setup instructions
    --domain=DOMAIN        Specify domain for SSL setup (default: locallytrip.com)

EXAMPLES:
    $0 development                          # Deploy to local development
    $0 production --ssl-auto                # Production deploy with auto SSL
    $0 production --ssl-auto --domain=example.com  # Production with custom domain
    $0 production --force-rebuild           # Production deploy with rebuild
    $0 staging --platform=ubuntu --verbose # Staging deploy on Ubuntu with logs
    $0 ssl-verify                          # Verify SSL configuration
    $0 development --dry-run               # Preview development deployment

ENVIRONMENT SPECIFIC:
    development: Uses docker-compose.yml with .env on localhost:3000
    staging:     Uses docker-compose.staging.yml with .env.staging
    production:  Uses docker-compose.prod.yml with .env.production on port 443

SSL NOTES:
    - SSL setup only applies to production environment
    - Requires domain pointing to server IP address
    - Auto SSL uses Let's Encrypt (free certificates)
    - Manual SSL shows step-by-step instructions
    - macOS: SSL auto-setup limited (use Ubuntu server for production)

PLATFORM COMPATIBILITY:
    - Ubuntu 24.04 LTS: Full support (production ready)
    - macOS: Development mode with limitations
    - macOS bash 3.x: Limited functionality, bash 4+ recommended

EOF
}

log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")  echo -e "${GREEN}[${timestamp}] [INFO] ${message}${NC}" ;;
        "WARN")  echo -e "${YELLOW}[${timestamp}] [WARN] ${message}${NC}" ;;
        "ERROR") echo -e "${RED}[${timestamp}] [ERROR] ${message}${NC}" ;;
        "DEBUG") [[ $VERBOSE == true ]] && echo -e "${CYAN}[${timestamp}] [DEBUG] ${message}${NC}" ;;
        "STEP")  echo -e "${PURPLE}[${timestamp}] [STEP] ${message}${NC}" ;;
    esac
    
    if [[ -n "$LOG_FILE" && -w "$(dirname "$LOG_FILE")" ]]; then
        echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
    fi
}

error_exit() {
    log "ERROR" "$1"
    exit 1
}

detect_platform() {
    if [[ -n "$PLATFORM" ]]; then
        log "DEBUG" "Platform forced to: $PLATFORM"
        return
    fi
    
    case "$(uname -s)" in
        Darwin*) PLATFORM="macos" ;;
        Linux*)  
            if [[ -f /etc/os-release ]]; then
                source /etc/os-release
                if [[ "$ID" == "ubuntu" ]]; then
                    PLATFORM="ubuntu"
                    # Validate Ubuntu version for optimal compatibility
                    if [[ "$VERSION_ID" == "24.04" ]]; then
                        log "DEBUG" "Ubuntu 24.04 LTS detected - fully supported"
                    elif [[ "$VERSION_ID" =~ ^2[0-9]\.[0-9]+$ ]]; then
                        log "WARN" "Ubuntu $VERSION_ID detected - may have compatibility issues"
                    else
                        log "WARN" "Unsupported Ubuntu version: $VERSION_ID"
                    fi
                else
                    PLATFORM="linux"
                fi
            else
                PLATFORM="linux"
            fi
            ;;
        *) error_exit "Unsupported platform: $(uname -s)" ;;
    esac
    
    log "INFO" "Detected platform: $PLATFORM"
}

validate_environment() {
    if [[ ! " ${SUPPORTED_ENVIRONMENTS[@]} " =~ " ${ENVIRONMENT} " ]]; then
        error_exit "Unsupported environment: $ENVIRONMENT. Supported: ${SUPPORTED_ENVIRONMENTS[*]}"
    fi
    
    log "INFO" "Validated environment: $ENVIRONMENT"
}

setup_directories() {
    local base_dir
    
    if [[ -n "$PROJECT_DIR" ]]; then
        base_dir="$PROJECT_DIR"
    else
        case $PLATFORM in
            "macos")
                base_dir="$(pwd)"
                ;;
            "ubuntu"|"linux")
                case $ENVIRONMENT in
                    "development") base_dir="$(pwd)" ;;
                    "staging")     base_dir="/opt/locallytrip-staging" ;;
                    "production")  base_dir="/opt/locallytrip" ;;
                esac
                ;;
        esac
    fi
    
    PROJECT_DIR="$base_dir"
    BACKUP_DIR="${PROJECT_DIR}-backups"
    LOG_FILE="${PROJECT_DIR}/deploy-${ENVIRONMENT}.log"
    
    # Create directories if needed
    if [[ $DRY_RUN == false ]]; then
        mkdir -p "$PROJECT_DIR" "$BACKUP_DIR"
        
        # Create SSL/certbot directories for production (platform-specific)
        if [[ $ENVIRONMENT == "production" ]]; then
            if [[ $PLATFORM == "macos" ]]; then
                # Use project-relative directories on macOS
                mkdir -p "$(pwd)/tmp/certbot"
                mkdir -p "$(pwd)/tmp/logs"
                log "INFO" "Created macOS-compatible directories in project folder"
            else
                # Use system directories on Ubuntu/Linux
                sudo mkdir -p "/var/www/certbot"
                sudo mkdir -p "/var/log/locallytrip"
                sudo chown -R $USER:$USER "/var/log/locallytrip"
                log "INFO" "Created system directories for Ubuntu/Linux"
            fi
        fi
        
        touch "$LOG_FILE"
    fi
    
    log "INFO" "Project directory: $PROJECT_DIR"
    log "INFO" "Backup directory: $BACKUP_DIR"
    log "INFO" "Log file: $LOG_FILE"
}

# ═══════════════════════════════════════════════════════════════════════════════
# PRE-FLIGHT CHECKS
# ═══════════════════════════════════════════════════════════════════════════════

preflight_checks() {
    log "STEP" "Starting pre-flight checks..."
    
    check_prerequisites
    check_system_resources
    check_docker_availability
    validate_project_structure
    check_environment_file
    
    log "INFO" "✅ All pre-flight checks passed"
}

check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    # Check required commands
    local required_commands=("docker" "curl" "grep" "awk")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            error_exit "Required command not found: $cmd"
        fi
    done
    
    # Platform-specific checks
    case $PLATFORM in
        "macos")
            if ! docker info &> /dev/null; then
                error_exit "Docker Desktop is not running on macOS"
            fi
            ;;
        "ubuntu"|"linux")
            if ! systemctl is-active --quiet docker 2>/dev/null; then
                log "WARN" "Docker service not running - attempting to start..."
                if [[ $DRY_RUN == false ]]; then
                    # Try to install Docker if not available
                    if ! command -v docker &> /dev/null; then
                        install_docker_ubuntu
                    else
                        sudo systemctl start docker || error_exit "Failed to start Docker"
                        sudo systemctl enable docker
                    fi
                fi
            fi
            
            # Ensure user is in docker group for Ubuntu
            if ! groups | grep -q docker; then
                log "WARN" "User not in docker group - adding user to docker group"
                if [[ $DRY_RUN == false ]]; then
                    sudo usermod -aG docker $USER
                    log "INFO" "Added user to docker group - you may need to log out and back in"
                fi
            fi
            ;;
    esac
    
    log "INFO" "✅ Prerequisites check completed"
}

install_docker_ubuntu() {
    log "INFO" "Installing Docker on Ubuntu 24.04 LTS..."
    
    if [[ $DRY_RUN == true ]]; then
        log "INFO" "[DRY RUN] Would install Docker on Ubuntu"
        return 0
    fi
    
    # Update package index
    sudo apt-get update
    
    # Install prerequisites
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        software-properties-common \
        apt-transport-https
    
    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up Docker repository for Ubuntu 24.04
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    log "INFO" "✅ Docker installed successfully on Ubuntu 24.04 LTS"
}

check_system_resources() {
    log "INFO" "Checking system resources..."
    
    # Memory check
    local total_mem_gb
    case $PLATFORM in
        "macos")
            total_mem_gb=$(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 ))
            ;;
        "ubuntu"|"linux")
            # Ubuntu 24.04 LTS specific memory detection
            total_mem_gb=$(awk '/MemTotal/ {printf "%.0f", $2/1024/1024}' /proc/meminfo)
            ;;
    esac
    
    local required_mem_gb
    case $ENVIRONMENT in
        "development") required_mem_gb=4 ;;
        "staging")     required_mem_gb=8 ;;
        "production")  required_mem_gb=8 ;;
    esac
    
    if (( total_mem_gb < required_mem_gb )); then
        log "WARN" "Low memory: ${total_mem_gb}GB (recommended: ${required_mem_gb}GB)"
    else
        log "INFO" "✅ Memory: ${total_mem_gb}GB (required: ${required_mem_gb}GB)"
    fi
    
    # Disk space check
    local available_gb
    case $PLATFORM in
        "macos")
            available_gb=$(df -g . | awk 'NR==2{print $4}')
            ;;
        "ubuntu"|"linux")
            # Ubuntu 24.04 specific disk space check
            available_gb=$(df -BG . | awk 'NR==2{gsub(/G/,""); print $4}')
            ;;
    esac
    
    if (( available_gb < 10 )); then
        error_exit "Insufficient disk space: ${available_gb}GB (required: 10GB)"
    fi
    
    log "INFO" "✅ Disk space: ${available_gb}GB available"
}

check_docker_availability() {
    log "INFO" "Checking Docker availability..."
    
    if ! docker --version &> /dev/null; then
        error_exit "Docker not installed"
    fi
    
    local docker_version=$(docker --version | cut -d' ' -f3 | tr -d ',')
    log "INFO" "Docker version: $docker_version"
    
    if ! docker compose version &> /dev/null; then
        error_exit "Docker Compose not available"
    fi
    
    local compose_version=$(docker compose version --short)
    log "INFO" "Docker Compose version: $compose_version"
    
    log "INFO" "✅ Docker availability verified"
}

validate_project_structure() {
    log "INFO" "Validating project structure..."
    
    local required_files=(
        "package.json"
        "backend/Dockerfile"
        "web/Dockerfile"
        "web-admin/Dockerfile"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            error_exit "Required file not found: $file"
        fi
    done
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local local env_config=($(echo "$env_config_str" | tr ":" " "))
    local compose_file="${env_config[0]}"
    
    if [[ ! -f "$compose_file" ]]; then
        error_exit "Docker Compose file not found: $compose_file"
    fi
    
    log "INFO" "✅ Project structure validated"
}

check_environment_file() {
    log "INFO" "Checking environment configuration..."
    
    local env_config=($(get_env_config "$ENVIRONMENT" | tr ':' ' '))
    local env_file="${env_config[1]}"
    
    if [[ ! -f "$env_file" ]]; then
        error_exit "Environment file not found: $env_file"
    fi
    
    # Validate critical environment variables
    local required_vars=()
    case $ENVIRONMENT in
        "development")
            required_vars=("NODE_ENV" "DB_NAME" "DB_USER" "DB_PASSWORD" "JWT_SECRET")
            ;;
        "staging"|"production")
            required_vars=("NODE_ENV" "DB_NAME" "DB_USER" "DB_PASSWORD" "JWT_SECRET" "NEXT_PUBLIC_API_URL" "NEXTAUTH_URL")
            ;;
    esac
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$env_file"; then
            error_exit "Missing required environment variable in $env_file: $var"
        fi
    done
    
    log "INFO" "✅ Environment file validated: $env_file"
}

# ═══════════════════════════════════════════════════════════════════════════════
# ENVIRONMENT SETUP
# ═══════════════════════════════════════════════════════════════════════════════

environment_setup() {
    log "STEP" "Setting up environment for: $ENVIRONMENT"
    
    setup_environment_variables
    configure_platform_specific
    setup_networking
    
    log "INFO" "✅ Environment setup completed"
}

setup_environment_variables() {
    log "INFO" "Setting up environment variables..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local env_file="${env_config[1]}"
    
    # Copy environment file to .env for docker compose
    if [[ $DRY_RUN == false ]]; then
        cp "$env_file" .env
        log "INFO" "Copied $env_file to .env"
    else
        log "INFO" "[DRY RUN] Would copy $env_file to .env"
    fi
    
    # Export environment variables for current session
    if [[ $DRY_RUN == false ]]; then
        set -a  # Mark variables for export
        source .env
        set +a  # Stop marking variables for export
    fi
    
    log "INFO" "✅ Environment variables configured"
}

configure_platform_specific() {
    log "INFO" "Configuring platform-specific settings..."
    
    case $PLATFORM in
        "macos")
            configure_macos_specific
            ;;
        "ubuntu"|"linux")
            configure_linux_specific
            ;;
    esac
    
    log "INFO" "✅ Platform-specific configuration completed"
}

configure_macos_specific() {
    log "DEBUG" "Applying macOS-specific configurations..."
    
    # Ensure Docker Desktop has enough resources
    if [[ $ENVIRONMENT != "development" ]]; then
        log "WARN" "Running $ENVIRONMENT on macOS - ensure Docker Desktop has sufficient resources"
    fi
    
    # macOS-specific optimizations
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1
}

configure_linux_specific() {
    log "DEBUG" "Applying Linux-specific configurations..."
    
    # Linux-specific Docker optimizations
    export DOCKER_BUILDKIT=1
    export COMPOSE_DOCKER_CLI_BUILD=1
    
    # Setup production optimizations for non-development environments
    if [[ $ENVIRONMENT != "development" ]]; then
        setup_production_optimizations
    fi
}

setup_production_optimizations() {
    log "INFO" "Setting up Ubuntu 24.04 LTS production optimizations..."
    
    if [[ $DRY_RUN == false ]]; then
        # Ubuntu 24.04 specific optimizations
        setup_ubuntu_kernel_params
        setup_ubuntu_docker_daemon
        setup_ubuntu_firewall
        setup_ubuntu_system_limits
    else
        log "INFO" "[DRY RUN] Would apply Ubuntu 24.04 LTS optimizations"
    fi
}

setup_ubuntu_kernel_params() {
    log "DEBUG" "Applying Ubuntu 24.04 LTS kernel optimizations..."
    
    # Create backup of original sysctl.conf
    sudo cp /etc/sysctl.conf /etc/sysctl.conf.backup.$(date +%Y%m%d)
    
    # Apply LocallyTrip production optimizations
    sudo tee -a /etc/sysctl.conf > /dev/null <<EOF

# LocallyTrip Production Optimizations for Ubuntu 24.04 LTS
# Network performance
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_probes = 3
net.ipv4.tcp_keepalive_intvl = 90
net.ipv4.tcp_fin_timeout = 30

# Memory management
vm.swappiness = 10
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5

# File system
fs.file-max = 2097152
fs.nr_open = 1048576
EOF
    
    # Apply settings immediately
    sudo sysctl -p
    
    log "DEBUG" "✅ Ubuntu kernel parameters optimized"
}

setup_ubuntu_docker_daemon() {
    log "DEBUG" "Configuring Docker daemon for Ubuntu 24.04..."
    
    sudo mkdir -p /etc/docker
    sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "storage-driver": "overlay2",
    "default-ulimits": {
        "nofile": {
            "Name": "nofile",
            "Hard": 64000,
            "Soft": 64000
        }
    },
    "live-restore": true,
    "userland-proxy": false,
    "experimental": false,
    "metrics-addr": "127.0.0.1:9323"
}
EOF
    
    sudo systemctl restart docker
    log "DEBUG" "✅ Docker daemon configured for Ubuntu"
}

setup_ubuntu_firewall() {
    log "DEBUG" "Configuring UFW firewall for Ubuntu 24.04..."
    
    # Enable UFW if not already enabled
    sudo ufw --force enable
    
    # Reset to defaults
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    
    # Allow SSH (critical!)
    sudo ufw allow ssh
    sudo ufw allow 22/tcp
    
    # Allow HTTP and HTTPS
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    
    # Allow PostgreSQL only from localhost
    sudo ufw allow from 127.0.0.1 to any port 5432
    sudo ufw allow from ::1 to any port 5432
    
    # Enable logging
    sudo ufw logging on
    
    log "DEBUG" "✅ UFW firewall configured for Ubuntu"
}

setup_ubuntu_system_limits() {
    log "DEBUG" "Setting up system limits for Ubuntu 24.04..."
    
    # Configure system limits
    sudo tee -a /etc/security/limits.conf > /dev/null <<EOF

# LocallyTrip system limits for Ubuntu 24.04 LTS
* soft nofile 65535
* hard nofile 65535
* soft nproc 32768
* hard nproc 32768
root soft nofile 65535
root hard nofile 65535
EOF
    
    # Configure systemd limits
    sudo mkdir -p /etc/systemd/system.conf.d
    sudo tee /etc/systemd/system.conf.d/limits.conf > /dev/null <<EOF
[Manager]
DefaultLimitNOFILE=65535
DefaultLimitNPROC=32768
EOF
    
    log "DEBUG" "✅ System limits configured for Ubuntu"
}

setup_firewall() {
    log "INFO" "Configuring firewall..."
    
    case $PLATFORM in
        "ubuntu"|"linux")
            if command -v ufw &> /dev/null && [[ $ENVIRONMENT != "development" ]]; then
                setup_ubuntu_firewall
            else
                log "DEBUG" "Skipping firewall setup for development environment"
            fi
            ;;
        "macos")
            log "DEBUG" "macOS firewall configuration not needed for development"
            ;;
    esac
}

setup_networking() {
    log "INFO" "Setting up networking configuration..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local port="${env_config[2]}"
    local domain="${env_config[3]}"
    
    log "INFO" "Target domain: $domain"
    log "INFO" "Target port: $port"
    
    # Check if ports are available
    check_port_availability "$port"
    
    log "INFO" "✅ Networking configuration verified"
}

check_port_availability() {
    local port=$1
    
    if [[ $port == "443" || $port == "80" ]]; then
        log "DEBUG" "Skipping port check for $port (handled by reverse proxy)"
        return
    fi
    
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            log "WARN" "Port $port is already in use"
            if [[ $ENVIRONMENT == "development" ]]; then
                log "INFO" "Stopping existing development containers..."
                if [[ $DRY_RUN == false ]]; then
                    docker compose down --remove-orphans 2>/dev/null || true
                fi
            fi
        fi
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# SSL CERTIFICATE MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

ssl_setup() {
    log "STEP" "Setting up SSL certificates..."
    
    if [[ $ENVIRONMENT != "production" ]]; then
        log "INFO" "SSL setup skipped for $ENVIRONMENT environment"
        return
    fi
    
    # Platform-specific SSL handling
    if [[ $PLATFORM == "macos" ]]; then
        log "INFO" "🍎 macOS detected - SSL setup limited for development"
        log "INFO" "💡 For production SSL, deploy to Ubuntu server"
        
        if [[ $SSL_AUTO == true || $SSL_MANUAL == true ]]; then
            show_macos_ssl_info
        fi
        
        # Use development certificates on macOS
        if [[ -f "ssl/cert.pem" && -f "ssl/key.pem" ]]; then
            log "INFO" "✅ Using development SSL certificates"
        else
            log "WARN" "❌ Development SSL certificates not found in ssl/ directory"
        fi
        return
    fi
    
    # Determine domain for SSL
    local ssl_domain
    if [[ -n "$SSL_DOMAIN" ]]; then
        ssl_domain="$SSL_DOMAIN"
    else
        local env_config_str=$(get_env_config "$ENVIRONMENT")
        local env_config=($(echo "$env_config_str" | tr ":" " "))
        ssl_domain="${env_config[3]}"
    fi
    
    # Parse domain for SSL setup
    if [[ $ssl_domain == "localhost" || $ssl_domain == "127.0.0.1" ]]; then
        log "WARN" "SSL setup skipped for localhost"
        return
    fi
    
    check_ssl_prerequisites "$ssl_domain"
    
    if [[ $SSL_AUTO == true ]]; then
        setup_ssl_auto "$ssl_domain"
    elif [[ $SSL_MANUAL == true ]]; then
        setup_ssl_manual "$ssl_domain"
    else
        log "INFO" "SSL setup skipped (no SSL flags specified)"
        return
    fi
    
    verify_ssl_certificates "$ssl_domain"
    log "INFO" "✅ SSL setup completed"
}

show_macos_ssl_info() {
    log "INFO" "🍎 macOS SSL Configuration Information:"
    log "INFO" ""
    log "INFO" "📄 Current Setup:"
    log "INFO" "   - Using development certificates from ssl/ directory"
    log "INFO" "   - Self-signed certificates for localhost development"
    log "INFO" ""
    log "INFO" "🔧 For Production SSL on macOS:"
    log "INFO" "   1. Deploy to Ubuntu server for real Let's Encrypt certificates"
    log "INFO" "   2. Use Docker Desktop port forwarding"
    log "INFO" "   3. Use ngrok or similar tunneling service"
    log "INFO" ""
    log "INFO" "🚀 Recommended Production Deployment:"
    log "INFO" "   ssh root@your-ubuntu-server"
    log "INFO" "   cd /opt/locallytrip"
    log "INFO" "   sudo ./deploy-locallytrip.sh production --ssl-auto"
    log "INFO" ""
}

check_ssl_prerequisites() {
    local domain=$1
    
    log "INFO" "Checking SSL prerequisites for $domain..."
    
    # Skip DNS checks on macOS (for development)
    if [[ $PLATFORM == "macos" ]]; then
        log "INFO" "Skipping DNS checks on macOS (development mode)"
        return
    fi
    
    # Check if domain resolves to current server
    local server_ip=$(curl -s ifconfig.me 2>/dev/null || curl -s ipecho.net/plain 2>/dev/null || echo "unknown")
    local domain_ip=$(dig +short "$domain" 2>/dev/null | tail -n1)
    
    if [[ -z "$domain_ip" ]]; then
        log "WARN" "Could not resolve domain $domain - please check DNS configuration"
    elif [[ "$domain_ip" != "$server_ip" && "$server_ip" != "unknown" ]]; then
        log "WARN" "Domain $domain resolves to $domain_ip but server IP is $server_ip"
        log "WARN" "SSL certificate generation may fail if DNS is not properly configured"
    fi
    
    # Check firewall ports (Ubuntu only)
    if command -v ufw &> /dev/null; then
        local port_80_status=$(ufw status | grep "80" || echo "closed")
        local port_443_status=$(ufw status | grep "443" || echo "closed")
        
        if [[ $port_80_status == "closed" ]] || [[ $port_443_status == "closed" ]]; then
            log "WARN" "Firewall may block HTTP/HTTPS ports - SSL generation may fail"
        fi
    fi
    
    log "INFO" "✅ SSL prerequisites checked"
}

install_certbot() {
    log "INFO" "Installing certbot..."
    
    if command -v certbot &> /dev/null; then
        log "INFO" "Certbot already installed"
        return
    fi
    
    if [[ $DRY_RUN == true ]]; then
        log "INFO" "[DRY RUN] Would install certbot"
        return
    fi
    
    case $PLATFORM in
        "ubuntu"|"linux")
            sudo apt-get update
            sudo apt-get install -y certbot python3-certbot-nginx
            ;;
        "macos")
            log "WARN" "Certbot on macOS is for development only"
            if command -v brew &> /dev/null; then
                brew install certbot
                log "INFO" "⚠️  Note: Let's Encrypt certificates won't work on macOS localhost"
                log "INFO" "💡 For real SSL testing, deploy to Ubuntu server"
            else
                log "WARN" "Homebrew not found. SSL auto-setup not available on macOS."
                log "INFO" "💡 Install Homebrew or use development certificates in ssl/ directory"
                return 1
            fi
            ;;
        *)
            log "ERROR" "Certbot installation not supported for platform: $PLATFORM"
            return 1
            ;;
    esac
    
    log "INFO" "✅ Certbot installed successfully"
}

setup_ssl_auto() {
    local domain=$1
    local admin_domain="admin.$domain"
    local www_domain="www.$domain"
    
    log "INFO" "Setting up SSL certificates automatically for $domain..."
    
    install_certbot
    
    # Stop nginx if running to free port 80
    if docker ps -q -f name=nginx &> /dev/null; then
        log "INFO" "Stopping nginx container for certificate generation..."
        if [[ $DRY_RUN == false ]]; then
            docker compose down nginx 2>/dev/null || true
        fi
    fi
    
    if [[ $DRY_RUN == true ]]; then
        log "INFO" "[DRY RUN] Would generate SSL certificates for: $domain, $www_domain, $admin_domain"
        return
    fi
    
    # Generate certificates using standalone mode
    log "INFO" "Generating SSL certificates..."
    if certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email "admin@$domain" \
        -d "$domain" \
        -d "$www_domain" \
        -d "$admin_domain" \
        --expand; then
        
        log "INFO" "✅ SSL certificates generated successfully"
        
        # Update nginx configuration to use Let's Encrypt certificates
        update_nginx_ssl_config "$domain"
        
        # Setup auto-renewal
        setup_ssl_autorenewal
        
    else
        error_exit "Failed to generate SSL certificates"
    fi
}

setup_ssl_manual() {
    local domain=$1
    
    log "INFO" "Manual SSL setup instructions for $domain:"
    echo ""
    echo "1. Install certbot:"
    echo "   sudo apt install certbot python3-certbot-nginx -y"
    echo ""
    echo "2. Generate certificates:"
    echo "   sudo certbot certonly --standalone -d $domain -d www.$domain -d admin.$domain"
    echo ""
    echo "3. Update nginx configuration to use certificates:"
    echo "   ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;"
    echo "   ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;"
    echo ""
    echo "4. Setup auto-renewal:"
    echo "   sudo crontab -e"
    echo "   0 2 * * * /usr/bin/certbot renew --quiet --post-hook \"docker compose restart nginx\""
    echo ""
}

update_nginx_ssl_config() {
    local domain=$1
    local nginx_config="nginx/conf.d/default.conf"
    
    log "INFO" "Updating nginx configuration for Let's Encrypt certificates..."
    
    if [[ ! -f "$nginx_config" ]]; then
        error_exit "Nginx configuration file not found: $nginx_config"
    fi
    
    if [[ $DRY_RUN == true ]]; then
        log "INFO" "[DRY RUN] Would update nginx SSL configuration"
        return
    fi
    
    # Create backup
    cp "$nginx_config" "$nginx_config.ssl-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Update SSL certificate paths
    sed -i.bak \
        -e "s|ssl_certificate /etc/ssl/certs/cert.pem;|ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;|g" \
        -e "s|ssl_certificate_key /etc/ssl/private/key.pem;|ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;|g" \
        "$nginx_config"
    
    # Update server_name if needed
    sed -i.bak2 \
        -e "s|server_name locallytrip.com www.locallytrip.com;|server_name $domain www.$domain;|g" \
        -e "s|server_name admin.locallytrip.com;|server_name admin.$domain;|g" \
        "$nginx_config"
    
    log "INFO" "✅ Nginx configuration updated for SSL"
}

setup_ssl_autorenewal() {
    log "INFO" "Setting up SSL certificate auto-renewal..."
    
    if [[ $DRY_RUN == true ]]; then
        log "INFO" "[DRY RUN] Would setup auto-renewal cron job"
        return
    fi
    
    # Create renewal script
    local renewal_script="/usr/local/bin/locallytrip-ssl-renewal.sh"
    
    cat > "$renewal_script" << 'EOF'
#!/bin/bash
# LocallyTrip SSL Certificate Renewal Script

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> /var/log/locallytrip/ssl-renewal.log
}

cd /opt/locallytrip || exit 1

log "Starting SSL certificate renewal check..."

if /usr/bin/certbot renew --quiet --no-self-upgrade; then
    log "Certificate renewal check completed successfully"
    
    # Restart nginx if certificates were renewed
    if docker compose ps nginx | grep -q nginx; then
        docker compose restart nginx
        log "Nginx container restarted"
    fi
else
    log "Certificate renewal failed"
    exit 1
fi

log "SSL renewal process completed"
EOF

    chmod +x "$renewal_script"
    
    # Add cron job for auto-renewal (daily at 2 AM)
    (crontab -l 2>/dev/null | grep -v locallytrip-ssl-renewal; echo "0 2 * * * $renewal_script") | crontab -
    
    log "INFO" "✅ SSL auto-renewal configured"
}

verify_ssl_certificates() {
    local domain=$1
    
    log "INFO" "Verifying SSL certificates for $domain..."
    
    # Check if certificates exist
    local cert_path="/etc/letsencrypt/live/$domain/fullchain.pem"
    local key_path="/etc/letsencrypt/live/$domain/privkey.pem"
    
    if [[ $DRY_RUN == true ]]; then
        log "INFO" "[DRY RUN] Would verify SSL certificates"
        return
    fi
    
    if [[ -f "$cert_path" && -f "$key_path" ]]; then
        log "INFO" "✅ SSL certificate files found"
        
        # Check certificate expiry
        local expiry_date=$(openssl x509 -enddate -noout -in "$cert_path" | cut -d= -f2)
        log "INFO" "Certificate expires: $expiry_date"
        
        # Test certificate validity
        if openssl x509 -checkend 86400 -noout -in "$cert_path"; then
            log "INFO" "✅ SSL certificate is valid and not expiring within 24 hours"
        else
            log "WARN" "SSL certificate is expiring within 24 hours"
        fi
    else
        log "WARN" "SSL certificate files not found at expected locations"
    fi
}

ssl_verify_command() {
    local domain="${SSL_DOMAIN:-locallytrip.com}"
    
    log "STEP" "Verifying SSL configuration for $domain..."
    
    verify_ssl_certificates "$domain"
    
    # Test HTTPS connection
    if command -v curl &> /dev/null; then
        log "INFO" "Testing HTTPS connection..."
        if curl -s -I "https://$domain" | grep -q "HTTP/"; then
            log "INFO" "✅ HTTPS connection successful"
        else
            log "WARN" "HTTPS connection failed"
        fi
    fi
    
    # Check auto-renewal
    if command -v certbot &> /dev/null; then
        log "INFO" "Testing certificate renewal..."
        if certbot renew --dry-run --quiet; then
            log "INFO" "✅ Certificate renewal test successful"
        else
            log "WARN" "Certificate renewal test failed"
        fi
    fi
    
    log "INFO" "✅ SSL verification completed"
}

# ═══════════════════════════════════════════════════════════════════════════════
# DOCKER BUILD & DEPLOY
# ═══════════════════════════════════════════════════════════════════════════════

docker_build_deploy() {
    log "STEP" "Starting Docker build and deployment..."
    
    prepare_build_context
    build_docker_images
    deploy_services
    
    log "INFO" "✅ Docker build and deployment completed"
}

prepare_build_context() {
    log "INFO" "Preparing build context..."
    
    # Clean up any existing builds if force rebuild
    if [[ $FORCE_REBUILD == true ]]; then
        log "INFO" "Force rebuild enabled - cleaning existing images..."
        if [[ $DRY_RUN == false ]]; then
            docker compose down --remove-orphans || true
            docker system prune -f || true
        else
            log "INFO" "[DRY RUN] Would clean existing Docker images"
        fi
    fi
    
    # Optimize build context for each environment
    case $ENVIRONMENT in
        "development")
            log "DEBUG" "Using development build context"
            ;;
        "staging"|"production")
            log "DEBUG" "Using production build context with optimizations"
            ;;
    esac
    
    log "INFO" "✅ Build context prepared"
}

build_docker_images() {
    log "INFO" "Building Docker images..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local compose_file="${env_config[0]}"
    
    local build_args=""
    case $ENVIRONMENT in
        "development")
            build_args="--target development"
            ;;
        "staging"|"production")
            build_args="--target production"
            ;;
    esac
    
    if [[ $DRY_RUN == false ]]; then
        log "INFO" "Building with: docker compose -f $compose_file build $build_args"
        
        if [[ $VERBOSE == true ]]; then
            docker compose -f "$compose_file" build $build_args
        else
            docker compose -f "$compose_file" build $build_args --quiet
        fi
        
        log "INFO" "✅ Docker images built successfully"
    else
        log "INFO" "[DRY RUN] Would build images with: docker compose -f $compose_file build $build_args"
    fi
}

deploy_services() {
    log "INFO" "Deploying services..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local compose_file="${env_config[0]}"
    
    if [[ $DRY_RUN == false ]]; then
        # Start services
        docker compose -f "$compose_file" up -d
        
        # Show status
        log "INFO" "Service status:"
        docker compose -f "$compose_file" ps
        
        log "INFO" "✅ Services deployed successfully"
    else
        log "INFO" "[DRY RUN] Would deploy services with: docker compose -f $compose_file up -d"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# DATABASE OPERATIONS
# ═══════════════════════════════════════════════════════════════════════════════

database_operations() {
    log "STEP" "Starting database operations..."
    
    wait_for_database
    run_migrations
    seed_database
    
    log "INFO" "✅ Database operations completed"
}

wait_for_database() {
    log "INFO" "Waiting for database to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if [[ $DRY_RUN == false ]]; then
            if docker compose exec -T postgres pg_isready -U "${DB_USER}" &>/dev/null; then
                log "INFO" "✅ Database is ready (attempt $attempt)"
                return 0
            fi
        else
            log "INFO" "[DRY RUN] Would wait for database (attempt $attempt)"
            if [[ $attempt -eq 3 ]]; then
                return 0  # Simulate success in dry run
            fi
        fi
        
        log "DEBUG" "Database not ready, waiting... (attempt $attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    error_exit "Database failed to become ready after $max_attempts attempts"
}

run_migrations() {
    log "INFO" "Running database migrations..."
    
    if [[ $DRY_RUN == false ]]; then
        # Run any pending migrations
        if docker compose exec -T backend npm run migrate &>/dev/null; then
            log "INFO" "✅ Database migrations completed"
        else
            log "WARN" "No migrations to run or migration command not available"
        fi
    else
        log "INFO" "[DRY RUN] Would run database migrations"
    fi
}

seed_database() {
    log "INFO" "Seeding database with initial data..."
    
    if [[ $ENVIRONMENT == "development" ]]; then
        if [[ $DRY_RUN == false ]]; then
            # Seed development data
            if docker compose exec -T backend npm run seed &>/dev/null; then
                log "INFO" "✅ Database seeded with development data"
            else
                log "WARN" "Database seeding failed or not configured"
            fi
        else
            log "INFO" "[DRY RUN] Would seed database with development data"
        fi
    else
        log "INFO" "Skipping database seeding for $ENVIRONMENT environment"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH VERIFICATION
# ═══════════════════════════════════════════════════════════════════════════════

health_verification() {
    if [[ $SKIP_TESTS == true ]]; then
        log "INFO" "Skipping health verification (--skip-tests enabled)"
        return 0
    fi
    
    log "STEP" "Starting health verification..."
    
    verify_container_health
    verify_service_endpoints
    run_integration_tests
    
    log "INFO" "✅ Health verification completed"
}

verify_container_health() {
    log "INFO" "Verifying container health..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local compose_file="${env_config[0]}"
    
    if [[ $DRY_RUN == false ]]; then
        local unhealthy_containers=()
        local max_attempts=10
        local attempt=1
        
        # Wait for containers to fully start (Ubuntu may be slower)
        while [[ $attempt -le $max_attempts ]]; do
            log "DEBUG" "Container health check attempt $attempt/$max_attempts"
            
            # Check container status
            local container_status=$(docker compose -f "$compose_file" ps --format "table {{.Name}}\t{{.Status}}" | grep -v "NAME")
            local running_count=$(echo "$container_status" | grep -c "Up\|healthy" || echo "0")
            local expected_count
            
            case $ENVIRONMENT in
                "development") expected_count=4 ;;  # postgres, backend, web, web-admin
                "staging"|"production") expected_count=5 ;;  # + nginx
            esac
            
            if [[ $running_count -eq $expected_count ]]; then
                log "INFO" "✅ All $expected_count containers are healthy"
                echo "$container_status" | while IFS= read -r line; do
                    log "DEBUG" "$line"
                done
                return 0
            else
                log "WARN" "Only $running_count/$expected_count containers running, waiting..."
                
                # Show problematic containers
                echo "$container_status" | while IFS= read -r line; do
                    if ! echo "$line" | grep -q "Up\|healthy"; then
                        log "WARN" "Unhealthy: $line"
                    fi
                done
            fi
            
            sleep 10
            ((attempt++))
        done
        
        error_exit "Container health check failed after $max_attempts attempts"
    else
        log "INFO" "[DRY RUN] Would verify container health"
    fi
}

verify_service_endpoints() {
    log "INFO" "Verifying service endpoints..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local domain="${env_config[3]}"
    local port="${env_config[2]}"
    
    local endpoints=()
    case $ENVIRONMENT in
        "development")
            endpoints=(
                "http://localhost:3001/health"
                "http://localhost:3000"
                "http://localhost:3002"
            )
            ;;
        "staging")
            endpoints=(
                "https://${domain}/health"
                "https://${domain}"
                "https://admin.${domain}"
            )
            ;;
        "production")
            endpoints=(
                "https://${domain}/health"
                "https://${domain}"
                "https://admin.${domain}"
            )
            ;;
    esac
    
    for endpoint in "${endpoints[@]}"; do
        if [[ $DRY_RUN == false ]]; then
            if curl -sf --connect-timeout 10 "$endpoint" >/dev/null; then
                log "INFO" "✅ Endpoint healthy: $endpoint"
            else
                log "WARN" "Endpoint not responding: $endpoint"
            fi
        else
            log "INFO" "[DRY RUN] Would check endpoint: $endpoint"
        fi
    done
    
    log "INFO" "✅ Service endpoint verification completed"
}

run_integration_tests() {
    log "INFO" "Running integration tests..."
    
    if [[ $DRY_RUN == false ]]; then
        # Run basic integration tests
        local test_commands=(
            "docker compose exec -T backend curl -f http://localhost:3001/health"
        )
        
        for cmd in "${test_commands[@]}"; do
            if eval "$cmd" &>/dev/null; then
                log "INFO" "✅ Integration test passed: $cmd"
            else
                log "WARN" "Integration test failed: $cmd"
            fi
        done
    else
        log "INFO" "[DRY RUN] Would run integration tests"
    fi
    
    log "INFO" "✅ Integration tests completed"
}

# ═══════════════════════════════════════════════════════════════════════════════
# CLEANUP & MONITORING
# ═══════════════════════════════════════════════════════════════════════════════

cleanup_monitoring() {
    log "STEP" "Starting cleanup and monitoring setup..."
    
    cleanup_old_resources
    setup_monitoring
    create_backup
    generate_deployment_report
    
    log "INFO" "✅ Cleanup and monitoring setup completed"
}

cleanup_old_resources() {
    log "INFO" "Cleaning up old resources..."
    
    if [[ $DRY_RUN == false ]]; then
        # Remove unused Docker images
        docker image prune -f >/dev/null 2>&1 || true
        
        # Remove unused volumes (only for development)
        if [[ $ENVIRONMENT == "development" ]]; then
            docker volume prune -f >/dev/null 2>&1 || true
        fi
        
        # Clean old log files
        find . -name "*.log" -mtime +7 -delete 2>/dev/null || true
        
        log "INFO" "✅ Old resources cleaned up"
    else
        log "INFO" "[DRY RUN] Would clean up old Docker images and logs"
    fi
}

setup_monitoring() {
    log "INFO" "Setting up monitoring..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local compose_file="${env_config[0]}"
    
    if [[ $DRY_RUN == false ]]; then
        # Create monitoring script
        cat > "monitor-${ENVIRONMENT}.sh" << 'EOF'
#!/bin/bash
# Auto-generated monitoring script
echo "=== LocallyTrip Monitoring ==="
echo "Environment: ${ENVIRONMENT}"
echo "Timestamp: $(date)"
echo
echo "=== Container Status ==="
docker compose ps
echo
echo "=== Resource Usage ==="
docker stats --no-stream
EOF
        chmod +x "monitor-${ENVIRONMENT}.sh"
        
        log "INFO" "✅ Monitoring script created: monitor-${ENVIRONMENT}.sh"
    else
        log "INFO" "[DRY RUN] Would create monitoring script"
    fi
}

create_backup() {
    if [[ $SKIP_BACKUP == true ]]; then
        log "INFO" "Skipping backup creation (--skip-backup enabled)"
        return 0
    fi
    
    log "INFO" "Creating deployment backup..."
    
    if [[ $DRY_RUN == false ]]; then
        local timestamp=$(date +%Y%m%d_%H%M%S)
        local backup_name="backup_${ENVIRONMENT}_${timestamp}"
        local backup_path="$BACKUP_DIR/$backup_name"
        
        mkdir -p "$backup_path"
        
        # Backup configuration files
        cp .env* "$backup_path/" 2>/dev/null || true
        cp docker-compose*.yml "$backup_path/" 2>/dev/null || true
        
        # Backup database if possible
        if docker compose exec -T postgres pg_dump -U "${DB_USER}" "${DB_NAME}" > "$backup_path/database.sql" 2>/dev/null; then
            log "INFO" "Database backed up to: $backup_path/database.sql"
        fi
        
        log "INFO" "✅ Backup created: $backup_path"
    else
        log "INFO" "[DRY RUN] Would create backup in $BACKUP_DIR"
    fi
}

generate_deployment_report() {
    log "INFO" "Generating deployment report..."
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local compose_file="${env_config[0]}"
    local domain="${env_config[3]}"
    local port="${env_config[2]}"
    
    local report_file="deployment-report-${ENVIRONMENT}-$(date +%Y%m%d_%H%M%S).txt"
    
    if [[ $DRY_RUN == false ]]; then
        cat > "$report_file" << EOF
=================================================================
LocallyTrip Deployment Report
=================================================================
Timestamp:     $(date)
Environment:   $ENVIRONMENT  
Platform:      $PLATFORM
Compose File:  $compose_file
Domain:        $domain
Port:          $port
Project Dir:   $PROJECT_DIR
Log File:      $LOG_FILE

=== Container Status ===
$(docker compose -f "$compose_file" ps)

=== Service URLs ===
EOF
        
        case $ENVIRONMENT in
            "development")
                echo "Web App:       http://localhost:3000" >> "$report_file"
                echo "Admin Panel:   http://localhost:3002" >> "$report_file"
                echo "API Health:    http://localhost:3001/health" >> "$report_file"
                ;;
            "staging"|"production")
                echo "Web App:       https://$domain" >> "$report_file"
                echo "Admin Panel:   https://admin.$domain" >> "$report_file"
                echo "API Health:    https://api.$domain/health" >> "$report_file"
                ;;
        esac
        
        echo >> "$report_file"
        echo "=== Next Steps ===" >> "$report_file"
        echo "1. Monitor services: ./monitor-${ENVIRONMENT}.sh" >> "$report_file"
        echo "2. View logs: docker compose -f $compose_file logs -f" >> "$report_file"
        echo "3. Check health: curl -f http://localhost:3001/health" >> "$report_file"
        echo >> "$report_file"
        echo "Deployment completed successfully!" >> "$report_file"
        
        log "INFO" "✅ Deployment report generated: $report_file"
    else
        log "INFO" "[DRY RUN] Would generate deployment report: $report_file"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

parse_arguments() {
    if [[ $# -eq 0 ]]; then
        print_usage
        exit 1
    fi
    
    # Handle help flags first
    if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]] || [[ "$1" == "help" ]]; then
        print_usage
        exit 0
    fi
    
    # Handle special commands
    if [[ "$1" == "ssl-verify" ]]; then
        detect_platform
        ssl_verify_command
        exit 0
    fi
    
    ENVIRONMENT="$1"
    shift
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --platform=*)
                PLATFORM="${1#*=}"
                shift
                ;;
            --project-dir=*)
                PROJECT_DIR="${1#*=}"
                shift
                ;;
            --force-rebuild)
                FORCE_REBUILD=true
                shift
                ;;
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --ssl-auto)
                SSL_AUTO=true
                shift
                ;;
            --ssl-manual)
                SSL_MANUAL=true
                shift
                ;;
            --domain=*)
                SSL_DOMAIN="${1#*=}"
                shift
                ;;
            --help)
                print_usage
                exit 0
                ;;
            *)
                error_exit "Unknown option: $1"
                ;;
        esac
    done
}

main() {
    print_banner
    
    # Setup and validation
    detect_platform
    validate_environment
    setup_directories
    
    log "INFO" "Starting LocallyTrip deployment"
    log "INFO" "Environment: $ENVIRONMENT"
    log "INFO" "Platform: $PLATFORM"
    log "INFO" "Dry Run: $DRY_RUN"
    
    # Main deployment phases
    preflight_checks
    environment_setup
    ssl_setup
    docker_build_deploy
    database_operations
    health_verification
    cleanup_monitoring
    
    # Success message
    echo
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                  🎉 DEPLOYMENT SUCCESSFUL! 🎉                ║${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}║  Environment: ${ENVIRONMENT}$(printf '%*s' $((20 - ${#ENVIRONMENT})) '')                     ║${NC}"
    
    local env_config_str=$(get_env_config "$ENVIRONMENT")
    local env_config=($(echo "$env_config_str" | tr ":" " "))
    local domain="${env_config[3]}"
    
    case $ENVIRONMENT in
        "development")
            echo -e "${GREEN}║  Web App:     http://localhost:3000                         ║${NC}"
            echo -e "${GREEN}║  Admin:       http://localhost:3002                         ║${NC}"
            echo -e "${GREEN}║  API:         http://localhost:3001                         ║${NC}"
            ;;
        "staging"|"production")
            echo -e "${GREEN}║  Web App:     https://$domain$(printf '%*s' $((28 - ${#domain})) '')║${NC}"
            echo -e "${GREEN}║  Admin:       https://admin.$domain$(printf '%*s' $((22 - ${#domain})) '')║${NC}"
            echo -e "${GREEN}║  API:         https://api.$domain$(printf '%*s' $((24 - ${#domain})) '')║${NC}"
            ;;
    esac
    
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}║  Monitor:     ./monitor-${ENVIRONMENT}.sh$(printf '%*s' $((24 - ${#ENVIRONMENT})) '')        ║${NC}"
    echo -e "${GREEN}║  Logs:        tail -f $LOG_FILE║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
}

# Script entry point - compatible with bash and zsh
if [[ "${BASH_SOURCE[0]:-${0}}" == "${0}" ]]; then
    parse_arguments "$@"
    main
fi