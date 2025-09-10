#!/bin/bash

# Lamhey Development Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up Lamhey development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check Node.js version
print_header "Checking Node.js"
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v) ✓"

# Check npm version
print_header "Checking npm"
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_status "npm version: $(npm -v) ✓"

# Install root dependencies
print_header "Installing root dependencies"
npm install

# Install server dependencies
print_header "Installing server dependencies"
cd server
npm install
cd ..

# Install client dependencies
print_header "Installing client dependencies"
cd client
npm install
cd ..

# Set up environment variables
print_header "Setting up environment variables"
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    print_status "Created server/.env from template"
    print_warning "Please review and update server/.env with your configuration"
else
    print_status "server/.env already exists"
fi

# Build the application
print_header "Building application"
npm run build:all

print_header "Setup Complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Review and update server/.env with your configuration"
echo "2. Start development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start both frontend and backend in development mode"
echo "  npm run client:dev   - Start only the React frontend"
echo "  npm run server:dev   - Start only the Node.js backend"
echo "  npm run build        - Build the React app for production"
echo "  npm run build:all    - Build everything for production"
echo "  npm start            - Start production server"
echo ""
echo "For EC2 deployment, see README.md for detailed instructions."
