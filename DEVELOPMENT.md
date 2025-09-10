# Lamhey Development Guide

This guide explains how to develop features for Lamhey using our streamlined development workflow.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/neelkamalrana/Lamhey.git
cd Lamhey

# Install dependencies
npm run install:all

# Start development servers
./dev.sh start
```

## 🔄 Development Workflow

### 1. Create a Feature Branch
```bash
# Create and switch to a new feature branch
./dev.sh feature user-profile

# This creates a branch like: feature/user-profile
```

### 2. Develop Your Feature
```bash
# Start development servers
./dev.sh start

# Your app will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### 3. Test Your Feature
```bash
# Run all tests
./dev.sh test

# Build for production (test build)
./dev.sh build
```

### 4. Finish Your Feature
```bash
# This will:
# - Run tests
# - Build for production
# - Commit changes
# - Push to remote
./dev.sh finish
```

### 5. Deploy to Production
```bash
# Deploy to EC2 (triggers GitHub Actions)
./dev.sh deploy
```

## 📁 Project Structure

```
Lamhey/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── config/         # Configuration files
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   └── server.js           # Express server
├── .github/
│   └── workflows/          # GitHub Actions
├── dev.sh                  # Development script
└── deploy.sh               # Production deployment
```

## 🛠 Available Commands

| Command | Description |
|---------|-------------|
| `./dev.sh start` | Start development servers |
| `./dev.sh test` | Run all tests |
| `./dev.sh build` | Build for production |
| `./dev.sh feature <name>` | Create feature branch |
| `./dev.sh finish` | Finish current feature |
| `./dev.sh deploy` | Deploy to EC2 |

## 🔧 Adding New Features

### 1. Frontend Components
```bash
# Create a new component
touch client/src/components/MyComponent.tsx

# Add to a page
import MyComponent from '../components/MyComponent';
```

### 2. Backend APIs
```bash
# Add new routes in server/server.js
app.get('/api/my-endpoint', (req, res) => {
  res.json({ message: 'Hello World' });
});
```

### 3. Styling
```bash
# Add CSS to client/src/App.css
.my-component {
  /* Your styles here */
}
```

## 🚀 Automatic Deployment

When you push to the `main` branch, GitHub Actions automatically:

1. **SSH into your EC2 instance**
2. **Pull the latest changes**
3. **Install dependencies**
4. **Build the application**
5. **Restart PM2 processes**
6. **Reload Nginx**

### GitHub Secrets Required
Set these in your GitHub repository settings:

- `EC2_HOST`: Your EC2 public IP
- `EC2_USERNAME`: `ubuntu`
- `EC2_SSH_KEY`: Your private SSH key

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
npm test
```

### Manual Testing
1. Start development servers: `./dev.sh start`
2. Test in browser: http://localhost:3000
3. Test API endpoints: http://localhost:3001/api/health

## 📝 Best Practices

### Git Workflow
1. **Always create feature branches** from `main`
2. **Test locally** before pushing
3. **Use descriptive commit messages**
4. **Create pull requests** for code review

### Code Style
- **Use TypeScript** for type safety
- **Follow React best practices**
- **Keep components small and focused**
- **Use meaningful variable names**

### Performance
- **Optimize images** before adding
- **Use lazy loading** for large components
- **Minimize bundle size**
- **Test on mobile devices**

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Dependencies issues:**
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

**Build errors:**
```bash
# Check for TypeScript errors
cd client && npx tsc --noEmit
```

## 📞 Support

If you encounter issues:
1. Check the logs: `pm2 logs lamhey`
2. Check nginx: `sudo systemctl status nginx`
3. Check GitHub Actions: Repository → Actions tab
4. Create an issue on GitHub

## 🎯 Example: Adding a New Feature

Let's say you want to add a "Settings" page:

```bash
# 1. Create feature branch
./dev.sh feature settings-page

# 2. Create the component
touch client/src/components/Settings.tsx

# 3. Add to Dashboard
# Edit client/src/pages/Dashboard.tsx

# 4. Add styles
# Edit client/src/App.css

# 5. Test locally
./dev.sh start

# 6. Finish feature
./dev.sh finish

# 7. Deploy
./dev.sh deploy
```

This workflow ensures your features are tested, built, and deployed automatically! 🚀
