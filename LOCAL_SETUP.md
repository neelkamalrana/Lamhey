# Local Development Setup

This project has been configured for local development only. All deployment-related files have been removed.

## Prerequisites

- Node.js 18+ 
- npm 8+

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm run setup
   ```

2. **Configure Cognito (Required):**
   
   Create a `.env.local` file in the `client` directory with your Cognito configuration:
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
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3000 (API routes)

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client:dev` - Start only the frontend
- `npm run server:dev` - Start only the backend
- `npm run setup` - Install all dependencies
- `npm run clean` - Clean all node_modules and build artifacts

## Cognito Configuration

Make sure your AWS Cognito User Pool is configured with:
- **Callback URL**: `http://localhost:3000/callback`
- **Sign out URL**: `http://localhost:3000/`
- **Allowed OAuth Flows**: Authorization code grant
- **Allowed OAuth Scopes**: email, openid

## Notes

- The application is now configured for localhost only
- All deployment files (nginx.conf, deploy.sh) have been removed
- Build artifacts are cleaned up automatically
