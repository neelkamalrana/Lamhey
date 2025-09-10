# Lamhey

A modern web application built with React, Tailwind CSS, and Node.js, optimized for EC2 deployment with GitHub integration.

## 🚀 Features

- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express.js
- **Security**: Helmet.js, CORS, Rate Limiting
- **Development**: Hot reload, TypeScript support
- **Deployment**: EC2 ready with production optimizations
- **CI/CD**: GitHub Actions integration ready

## 📁 Project Structure

```
lamhey/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main App component
│   │   ├── index.tsx      # Entry point
│   │   └── index.css      # Global styles with Tailwind
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── server/                # Node.js backend
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables example
├── package.json           # Root package.json
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🛠️ Prerequisites

- Node.js (>= 18.0.0)
- npm (>= 8.0.0)
- Git

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lamhey
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   # Edit .env with your configuration
   ```

## 🚀 Development

### Start both frontend and backend in development mode
```bash
npm run dev
```

This will start:
- React development server on `http://localhost:3000`
- Express server on `http://localhost:5000`

### Start services individually

**Frontend only:**
```bash
npm run client:dev
```

**Backend only:**
```bash
npm run server:dev
```

## 🏗️ Building for Production

1. **Build the React app**
   ```bash
   npm run build
   ```

2. **Install production dependencies**
   ```bash
   npm run build:all
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## 🌐 API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/info` - Application information
- `GET /api/data` - Sample data endpoint

## 🚀 EC2 Deployment

### 1. Launch EC2 Instance

- Choose Amazon Linux 2 or Ubuntu 20.04 LTS
- Select t2.micro (free tier) or larger
- Configure security group to allow:
  - SSH (port 22)
  - HTTP (port 80)
  - HTTPS (port 443)
  - Custom TCP (port 5000 for development)

### 2. Connect to EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### 3. Install Node.js

**For Amazon Linux 2:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

**For Ubuntu:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 4. Install Git and Clone Repository

```bash
sudo yum install git -y  # Amazon Linux
# or
sudo apt install git -y  # Ubuntu

git clone <your-repo-url>
cd lamhey
```

### 5. Install Dependencies and Build

```bash
npm run install:all
npm run build:all
```

### 6. Set up Environment Variables

```bash
cd server
cp env.example .env
nano .env  # Edit with production values
```

### 7. Install PM2 for Process Management

```bash
npm install -g pm2
```

### 8. Start the Application

```bash
pm2 start server.js --name "lamhey"
pm2 startup
pm2 save
```

### 9. Set up Nginx (Optional but Recommended)

```bash
sudo yum install nginx -y  # Amazon Linux
# or
sudo apt install nginx -y  # Ubuntu

sudo systemctl start nginx
sudo systemctl enable nginx
```

Create Nginx configuration:
```bash
sudo nano /etc/nginx/conf.d/lamhey.conf
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

## 🔧 Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Client Configuration
CLIENT_URL=http://your-domain.com

# Security
ALLOWED_ORIGINS=http://your-domain.com,https://your-domain.com
```

## 📝 GitHub Integration

### 1. Create GitHub Repository

1. Go to GitHub and create a new repository
2. Copy the repository URL

### 2. Initialize Git and Push

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 3. Set up GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to EC2
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USERNAME }}
        key: ${{ secrets.EC2_SSH_KEY }}
        script: |
          cd /path/to/lamhey
          git pull origin main
          npm run build:all
          pm2 restart lamhey
```

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests (when implemented)
cd server
npm test
```

## 📊 Monitoring

### PM2 Commands

```bash
pm2 status          # Check status
pm2 logs lamhey     # View logs
pm2 restart lamhey  # Restart app
pm2 stop lamhey     # Stop app
pm2 delete lamhey   # Delete app
```

### Health Check

Visit `http://your-ec2-ip:5000/api/health` to check if the application is running.

## 🔒 Security Considerations

- Change default SSH port
- Use SSH keys instead of passwords
- Configure firewall rules
- Use HTTPS in production
- Keep dependencies updated
- Use environment variables for sensitive data

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /path/to/lamhey
   ```

3. **Node modules issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

Built with ❤️ for EC2 deployment
# Testing deployment with secrets
# Force fresh deployment - Wed Sep 10 10:04:51 EDT 2025
