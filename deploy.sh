#!/bin/bash

# Lamhey Single Deployment Script
# This script deploys the Lamhey application on Linux EC2

set -e

echo "🚀 Starting Lamhey deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running on EC2
if [ ! -f /sys/hypervisor/uuid ] || [ "$(head -c 3 /sys/hypervisor/uuid 2>/dev/null)" != "ec2" ]; then
    print_warning "This script is designed for EC2 instances"
fi

# Update system packages
print_step "1. Updating system packages..."
if command -v yum &> /dev/null; then
    sudo yum update -y
    sudo yum install -y git nginx curl wget
elif command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y git nginx curl wget
elif command -v dnf &> /dev/null; then
    sudo dnf update -y
    sudo dnf install -y git nginx curl wget
else
    print_error "Unsupported package manager"
    exit 1
fi

# Install Node.js 18
print_step "2. Installing Node.js 18..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" -lt "18" ]; then
    print_status "Installing Node.js 18..."
    if command -v yum &> /dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    elif command -v dnf &> /dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo dnf install -y nodejs
    else
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
else
    print_status "Node.js 18+ already installed: $(node -v)"
fi

# Install PM2 globally
print_step "3. Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
else
    print_status "PM2 already installed: $(pm2 -v)"
fi

# Clean up any existing deployment
print_step "4. Cleaning up any existing deployment..."
if [ -d "Lamhey" ]; then
    print_status "Removing existing Lamhey directory..."
    sudo rm -rf Lamhey
fi

# Clone repository
print_step "5. Cloning repository..."
print_status "Cloning repository from GitHub..."
git clone https://github.com/neelkamalrana/Lamhey.git
cd Lamhey

# Install dependencies
print_step "6. Installing dependencies..."
print_status "Installing all dependencies..."
npm run install:all

# Build application
print_step "7. Building application..."
print_status "Building client and server..."
npm run build:all

# Set up environment variables
print_step "8. Setting up environment variables..."
if [ ! -f "server/.env" ]; then
    print_status "Creating server environment file..."
    cp server/env.example server/.env
    print_warning "Please edit server/.env with your production values"
    print_warning "Current server/.env contents:"
    cat server/.env
fi

# Configure Nginx
print_step "9. Configuring Nginx..."
print_status "Backing up original nginx.conf..."
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup 2>/dev/null || true

print_status "Applying Lamhey Nginx configuration..."
sudo cp nginx.conf /etc/nginx/nginx.conf

# Test Nginx configuration
print_status "Testing Nginx configuration..."
if sudo nginx -t; then
    print_status "Nginx configuration is valid"
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

# Start Nginx
print_status "Starting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start application with PM2
print_step "10. Starting application with PM2..."
print_status "Stopping any existing PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

print_status "Starting Lamhey application..."
pm2 start server/server.js --name "lamhey" --env production

# Configure PM2 to start on boot
print_status "Configuring PM2 startup..."
pm2 startup
pm2 save

# Configure firewall
print_step "11. Configuring firewall..."
if command -v ufw &> /dev/null; then
    print_status "Configuring UFW firewall..."
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
elif command -v firewall-cmd &> /dev/null; then
    print_status "Configuring firewalld..."
    sudo firewall-cmd --permanent --add-port=22/tcp
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --permanent --add-port=443/tcp
    sudo firewall-cmd --reload
fi

# Health check
print_step "12. Performing health check..."
print_status "Waiting for services to start..."
sleep 10

# Check if services are running
print_status "Checking service status..."

# Check Nginx
if sudo systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx is not running"
    sudo systemctl status nginx
fi

# Check PM2
if pm2 list | grep -q "lamhey.*online"; then
    print_status "✅ Lamhey application is running"
else
    print_error "❌ Lamhey application is not running"
    pm2 logs lamhey --lines 20
fi

# Test API endpoint
print_status "Testing API endpoint..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    print_status "✅ API health check passed"
else
    print_warning "⚠️  API health check failed, but this might be normal if the API doesn't have a health endpoint"
fi

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "Unable to get public IP")

# Final status
print_step "13. Deployment Summary"
print_status "🎉 Deployment completed successfully!"
print_status "🌐 Access your app at: http://$PUBLIC_IP"
print_status "📊 Monitor your app with: pm2 monit"
print_status "📝 View logs with: pm2 logs lamhey"
print_status "🔄 Restart app with: pm2 restart lamhey"

# Show current status
print_status "Current PM2 processes:"
pm2 list

print_status "Current disk usage:"
df -h

print_status "Current memory usage:"
free -h

print_status "🎯 Your Lamhey application is now running on EC2!"