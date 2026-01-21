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
      console.log('Raw URL:', window.location.href);
      console.log('Search params:', window.location.search);
      
      // Decode HTML entities in URL (backend may send &amp; instead of &)
      const urlString = window.location.href.replace(/&amp;/g, '&');
      const url = new URL(urlString);
      const params = new URLSearchParams(url.search);
      
      const token = params.get('token');
      const error = params.get('error');
      const redirect = params.get('redirect') || '/';
      
      console.log('Parsed token:', token);
      console.log('Parsed error:', error);
      console.log('Parsed redirect:', redirect);

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
          
          // Fetch user data with token
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('Response status:', response.status);
          
          if (response.ok) {
            const userData = await response.json();
            console.log('User data received:', userData);
            
            // Handle different response formats
            const rawUser = userData.data?.user || userData.user || userData.data || userData;
            
            // Normalize user data
            const user = {
              ...rawUser,
              firstName: rawUser.firstName || rawUser.first_name || rawUser.given_name || '',
              lastName: rawUser.lastName || rawUser.last_name || rawUser.family_name || '',
              first_name: rawUser.first_name || rawUser.firstName || rawUser.given_name || '',
              last_name: rawUser.last_name || rawUser.lastName || rawUser.family_name || '',
              avatar_url: rawUser.avatar_url || rawUser.avatar || rawUser.picture,
              avatar: rawUser.avatar || rawUser.avatar_url || rawUser.picture,
            };
            
            console.log('Normalized user data:', user);
            
            if (user.id || user.email) {
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