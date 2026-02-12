import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, Shield, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useAddressStore } from '@/store/addressStore';
import { useToast } from '@/hooks/use-toast';
import { formatUSD, calculateCartTotals, getTaxRate } from '@/lib/usUtils';
import { apiClient } from '@/lib/apiClient';
import { customerApi } from '@/services/customerApi';

// type CheckoutStep = 'shipping' | 'payment' | 'review';
type CheckoutStep = 'shipping' | 'review';

export default function Checkout() {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [selectedBillingId, setSelectedBillingId] = useState<string | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
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
    country: 'US',
  });


  const { cart, clearCart } = useCartStore();
  const { isAuthenticated, user } = useUserStore();
  const { addresses, fetchAddresses } = useAddressStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await customerApi.addAddress({
      type: 'shipping',
      firstName: shippingData.firstName,
      lastName: shippingData.lastName,
      phone: shippingData.phone,
      address1: shippingData.address1,
      address2: shippingData.address2,
      city: shippingData.city,
      state: shippingData.state,
      zipCode: shippingData.postalCode,
      country: shippingData.country,
      isDefault: true,
    });
    await fetchAddresses();
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        line_items: cart.items.map(item => ({
          item_id: item.product.item_id,
          quantity: item.quantity,
          unit: 'Nos'
        })),
        shipping_address: selectedShippingId,
        billing_address: sameAsShipping ? selectedShippingId : selectedBillingId
      };

      await apiClient.post('/api/contact/order', orderData);

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

    // Fetch addresses on mount
    const loadAddresses = async () => {
      await fetchAddresses();
      console.log('Addresses after fetch:', addresses);
    };
    loadAddresses();

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
    if (Array.isArray(addresses) && addresses.length > 0 && !selectedShippingId) {
      const defaultShipping = addresses.find(addr => addr.isDefault && addr.type === 'shipping');
      const defaultBilling = addresses.find(addr => addr.isDefault && addr.type === 'billing');
      
      if (defaultShipping) {
        setSelectedShippingId(defaultShipping.id);
        setShippingData({
          firstName: defaultShipping.firstName || '',
          lastName: defaultShipping.lastName || '',
          email: user?.email || '',
          phone: defaultShipping.phone || '',
          address1: defaultShipping.address1,
          address2: defaultShipping.address2 || '',
          city: defaultShipping.city,
          state: defaultShipping.state,
          postalCode: defaultShipping.zipCode,
          country: defaultShipping.country,
        });
      }
      
      if (defaultBilling) {
        setSelectedBillingId(defaultBilling.id);
        setSameAsShipping(false);
      }
    }
  }, [addresses, selectedShippingId, user]);

  const subtotal = cart?.subtotal || 0;
  const { tax, shipping, total } = calculateCartTotals(subtotal, shippingData.state);
  const taxRate = getTaxRate(shippingData.state);

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
              <div className="flex items-center justify-between mb-8 px-4 max-w-md mx-auto">
                {['shipping', 'review'].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        step === s ? 'bg-primary text-primary-foreground' :
                        ['shipping', 'review'].indexOf(step) > i ? 'bg-primary/20 text-slate-800' : 'bg-card text-slate-400'
                      }`}
                    >
                      {['shipping', 'review'].indexOf(step) > i ? <Check className="h-5 w-5" /> : i + 1}
                    </div>
                    {i < 1 && <div className={`w-32 sm:w-48 h-0.5 mx-2 ${['shipping', 'review'].indexOf(step) > i ? 'bg-primary' : 'bg-border'}`} />}
                  </div>
                ))}
              </div>

              {/* Shipping Form */}
              {step === 'shipping' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-display font-semibold mb-6">Shipping Address</h2>
                  
                  {/* Saved Addresses */}
                  {Array.isArray(addresses) && addresses.length > 0 && !showNewAddressForm && (
                    <div className="space-y-6 mb-6">
                      {/* Shipping Address */}
                      <div className="space-y-3">
                        <h3 className="font-medium">Shipping Address</h3>
                        <div className="grid gap-3">
                          {addresses.filter(addr => addr.type === 'shipping').map((addr) => (
                            <div
                              key={addr.id}
                              onClick={() => {
                                setSelectedShippingId(addr.id);
                                setShippingData({
                                  firstName: addr.firstName,
                                  lastName: addr.lastName,
                                  email: user?.email || '',
                                  phone: addr.phone,
                                  address1: addr.address1,
                                  address2: addr.address2 || '',
                                  city: addr.city,
                                  state: addr.state,
                                  postalCode: addr.zipCode,
                                  country: addr.country,
                                });
                              }}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedShippingId === addr.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                              <p className="text-sm text-muted-foreground">
                                {addr.address1}{addr.address2 && `, ${addr.address2}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {addr.city}, {addr.state} {addr.zipCode}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Same as Shipping Checkbox */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sameAsShipping"
                          checked={sameAsShipping}
                          onChange={(e) => setSameAsShipping(e.target.checked)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <Label htmlFor="sameAsShipping" className="cursor-pointer">Billing address same as shipping</Label>
                      </div>

                      {/* Billing Address */}
                      {!sameAsShipping && (
                        <div className="space-y-3">
                          <h3 className="font-medium">Billing Address</h3>
                          <div className="grid gap-3">
                            {addresses.filter(addr => addr.type === 'billing').map((addr) => (
                              <div
                                key={addr.id}
                                onClick={() => setSelectedBillingId(addr.id)}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                  selectedBillingId === addr.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {addr.address1}{addr.address2 && `, ${addr.address2}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {addr.city}, {addr.state} {addr.zipCode}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewAddressForm(true)}
                        className="w-full"
                      >
                        + Add New Address
                      </Button>
                    </div>
                  )}

                  {/* New Address Form */}
                  {(showNewAddressForm || !Array.isArray(addresses) || addresses.length === 0) && (
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
                    <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 mt-6">Review Order</Button>
                    {showNewAddressForm && Array.isArray(addresses) && addresses.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewAddressForm(false)}
                        className="w-full h-12 mt-2"
                      >
                        Cancel
                      </Button>
                    )}
                  </form>
                  )}

                  {/* Continue button for saved address */}
                  {!showNewAddressForm && selectedShippingId && (sameAsShipping || selectedBillingId) && (
                    <Button
                      onClick={() => setStep('review')}
                      className="w-full h-12 bg-primary hover:bg-primary/90 mt-6"
                    >
                      Review Order
                    </Button>
                  )}
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
                      <h3 className="font-medium mb-3">Billing Address</h3>
                      <p className="text-foreground/60 text-sm">
                        {sameAsShipping ? (
                          'Same as shipping address'
                        ) : (
                          addresses.find(a => a.id === selectedBillingId) ? (
                            <>
                              {addresses.find(a => a.id === selectedBillingId)?.firstName} {addresses.find(a => a.id === selectedBillingId)?.lastName}<br />
                              {addresses.find(a => a.id === selectedBillingId)?.address1}{addresses.find(a => a.id === selectedBillingId)?.address2 && `, ${addresses.find(a => a.id === selectedBillingId)?.address2}`}<br />
                              {addresses.find(a => a.id === selectedBillingId)?.city}, {addresses.find(a => a.id === selectedBillingId)?.state} {addresses.find(a => a.id === selectedBillingId)?.zipCode}
                            </>
                          ) : 'Not selected'
                        )}
                      </p>
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
                    <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="flex-1 h-12 border-border/50">Back</Button>
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
                    <span>{formatUSD(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatUSD(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Tax ({(taxRate * 100).toFixed(2)}%)</span>
                    <span>{formatUSD(tax)}</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4 text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatUSD(total)}</span>
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
