// Example OAuth conditions you might need

// 1. Check if user is authenticated
const isAuthenticated = !!user && !!accessToken;

// 2. Check token expiry
const isTokenValid = accessToken && tokenExpiry > Date.now();

// 3. Check specific permissions/scopes
const hasReadPermission = scopes.includes('read');
const hasWritePermission = scopes.includes('write');

// 4. Check OAuth provider
const isGoogleAuth = provider === 'google';
const isFacebookAuth = provider === 'facebook';

// 5. Conditional rendering based on auth state
{isAuthenticated ? (
  <UserProfile user={user} />
) : (
  <LoginButton />
)}

// 6. Route protection
const requireAuth = (component) => {
  return isAuthenticated ? component : <Redirect to="/login" />;
};