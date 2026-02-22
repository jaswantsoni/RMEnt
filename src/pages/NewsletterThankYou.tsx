import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export default function NewsletterThankYou() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <CheckCircle className="relative h-24 w-24 text-primary" strokeWidth={1.5} />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Welcome to the <span className="text-gradient-gold">Azzaro</span> Family!
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Thank you for subscribing to our newsletter
          </p>

          {/* Info Card */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-2">Check Your Inbox</h3>
                <p className="text-muted-foreground">
                  We've sent a welcome email to your inbox with exclusive offers and design inspiration. 
                  If you don't see it, please check your spam folder.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-semibold mb-3">What's Next?</h4>
              <ul className="text-left space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Get exclusive access to new collections before anyone else</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Receive special promotions and member-only discounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Stay updated with the latest interior design trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Expert tips to elevate your living spaces</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/collections">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Collections
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of design enthusiasts who trust Azzaro Home
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-xs text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Premium Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-xs text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
