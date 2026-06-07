import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useUserStore();
  const { syncGuestCart } = useCartStore();
  const { syncGuestWishlist } = useWishlistStore();
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

          // Decode JWT payload directly — no need for extra /api/auth/me call
          const payload = JSON.parse(atob(token.split('.')[1]));
          const user = {
            id: payload.sub,
            email: payload.email,
            firstName: payload.first_name || payload.given_name || '',
            lastName: payload.last_name || payload.family_name || '',
            first_name: payload.first_name || payload.given_name || '',
            last_name: payload.last_name || payload.family_name || '',
            avatar_url: payload.avatar_url || payload.picture || null,
            avatar: payload.avatar_url || payload.picture || null,
          };

          if (user.id || user.email) {
            login(user, token);

            await syncGuestCart();
            await syncGuestWishlist();

            toast({ title: 'Welcome!', description: 'Successfully signed in with Google' });
            window.location.href = redirect;
          } else {
            throw new Error('Invalid token payload');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          toast({
            title: 'Authentication Error',
            description: error instanceof Error ? error.message : 'Failed to complete authentication',
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