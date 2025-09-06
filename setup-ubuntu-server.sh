#!/bin/bash

# LocallyTrip Ubuntu Server Initial Setup Script
# Run this script first on a fresh Ubuntu server
# Usage: curl -fsSL https://raw.githubusercontent.com/nopecode96/locallytrip/main/setup-ubuntu-server.sh | bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================================================${NC}"
    echo -e "${BLUE}🚀 LocallyTrip Ubuntu Server Initial Setup${NC}"
    echo -e "${BLUE}================================================================${NC}"
    echo ""
}

# Function to check if running on Ubuntu
check_ubuntu() {
    log "Checking operating system..."
    
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [[ "$ID" == "ubuntu" ]]; then
            success "Running on Ubuntu $VERSION"
        else
            error "This script is designed for Ubuntu. Detected: $ID $VERSION"
            exit 1
        fi
    else
        error "Cannot determine operating system"
        exit 1
    fi
}

# Function to update system
update_system() {
    log "Updating system packages..."
    
    apt update
    apt upgrade -y
    
    success "System updated successfully"
}

# Function to install required packages
install_packages() {
    log "Installing required packages..."
    
    # Install essential packages
    apt install -y \
        curl \
        wget \
        git \
        nano \
        htop \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        ufw
    
    success "Essential packages installed"
}

# Function to install Docker
install_docker() {
    log "Installing Docker..."
    
    # Remove old Docker versions
    apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package index
    apt update
    
    # Install Docker Engine
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Verify Docker installation
    docker --version
    docker compose version
    
    success "Docker installed successfully"
}

# Function to create locallytrip user
create_user() {
    log "Creating locallytrip user..."
    
    # Create user if doesn't exist
    if ! id "locallytrip" &>/dev/null; then
        useradd -m -s /bin/bash locallytrip
        success "User 'locallytrip' created"
    else
        warning "User 'locallytrip' already exists"
    fi
    
    # Add user to docker group
    usermod -aG docker locallytrip
    
    # Add user to sudo group
    usermod -aG sudo locallytrip
    
    # Set password for locallytrip user
    echo "Please set a password for the 'locallytrip' user:"
    passwd locallytrip
    
    success "User configuration completed"
}

# Function to setup SSH key for locallytrip user
setup_ssh() {
    log "Setting up SSH for locallytrip user..."
    
    # Create .ssh directory
    mkdir -p /home/locallytrip/.ssh
    
    # Copy authorized_keys from root if exists
    if [ -f /root/.ssh/authorized_keys ]; then
        cp /root/.ssh/authorized_keys /home/locallytrip/.ssh/
        success "Copied SSH keys from root user"
    fi
    
    # Set proper permissions
    chown -R locallytrip:locallytrip /home/locallytrip/.ssh
    chmod 700 /home/locallytrip/.ssh
    chmod 600 /home/locallytrip/.ssh/authorized_keys 2>/dev/null || true
    
    success "SSH setup completed"
}

# Function to configure firewall
configure_firewall() {
    log "Configuring UFW firewall..."
    
    # Reset firewall
    ufw --force reset
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH
    ufw allow 22/tcp
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Enable firewall
    ufw --force enable
    
    # Show status
    ufw status
    
    success "Firewall configured"
}

