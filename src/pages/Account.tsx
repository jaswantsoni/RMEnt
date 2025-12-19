import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store/userStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/hooks/use-toast';

type AccountTab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';

export default function Account() {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');
  const { user, isAuthenticated, logout } = useUserStore();
  const { items: wishlistItems } = useWishlistStore();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'orders' as const, label: 'Orders', icon: Package },
    { id: 'wishlist' as const, label: 'Wishlist', icon: Heart },
    { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  // Mock orders for demo
  const orders = [
    { id: '1', orderNumber: 'AZH-2024-001', date: '2024-01-15', status: 'Delivered', total: 45999, items: 2 },
    { id: '2', orderNumber: 'AZH-2024-002', date: '2024-01-20', status: 'Processing', total: 24999, items: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-display font-bold mb-2">My Account</h1>
            <p className="text-foreground/60 mb-8">Manage your profile, orders, and preferences</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border/50 p-4 sticky top-28">
                <div className="flex items-center gap-4 p-4 border-b border-border/50 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-semibold text-primary">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-foreground/60">{user?.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground/60 hover:bg-card hover:text-foreground'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
                <div className="pt-4 mt-4 border-t border-border/50">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    Log Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border/50 p-6"
              >
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-display font-semibold mb-6">Profile Information</h2>
                    <form className="space-y-4 max-w-lg">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input defaultValue={user?.firstName} className="bg-background border-border/50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input defaultValue={user?.lastName} className="bg-background border-border/50" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" defaultValue={user?.email} className="bg-background border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input type="tel" defaultValue={user?.phone || ''} className="bg-background border-border/50" />
                      </div>
                      <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                    </form>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-xl font-display font-semibold mb-6">Order History</h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-foreground/20 mb-4" />
                        <p className="text-foreground/60">No orders yet</p>
                        <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                          <Link to="/collections">Start Shopping</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/50">
                            <div>
                              <p className="font-medium">{order.orderNumber}</p>
                              <p className="text-sm text-foreground/60">{order.date} • {order.items} items</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${order.total.toLocaleString()}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-foreground/40" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-xl font-display font-semibold mb-6">My Wishlist</h2>
                    {wishlistItems.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-foreground/20 mb-4" />
                        <p className="text-foreground/60">Your wishlist is empty</p>
                        <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
                          <Link to="/collections">Explore Products</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {wishlistItems.slice(0, 4).map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 bg-background rounded-xl border border-border/50">
                            <img src={item.images?.[0]?.url || '/placeholder.svg'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div>
                              <p className="font-medium line-clamp-1">{item.name}</p>
                              <p className="text-primary font-semibold">${item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {wishlistItems.length > 0 && (
                      <Button asChild variant="outline" className="mt-4 border-border/50">
                        <Link to="/wishlist">View All Wishlist Items</Link>
                      </Button>
                    )}
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <h2 className="text-xl font-display font-semibold mb-6">Saved Addresses</h2>
                    <div className="text-center py-12">
                      <MapPin className="h-12 w-12 mx-auto text-foreground/20 mb-4" />
                      <p className="text-foreground/60">No addresses saved yet</p>
                      <Button className="mt-4 bg-primary hover:bg-primary/90">Add New Address</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-xl font-display font-semibold mb-6">Account Settings</h2>
                    <div className="space-y-6 max-w-lg">
                      <div className="p-4 bg-background rounded-xl border border-border/50">
                        <h3 className="font-medium mb-2">Email Notifications</h3>
                        <p className="text-sm text-foreground/60 mb-3">Receive updates about orders and promotions</p>
                        <Button variant="outline" size="sm" className="border-border/50">Manage Preferences</Button>
                      </div>
                      <div className="p-4 bg-background rounded-xl border border-border/50">
                        <h3 className="font-medium mb-2">Password</h3>
                        <p className="text-sm text-foreground/60 mb-3">Change your account password</p>
                        <Button variant="outline" size="sm" className="border-border/50">Change Password</Button>
                      </div>
                      <div className="p-4 bg-background rounded-xl border border-destructive/50">
                        <h3 className="font-medium text-destructive mb-2">Delete Account</h3>
                        <p className="text-sm text-foreground/60 mb-3">Permanently delete your account and all data</p>
                        <Button variant="destructive" size="sm">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
