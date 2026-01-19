import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUserStore();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      // Decode HTML entities in URL (backend may send &amp; instead of &)
      const urlString = window.location.href.replace(/&amp;/g, '&');
      const url = new URL(urlString);
      const params = new URLSearchParams(url.search);
      
      const token = params.get('token');
      const error = params.get('error');
      const redirect = params.get('redirect') || '/';

      if (error) {
        toast({
          title: 'Authentication Failed',
          description: error,
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      if (token) {
        try {
          console.log('Token received:', token);
          
          // Try to decode JWT to get user info
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', payload);
            
            // If token has user info, use it directly
            if (payload.email || payload.sub) {
              const user = {
                id: payload.sub || payload.id,
                email: payload.email,
                firstName: payload.given_name || payload.first_name || '',
                lastName: payload.family_name || payload.last_name || '',
                avatar: payload.picture || payload.avatar_url,
                addresses: [],
                createdAt: new Date().toISOString(),
              };
              
              login(user, token);
              toast({
                title: 'Welcome!',
                description: 'Successfully signed in',
              });
              navigate(redirect);
              return;
            }
          } catch (e) {
            console.log('Could not decode token, fetching from API');
          }
          
          // Fetch user data with token
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            const responseText = await response.text();
            console.log('Response body:', responseText.substring(0, 200));
            
            if (!contentType || !contentType.includes('application/json')) {
              console.error('Expected JSON but got:', contentType);
              throw new Error(`Server returned ${contentType || 'unknown'} instead of JSON`);
            }
            
            const userData = JSON.parse(responseText);
            console.log('User data received:', userData);
            
            // Handle different response formats
            const user = userData.data?.user || userData.user || userData.data || userData;
            
            if (user) {
              login(user, token);
              toast({
                title: 'Welcome!',
                description: 'Successfully signed in with Google',
              });
              navigate(redirect);
            } else {
              throw new Error('No user data in response');
            }
          } else {
            const errorData = await response.text();
            console.error('Auth response error:', errorData);
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to complete authentication';
          toast({
            title: 'Authentication Error',
            description: errorMessage,
            variant: 'destructive',
          });
          navigate('/auth');
        }
      } else {
        navigate('/auth');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}