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
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const redirect = searchParams.get('redirect') || '/';

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
          toast({
            title: 'Error',
            description: 'Failed to complete authentication',
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