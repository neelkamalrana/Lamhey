#!/bin/bash

# Setup HTTPS for local development
# This script installs mkcert and creates local SSL certificates

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Setting up HTTPS for local development..."

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    print_status "Installing mkcert..."
    
    # Install mkcert based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install mkcert
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
        chmod +x mkcert-v*-linux-amd64
        sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
    else
        print_error "Unsupported OS. Please install mkcert manually."
        exit 1
    fi
fi

# Install the local CA
print_status "Installing local CA..."
mkcert -install

# Create certificates directory
mkdir -p certs

# Generate certificates for localhost
print_status "Generating SSL certificates..."
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1

print_status "SSL certificates created in ./certs/"

# Update package.json scripts for HTTPS
print_status "Updating package.json for HTTPS..."

# Create a custom start script for HTTPS
cat > start-https.js << 'EOF'
const { spawn } = require('child_process');
const path = require('path');

// Start backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit'
});

// Start frontend with HTTPS
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  env: {
    ...process.env,
    HTTPS: 'true',
    SSL_CRT_FILE: path.join(__dirname, 'certs', 'localhost.pem'),
    SSL_KEY_FILE: path.join(__dirname, 'certs', 'localhost-key.pem')
  }
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});
EOF

print_status "Setup complete!"
print_status ""
print_status "To start with HTTPS:"
print_status "  node start-https.js"
print_status ""
print_status "Your app will be available at:"
print_status "  https://localhost:3000"
print_status ""
print_status "Don't forget to update your Cognito configuration to include:"
print_status "  https://localhost:3000/dashboard"
print_status "  https://localhost:3000/callback"
