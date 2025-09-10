#!/bin/bash

# Lamhey Development Script
# This script helps with local development workflow

set -e

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

print_header() {
    echo -e "${BLUE}[DEV]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Function to start development servers
start_dev() {
    print_header "Starting development servers..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing root dependencies..."
        npm install
    fi
    
    if [ ! -d "server/node_modules" ]; then
        print_status "Installing server dependencies..."
        cd server && npm install && cd ..
    fi
    
    if [ ! -d "client/node_modules" ]; then
        print_status "Installing client dependencies..."
        cd client && npm install && cd ..
    fi
    
    # Start both servers
    print_status "Starting backend server on port 3001..."
    cd server && npm run dev &
    SERVER_PID=$!
    
    print_status "Starting frontend server on port 3000..."
    cd ../client && npm start &
    CLIENT_PID=$!
    
    print_status "Development servers started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:3001"
    print_status "Press Ctrl+C to stop all servers"
    
    # Wait for user to stop
    wait
}

# Function to run tests
run_tests() {
    print_header "Running tests..."
    
    # Run client tests
    print_status "Running client tests..."
    cd client && npm test -- --watchAll=false && cd ..
    
    # Run server tests (if any)
    print_status "Running server tests..."
    cd server && npm test && cd ..
    
    print_status "All tests passed!"
}

# Function to build for production
build_prod() {
    print_header "Building for production..."
    
    print_status "Building client..."
    cd client && npm run build && cd ..
    
    print_status "Building server..."
    cd server && npm install --production && cd ..
    
    print_status "Production build completed!"
}

# Function to create a new feature branch
create_feature() {
    if [ -z "$1" ]; then
        print_error "Please provide a feature name"
        echo "Usage: ./dev.sh feature <feature-name>"
        exit 1
    fi
    
    FEATURE_NAME=$1
    BRANCH_NAME="feature/$FEATURE_NAME"
    
    print_header "Creating feature branch: $BRANCH_NAME"
    
    # Check if branch already exists
    if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
        print_warning "Branch $BRANCH_NAME already exists"
        git checkout $BRANCH_NAME
    else
        git checkout -b $BRANCH_NAME
        print_status "Created and switched to branch: $BRANCH_NAME"
    fi
}

# Function to finish a feature
finish_feature() {
    print_header "Finishing feature branch..."
    
    # Get current branch name
    CURRENT_BRANCH=$(git branch --show-current)
    
    if [[ $CURRENT_BRANCH != feature/* ]]; then
        print_error "You're not on a feature branch"
        exit 1
    fi
    
    print_status "Current branch: $CURRENT_BRANCH"
    
    # Run tests
    run_tests
    
    # Build for production
    build_prod
    
    # Add and commit changes
    git add .
    git commit -m "feat: complete $CURRENT_BRANCH"
    
    # Push to remote
    git push origin $CURRENT_BRANCH
    
    print_status "Feature completed! Create a pull request to merge into main"
}

# Function to deploy to EC2
deploy() {
    print_header "Deploying to EC2..."
    
    # Build for production
    build_prod
    
    # Commit and push to main
    git add .
    git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin main
    
    print_status "Deployment triggered! Check GitHub Actions for progress"
}

# Main script logic
case "$1" in
    "start"|"dev")
        start_dev
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_prod
        ;;
    "feature")
        create_feature "$2"
        ;;
    "finish")
        finish_feature
        ;;
    "deploy")
        deploy
        ;;
    *)
        echo "Lamhey Development Script"
        echo ""
        echo "Usage: ./dev.sh <command> [options]"
        echo ""
        echo "Commands:"
        echo "  start, dev     Start development servers"
        echo "  test           Run all tests"
        echo "  build          Build for production"
        echo "  feature <name> Create a new feature branch"
        echo "  finish         Finish current feature branch"
        echo "  deploy         Deploy to EC2"
        echo ""
        echo "Examples:"
        echo "  ./dev.sh start"
        echo "  ./dev.sh feature user-profile"
        echo "  ./dev.sh finish"
        echo "  ./dev.sh deploy"
        ;;
esac