# Function to clone project
clone_project() {
    log "Cloning LocallyTrip project..."
    
    # Clone project directly to /home/locallytrip (not subfolder)
    sudo -u locallytrip git clone https://github.com/nopecode96/locallytrip.git /home/locallytrip
    
    # Set proper permissions
    chown -R locallytrip:locallytrip /home/locallytrip
    
    # Make scripts executable
    chmod +x /home/locallytrip/*.sh
    
    success "Project cloned to /home/locallytrip"
}

# Function to create directory structure
create_directories() {
    log "Creating directory structure..."
    
    # Create required directories
    mkdir -p /home/locallytrip/backups
    mkdir -p /home/locallytrip/logs
    mkdir -p /var/log/locallytrip
    
    # Set proper permissions
    chown -R locallytrip:locallytrip /home/locallytrip
    chown -R locallytrip:locallytrip /var/log/locallytrip
    
    success "Directory structure created"
}

# Function to setup environment template
setup_environment_template() {
    log "Setting up environment template..."
    
    cd /home/locallytrip
    
    # Copy production environment template if exists
    if [ -f ".env.ubuntu-server" ]; then
        sudo -u locallytrip cp .env.ubuntu-server .env.template
        success "Environment template created"
    fi
    
    warning "Remember to configure .env file with your settings before deployment!"
    warning "Edit: /home/locallytrip/.env"
}

# Function to show completion summary
show_completion_summary() {
    echo ""
    echo -e "${GREEN}================================================================${NC}"
    echo -e "${GREEN}🎉 Ubuntu Server Setup Completed Successfully!${NC}"
    echo -e "${GREEN}================================================================${NC}"
    echo ""
    echo -e "${BLUE}📊 Setup Summary:${NC}"
    echo -e "${BLUE}├─ Operating System:${NC} Ubuntu $(lsb_release -rs)"
    echo -e "${BLUE}├─ Docker Version:${NC} $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
    echo -e "${BLUE}├─ Docker Compose:${NC} $(docker compose version --short 2>/dev/null || echo 'Installed')"
    echo -e "${BLUE}├─ Project Location:${NC} /home/locallytrip/locallytrip"
    echo -e "${BLUE}├─ User Created:${NC} locallytrip (with sudo access)"
    echo -e "${BLUE}└─ Firewall:${NC} Configured (ports 22, 80, 443)"
    echo ""
    echo -e "${BLUE}🔧 Next Steps:${NC}"
    echo -e "${BLUE}1.${NC} Switch to locallytrip user:"
    echo -e "   ${YELLOW}sudo su - locallytrip${NC}"
    echo ""
    echo -e "${BLUE}2.${NC} Configure environment variables:"
    echo -e "   ${YELLOW}cd /home/locallytrip/locallytrip${NC}"
    echo -e "   ${YELLOW}cp .env.production .env${NC}"
    echo -e "   ${YELLOW}nano .env${NC}"
    echo ""
    echo -e "${BLUE}3.${NC} Configure your domain DNS to point to this server IP"
    echo ""
    echo -e "${BLUE}4.${NC} Run deployment script:"
    echo -e "   ${YELLOW}./deploy-ubuntu-server.sh${NC}"
    echo ""
    echo -e "${BLUE}🌐 Important URLs to configure in .env:${NC}"
    echo -e "${BLUE}├─ DOMAIN=${NC}your-domain.com"
    echo -e "${BLUE}├─ NEXT_PUBLIC_WEBSITE_URL=${NC}https://your-domain.com"
    echo -e "${BLUE}├─ NEXT_PUBLIC_API_URL=${NC}https://api.your-domain.com"
    echo -e "${BLUE}└─ SSL_EMAIL=${NC}admin@your-domain.com"
    echo ""
    echo -e "${BLUE}🔐 Security Notes:${NC}"
    echo -e "${BLUE}├─ Change default passwords${NC}"
    echo -e "${BLUE}├─ Configure SSH key authentication${NC}"
    echo -e "${BLUE}├─ Review firewall rules${NC}"
    echo -e "${BLUE}└─ Set up SSL certificates${NC}"
    echo ""
    echo -e "${GREEN}🚀 Your Ubuntu server is now ready for LocallyTrip deployment!${NC}"
    echo ""
}

# Main setup function
main() {
    print_header
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        error "This script must be run as root"
        error "Usage: sudo $0"
        exit 1
    fi
    
    # Run setup steps
    check_ubuntu
    update_system
    install_packages
    install_docker
    create_user
    setup_ssh
    configure_firewall
    clone_project
    create_directories
    setup_environment_template
    
    # Show completion summary
    show_completion_summary
}

# Handle script interruption
trap 'error "Setup interrupted"; exit 1' INT TERM

# Run main setup
main
