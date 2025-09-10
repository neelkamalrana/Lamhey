#!/bin/bash

# Quick EC2 Deployment Script for Lamhey
# Run this on your EC2 instance after connecting via SSH

set -e

echo "🚀 Quick Lamhey Deployment on EC2"

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "🔧 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Clone repository
echo "📥 Cloning repository..."
if [ -d "Lamhey" ]; then
    cd Lamhey
    git pull origin main
else
    git clone https://github.com/neelkamalrana/Lamhey.git
    cd Lamhey
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Build application
echo "🏗️ Building application..."
cd client && npm run build && cd ..

# Copy environment files
echo "⚙️ Setting up environment..."
if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo "⚠️  Please update client/.env with your production domain"
fi

if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "⚠️  Please update server/.env with your production settings"
fi

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/lamhey
sudo ln -sf /etc/nginx/sites-available/lamhey /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# Start application
echo "🚀 Starting application..."
pm2 stop lamhey 2>/dev/null || true
pm2 delete lamhey 2>/dev/null || true
pm2 start server/server.js --name "lamhey"
pm2 startup
pm2 save

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "✅ Deployment completed!"
echo "🌐 Your app is available at: http://$PUBLIC_IP"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs lamhey"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Update AWS Cognito callback URLs to: http://$PUBLIC_IP/callback"
echo "   2. Update client/.env with your production domain"
echo "   3. Set up SSL certificate for HTTPS"
