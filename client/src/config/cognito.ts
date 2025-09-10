// AWS Cognito Configuration
// Values are read from environment variables. For CRA, they must be prefixed with REACT_APP_.

const env = process.env as Record<string, string | undefined>;

export const cognitoConfig = {
	userPoolId: env.REACT_APP_COGNITO_USER_POOL_ID || '',
	clientId: env.REACT_APP_COGNITO_CLIENT_ID || '',
	region: env.REACT_APP_COGNITO_REGION || '',
	// Full hosted UI domain host. Example: lamhey-auth.auth.us-east-2.amazoncognito.com
	// If you configured a custom domain, put that full host here.
	hostedUIDomainHost: (env.REACT_APP_COGNITO_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, ''),
	hostedUIRedirectSignIn: env.REACT_APP_COGNITO_REDIRECT_SIGNIN || 'http://localhost:3000/dashboard',
	hostedUIRedirectSignOut: env.REACT_APP_COGNITO_REDIRECT_SIGNOUT || 'http://localhost:3000/',
	scope: (env.REACT_APP_COGNITO_SCOPES || 'email openid').split(/[ ,]+/).filter(Boolean),
	responseType: env.REACT_APP_COGNITO_RESPONSE_TYPE || 'code',
	// Direct URL for Cognito Hosted UI
	hostedUIUrl: env.REACT_APP_COGNITO_HOSTED_UI_URL || '',
};

function resolveHostedBaseUrl(): string {
	// Prefer explicit domain host if provided
	if (cognitoConfig.hostedUIDomainHost) {
		return `https://${cognitoConfig.hostedUIDomainHost}`;
	}
	// Fallback: derive from userPoolId and region (note: this is not always correct; domain uses a prefix, not pool id)
	if (cognitoConfig.userPoolId && cognitoConfig.region) {
		return `https://${cognitoConfig.userPoolId}.auth.${cognitoConfig.region}.amazoncognito.com`;
	}
	return '';
}

// Function to get Cognito Hosted UI URL
export const getCognitoHostedUIUrl = (): string => {
	// If we have a hardcoded URL, use it
	if (cognitoConfig.hostedUIUrl) {
		return cognitoConfig.hostedUIUrl;
	}
	
	// Otherwise, build the URL dynamically
	const baseUrl = `https://${cognitoConfig.hostedUIDomainHost}`;
	const params = new URLSearchParams({
		client_id: cognitoConfig.clientId,
		response_type: cognitoConfig.responseType,
		scope: cognitoConfig.scope.join(' '),
		redirect_uri: cognitoConfig.hostedUIRedirectSignIn
	});
	return `${baseUrl}/login?${params.toString()}`;
};

// Function to handle Cognito callback and extract authorization code
export const handleCognitoCallback = () => {
	const urlParams = new URLSearchParams(window.location.search);
	const code = urlParams.get('code');
	const error = urlParams.get('error');

	if (error) {
		console.error('Cognito authentication error:', error);
		return { success: false, error } as const;
	}

	if (code) {
		// Store the authorization code for token exchange (server-side recommended)
		localStorage.setItem('cognito_auth_code', code);
		return { success: true, code } as const;
	}

	return { success: false, error: 'No authorization code received' } as const;
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
	return !!localStorage.getItem('cognito_auth_code') || !!localStorage.getItem('cognito_user');
};

// Function to get user info from localStorage
export const getCurrentUser = () => {
	const userData = localStorage.getItem('cognito_user');
	if (userData) {
		try {
			return JSON.parse(userData);
		} catch (error) {
			console.error('Error parsing user data:', error);
			return null;
		}
	}
	return null;
};

// Function to create mock user data after successful Cognito authentication
export const createMockUser = (authCode: string) => {
	const mockUser = {
		attributes: {
			name: 'User',
			email: 'user@example.com'
		},
		username: 'user',
		authCode: authCode
	};
	localStorage.setItem('cognito_user', JSON.stringify(mockUser));
	return mockUser;
};

// Function to sign out
export const signOut = () => {
	localStorage.removeItem('cognito_auth_code');
	localStorage.removeItem('cognito_user');
	// Redirect to Cognito sign out
	const signOutUrl = `https://${cognitoConfig.hostedUIDomainHost}/logout?client_id=${cognitoConfig.clientId}&logout_uri=${encodeURIComponent(cognitoConfig.hostedUIRedirectSignOut)}`;
	window.location.href = signOutUrl;
};
