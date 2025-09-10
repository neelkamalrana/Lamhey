#!/bin/bash

# Lamhey EC2 Deployment Script
# This script automates the deployment process on EC2

set -e

echo "🚀 Starting Lamhey deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running on EC2
if [ ! -f /sys/hypervisor/uuid ] || [ "$(head -c 3 /sys/hypervisor/uuid 2>/dev/null)" != "ec2" ]; then
    print_warning "This script is designed for EC2 instances"
fi

# Update system packages
print_status "Updating system packages..."
if command -v yum &> /dev/null; then
    sudo yum update -y
    sudo yum install -y git nginx
elif command -v apt-get &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y git nginx
else
    print_error "Unsupported package manager"
    exit 1
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    if command -v yum &> /dev/null; then
        sudo yum install -y nodejs
    else
        sudo apt-get install -y nodejs
    fi
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
fi

# Clone or update repository
if [ -d "lamhey" ]; then
    print_status "Updating existing repository..."
    cd lamhey
    git pull origin main
else
    print_status "Cloning repository..."
    git clone https://github.com/yourusername/lamhey.git
    cd lamhey
fi

# Install dependencies
print_status "Installing dependencies..."
npm run install:all

# Build application
print_status "Building application..."
npm run build:all

# Set up environment variables
if [ ! -f "server/.env" ]; then
    print_status "Setting up environment variables..."
    cp server/env.example server/.env
    print_warning "Please edit server/.env with your production values"
fi

# Configure Nginx
print_status "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start application with PM2
print_status "Starting application with PM2..."
pm2 stop lamhey 2>/dev/null || true
pm2 delete lamhey 2>/dev/null || true
pm2 start server/server.js --name "lamhey"
pm2 startup
pm2 save

# Configure firewall
print_status "Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-port=22/tcp
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --permanent --add-port=443/tcp
    sudo firewall-cmd --reload
fi

# Health check
print_status "Performing health check..."
sleep 5
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
    print_status "🌐 Access your app at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
else
    print_error "❌ Health check failed. Check logs with: pm2 logs lamhey"
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "📊 Monitor your app with: pm2 monit"
print_status "📝 View logs with: pm2 logs lamhey"
