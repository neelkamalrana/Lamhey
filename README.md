# Lamhey

A modern web application built with React, Tailwind CSS, and Node.js, configured for local development with AWS Cognito authentication.

## 🚀 Features

- **Frontend**: React 18 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express.js
- **Authentication**: AWS Cognito integration
- **Security**: Helmet.js, CORS, Rate Limiting
- **Development**: Hot reload, TypeScript support
- **Local Development**: Optimized for localhost development

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

### Prerequisites

- Node.js (>= 18.0.0)
- npm (>= 8.0.0)
- AWS Cognito User Pool configured

### Quick Start

1. **Install dependencies:**
   ```bash
   npm run setup
   ```

2. **Configure Cognito:**
   
   Create a `.env.local` file in the `client` directory:
   ```bash
   # AWS Cognito Configuration
   REACT_APP_COGNITO_USER_POOL_ID=your_user_pool_id_here
   REACT_APP_COGNITO_CLIENT_ID=your_client_id_here
   REACT_APP_COGNITO_REGION=your_region_here
   REACT_APP_COGNITO_DOMAIN=your_cognito_domain_here
   REACT_APP_COGNITO_REDIRECT_SIGNIN=http://localhost:3000/callback
   REACT_APP_COGNITO_REDIRECT_SIGNOUT=http://localhost:3000/
   REACT_APP_COGNITO_SCOPES=email openid
   REACT_APP_COGNITO_RESPONSE_TYPE=code
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- React development server on `http://localhost:3000`
- Express server on `http://localhost:3000` (API routes)

### Start services individually

**Frontend only:**
```bash
npm run client:dev
```

**Backend only:**
```bash
npm run server:dev
```

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client:dev` - Start only the frontend
- `npm run server:dev` - Start only the backend
- `npm run setup` - Install all dependencies
- `npm run clean` - Clean all node_modules and build artifacts

## 🌐 API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/info` - Application information
- `GET /api/data` - Sample data endpoint

## 🔐 AWS Cognito Setup

### 1. Create Cognito User Pool

1. Go to AWS Cognito Console
2. Click "Create user pool"
3. Choose "Cognito user pool" (not hosted UI)
4. Configure sign-in options (email, username, etc.)
5. Set password policy
6. Configure MFA (optional)
7. Review and create

### 2. Create App Client

1. In your User Pool, go to "App integration" tab
2. Click "Create app client"
3. Choose "Public client" (for web apps)
4. Configure OAuth flows:
   - ✅ Authorization code grant
   - ✅ Implicit grant (if needed)
5. Set callback URLs:
   - `http://localhost:3000/callback`
6. Set sign-out URLs:
   - `http://localhost:3000/`
7. Configure OAuth scopes:
   - ✅ email
   - ✅ openid
   - ✅ profile (optional)

### 3. Configure Domain

1. In "App integration" tab, click "Domain"
2. Choose "Use a Cognito domain"
3. Enter a unique domain name
4. Save the domain (e.g., `your-app-name.auth.us-east-1.amazoncognito.com`)

### 4. Update Environment Variables

Copy the following values from your Cognito setup:

```bash
# In client/.env.local
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_COGNITO_CLIENT_ID=your_client_id_here
REACT_APP_COGNITO_REGION=us-east-1
REACT_APP_COGNITO_DOMAIN=your-app-name.auth.us-east-1.amazoncognito.com
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

## 🔒 Security Considerations

- Keep dependencies updated
- Use environment variables for sensitive data
- Configure CORS properly for production
- Use HTTPS in production
- Validate all user inputs

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Cognito authentication not working**
   - Check your environment variables
   - Verify callback URLs in Cognito console
   - Ensure CORS is configured correctly

3. **Node modules issues**
   ```bash
   npm run clean
   npm run setup
   ```

4. **React dev server not starting**
   ```bash
   cd client
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

Built with ❤️ for local development
