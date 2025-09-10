# AWS Cognito Setup Guide for Lamhey

This guide will help you set up AWS Cognito for authentication in your Lamhey application.

## Step 1: Create AWS Cognito User Pool

1. **Go to AWS Console**
   - Navigate to AWS Cognito service
   - Click "Create user pool"

2. **Configure Sign-in Experience**
   - Choose "Cognito user pool"
   - Configure sign-in options:
     - ✅ Email
     - ✅ Username (optional)
   - Click "Next"

3. **Configure Security Requirements**
   - Password policy: Choose your requirements
   - MFA: Optional (recommended for production)
   - User account recovery: Email only
   - Click "Next"

4. **Configure Sign-up Experience**
   - Self-service sign-up: ✅ Enabled
   - Attribute verification and user account confirmation: Email
   - Required attributes: Email, Name
   - Click "Next"

5. **Configure Message Delivery**
   - Email: Send email with Cognito
   - Click "Next"

6. **Integrate Your App**
   - User pool name: `lamhey-user-pool`
   - App client name: `lamhey-client`
   - Client secret: ✅ Generate a client secret
   - Click "Next"

7. **Review and Create**
   - Review all settings
   - Click "Create user pool"

## Step 2: Configure Hosted UI

1. **Go to App Integration Tab**
   - Click on your user pool
   - Go to "App integration" tab
   - Click "Create app client"

2. **Configure App Client**
   - App type: Public client
   - App client name: `lamhey-web-client`
   - Authentication flows: ✅ Authorization code grant
   - OAuth 2.0 grant types: ✅ Authorization code grant
   - OAuth scopes: ✅ email, ✅ openid, ✅ profile
   - Allowed callback URLs: `http://localhost:3000/dashboard`
   - Allowed sign-out URLs: `http://localhost:3000/`
   - Click "Create app client"

3. **Get Your Configuration Values**
   - Note down the following values:
     - User Pool ID (e.g., `us-east-1_XXXXXXXXX`)
     - App Client ID
     - AWS Region

## Step 3: Update Configuration

1. **Update `client/src/config/cognito.ts`**
   ```typescript
   export const cognitoConfig = {
     userPoolId: 'us-east-1_XXXXXXXXX', // Your User Pool ID
     clientId: 'your-app-client-id',    // Your App Client ID
     region: 'us-east-1',               // Your AWS Region
     hostedUIRedirectSignIn: 'http://localhost:3000/dashboard',
     hostedUIRedirectSignOut: 'http://localhost:3000/',
     hostedUIUrl: 'YOUR_COGNITO_HOSTED_UI_URL', // Will be generated
     scope: ['email', 'openid', 'profile'],
     responseType: 'code'
   };
   ```

2. **Get Hosted UI URL**
   - Go to your User Pool → App integration → Domain
   - Create a domain if you haven't (e.g., `lamhey-auth`)
   - Your hosted UI URL will be: `https://lamhey-auth.auth.us-east-1.amazoncognito.com`

## Step 4: Test the Integration

1. **Build and Run**
   ```bash
   cd client
   npm run build
   cd ../server
   node server.js
   ```

2. **Test Authentication Flow**
   - Visit `http://localhost:3000`
   - Click "Login/SignUp"
   - You should be redirected to AWS Cognito hosted UI
   - After successful authentication, you'll be redirected to `/dashboard`

## Step 5: Production Configuration

For production deployment:

1. **Update Callback URLs**
   - Add your production domain to allowed callback URLs
   - Example: `https://yourdomain.com/dashboard`

2. **Update Configuration**
   - Change `hostedUIRedirectSignIn` to your production URL
   - Change `hostedUIRedirectSignOut` to your production URL

3. **Environment Variables**
   - Store sensitive values in environment variables
   - Never commit actual credentials to version control

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Check that your callback URL is exactly as configured in Cognito
   - Ensure no trailing slashes

2. **"Invalid client"**
   - Verify your App Client ID is correct
   - Check that the client is configured for public use

3. **"Invalid scope"**
   - Ensure the scopes match what's configured in Cognito
   - Check that the scopes are enabled for your app client

### Testing Locally:

1. Make sure your server is running on port 3001
2. Check browser console for any errors
3. Verify the Cognito configuration values are correct

## Security Notes

- Never expose your User Pool ID or Client ID in client-side code for production
- Use environment variables for sensitive configuration
- Consider using AWS Amplify for more secure integration
- Enable MFA for production environments
- Regularly rotate your client secrets

## Next Steps

After setting up Cognito:

1. Implement token exchange in the callback
2. Add proper error handling
3. Implement refresh token logic
4. Add user profile management
5. Implement photo upload functionality in the dashboard
