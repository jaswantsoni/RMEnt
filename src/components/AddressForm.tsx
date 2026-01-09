import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Address {
  id?: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface AddressFormProps {
  address?: Address;
  onSave: (address: Omit<Address, 'id'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function AddressForm({ address, onSave, onCancel, loading }: AddressFormProps) {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: address?.type || 'shipping',
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    company: address?.company || '',
    address1: address?.address1 || '',
    address2: address?.address2 || '',
    city: address?.city || '',
    state: address?.state || '',
    zipCode: address?.zipCode || '',
    country: address?.country || 'US',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Address Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox 
            id="isDefault" 
            checked={formData.isDefault}
            onCheckedChange={(checked) => handleChange('isDefault', !!checked)}
          />
          <Label htmlFor="isDefault">Set as default</Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="company">Company (Optional)</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="address1">Address Line 1</Label>
        <Input
          id="address1"
          value={formData.address1}
          onChange={(e) => handleChange('address1', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
        <Input
          id="address2"
          value={formData.address2}
          onChange={(e) => handleChange('address2', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Address'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}