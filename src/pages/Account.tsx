import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, LogOut, Edit2, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressForm } from '@/components/AddressForm';
import { useUserStore } from '@/store/userStore';
import { useAddressStore } from '@/store/addressStore';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { user, logout, setUser } = useUserStore();
  const { addresses, fetchAddresses, addAddress, deleteAddress } = useAddressStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log('User data in Account:', user);
  
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.first_name || '',
    lastName: user?.lastName || user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    fetchAddresses();
    fetchUserDetails();
  }, [fetchAddresses]);
  
  const fetchUserDetails = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const rawUser = result.data?.user;
        
        if (rawUser) {
          const normalizedUser = {
            ...rawUser,
            firstName: rawUser.first_name || '',
            lastName: rawUser.last_name || '',
            addresses: rawUser.addresses || [],
          };
          
          setUser(normalizedUser);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };
  
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || user.first_name || '',
        lastName: user.lastName || user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const rawUser = result.data?.user;
        
        if (rawUser) {
          const normalizedUser = {
            ...rawUser,
            firstName: rawUser.first_name || '',
            lastName: rawUser.last_name || '',
          };
          
          setUser(normalizedUser);
          toast({
            title: 'Profile Updated',
            description: 'Your profile has been updated successfully.',
          });
          setIsEditing(false);
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card rounded-lg p-8 shadow-sm border">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {(() => {
                      const imageUrl = user?.avatar_url;
                      console.log('Profile image URL:', imageUrl);
                      console.log('Full user object:', user);
                      
                      return imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Image failed to load:', imageUrl);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <User className="h-8 w-8 text-foreground" />
                      );
                    })()} 
                  </div>
                  <div>
                    <h1 className="text-2xl font-display font-semibold">
                      {user?.firstName || user?.first_name || 'User'} {user?.lastName || user?.last_name || ''}
                    </h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-foreground"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="text-foreground" disabled={isLoading}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Addresses</h3>
                  <Button onClick={() => setShowAddressForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
                
                {showAddressForm ? (
                  <AddressForm
                    onSave={async (address) => {
                      try {
                        await addAddress(address);
                        setShowAddressForm(false);
                        toast({ title: 'Address added successfully' });
                      } catch (error) {
                        console.error('Error adding address:', error);
                        toast({ 
                          title: 'Error', 
                          description: 'Failed to add address',
                          variant: 'destructive'
                        });
                      }
                    }}
                    onCancel={() => setShowAddressForm(false)}
                  />
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(user?.addresses) && user.addresses.length > 0 ? (
                      user.addresses.map((address: any) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {address.first_name} {address.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.address_line_1}
                                {address.address_line_2 && `, ${address.address_line_2}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zip_code}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.phone}
                              </p>
                              {address.is_default && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2 inline-block">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}