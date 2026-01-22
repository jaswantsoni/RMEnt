import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useAddressStore } from '@/store/addressStore';
import { useToast } from '@/hooks/use-toast';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function Checkout() {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const { cart, clearCart } = useCartStore();
  const { isAuthenticated, user } = useUserStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // In production, call api.createOrder()
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearCart();
      toast({ title: 'Order placed!', description: 'Thank you for your purchase. You will receive a confirmation email shortly.' });
      navigate('/account/orders');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to place order. Please try again.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Load user data and addresses
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to proceed with checkout.',
      });
      navigate('/auth?redirect=/checkout');
      return;
    }

    // Fetch addresses
    fetchAddresses();

    // Pre-fill form with user data
    if (user) {
      setShippingData(prev => ({
        ...prev,
        firstName: user.firstName || user.first_name || prev.firstName,
        lastName: user.lastName || user.last_name || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, navigate, toast, fetchAddresses, user]);

  // Pre-fill with default address when addresses load
  useEffect(() => {
    if (Array.isArray(addresses) && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault && addr.type === 'shipping');
      if (defaultAddress && !shippingData.address1) {
        setShippingData(prev => ({
          ...prev,
          firstName: defaultAddress.firstName || prev.firstName,
          lastName: defaultAddress.lastName || prev.lastName,
          phone: defaultAddress.phone || prev.phone,
          address1: defaultAddress.address1,
          address2: defaultAddress.address2 || '',
          city: defaultAddress.city,
          state: defaultAddress.state,
          postalCode: defaultAddress.zipCode,
          country: defaultAddress.country,
        }));
      }
    }
  }, [addresses]);

  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal > 1000 ? 0 : 30;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  // Don't render checkout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 lg:px-8 text-center py-20">
            <h2 className="text-2xl font-display font-semibold mb-4">Your cart is empty</h2>
            <p className="text-foreground/60 mb-8">Add some products to proceed with checkout.</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/collections">Browse Collections</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/collections" className="inline-flex items-center gap-2 text-foreground/60 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8 px-4">
                {['shipping', 'payment', 'review'].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        step === s ? 'bg-primary text-primary-foreground' :
                        ['shipping', 'payment', 'review'].indexOf(step) > i ? 'bg-primary/20 text-primary' : 'bg-card text-foreground/40'
                      }`}
                    >
                      {['shipping', 'payment', 'review'].indexOf(step) > i ? <Check className="h-5 w-5" /> : i + 1}
                    </div>
                    {i < 2 && <div className={`w-20 sm:w-32 h-0.5 mx-2 ${['shipping', 'payment', 'review'].indexOf(step) > i ? 'bg-primary' : 'bg-border'}`} />}
                  </div>
                ))}
              </div>

              {/* Shipping Form */}
              {step === 'shipping' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-display font-semibold mb-6">Shipping Address</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" value={shippingData.firstName} onChange={handleShippingChange} required className="bg-card border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" value={shippingData.lastName} onChange={handleShippingChange} required className="bg-card border-border/50" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={shippingData.email} onChange={handleShippingChange} required className="bg-card border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" value={shippingData.phone} onChange={handleShippingChange} required className="bg-card border-border/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address1">Address</Label>
                      <Input id="address1" name="address1" value={shippingData.address1} onChange={handleShippingChange} required className="bg-card border-border/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                      <Input id="address2" name="address2" value={shippingData.address2} onChange={handleShippingChange} className="bg-card border-border/50" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={shippingData.city} onChange={handleShippingChange} required className="bg-card border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" value={shippingData.state} onChange={handleShippingChange} required className="bg-card border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" name="postalCode" value={shippingData.postalCode} onChange={handleShippingChange} required className="bg-card border-border/50" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 mt-6">Continue to Payment</Button>
                  </form>
                </motion.div>
              )}

              {/* Payment Form */}
              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-display font-semibold mb-6">Payment Method</h2>
                  <form onSubmit={handlePaymentSubmit}>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      {[
                        { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                        { value: 'upi', label: 'UPI Payment', icon: Shield },
                        { value: 'cod', label: 'Cash on Delivery', icon: Truck },
                      ].map((method) => (
                        <div key={method.value} className={`flex items-center space-x-4 p-4 rounded-xl border transition-colors cursor-pointer ${paymentMethod === method.value ? 'border-primary bg-primary/5' : 'border-border/50 bg-card'}`}>
                          <RadioGroupItem value={method.value} id={method.value} />
                          <Label htmlFor={method.value} className="flex items-center gap-3 cursor-pointer flex-1">
                            <method.icon className="h-5 w-5 text-foreground/60" />
                            {method.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {paymentMethod === 'card' && (
                      <div className="mt-6 space-y-4 p-4 bg-card rounded-xl border border-border/50">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="bg-background border-border/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" className="bg-background border-border/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" className="bg-background border-border/50" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 mt-6">
                      <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="flex-1 h-12 border-border/50">Back</Button>
                      <Button type="submit" className="flex-1 h-12 bg-primary hover:bg-primary/90">Review Order</Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Review */}
              {step === 'review' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-display font-semibold mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-card rounded-xl border border-border/50">
                      <h3 className="font-medium mb-3">Shipping Address</h3>
                      <p className="text-foreground/60 text-sm">
                        {shippingData.firstName} {shippingData.lastName}<br />
                        {shippingData.address1}{shippingData.address2 && `, ${shippingData.address2}`}<br />
                        {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                      </p>
                    </div>

                    <div className="p-4 bg-card rounded-xl border border-border/50">
                      <h3 className="font-medium mb-3">Payment Method</h3>
                      <p className="text-foreground/60 text-sm capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI Payment' : 'Credit/Debit Card'}</p>
                    </div>

                    <div className="p-4 bg-card rounded-xl border border-border/50">
                      <h3 className="font-medium mb-3">Order Items ({cart.items.length})</h3>
                      <div className="space-y-3">
                        {cart.items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <img src={item.product.images?.[0]?.url || '/placeholder.svg'} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-foreground/60 text-sm">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${item.total.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep('payment')} className="flex-1 h-12 border-border/50">Back</Button>
                    <Button onClick={handlePlaceOrder} disabled={isProcessing} className="flex-1 h-12 bg-primary hover:bg-primary/90">
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border/50 p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 pb-4 border-b border-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Subtotal ({cart.items.length} items)</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Tax (18% GST)</span>
                    <span>${tax.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${total.toLocaleString()}</span>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Truck className="h-4 w-4" />
                    Free shipping on orders above $1,000
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Shield className="h-4 w-4" />
                    Secure checkout with SSL encryption
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
