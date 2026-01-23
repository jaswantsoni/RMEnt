import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone is required'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSave?: (address: any) => void;
  onCancel?: () => void;
}

export function AddressForm({ onSave, onCancel }: AddressFormProps) {
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  const shippingForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: user?.phone || '',
    },
  });

  const billingForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      phone: user?.phone || '',
    },
  });

  const handleSubmit = async () => {
    const shippingValid = await shippingForm.trigger();
    const billingValid = sameAsShipping || await billingForm.trigger();

    if (!shippingValid || !billingValid) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const shippingData = shippingForm.getValues();
      const billingData = sameAsShipping ? shippingData : billingForm.getValues();

      // Save shipping address
      const shippingRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customer/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'shipping',
          ...shippingData,
          isDefault: true,
        }),
      });

      if (!shippingRes.ok) throw new Error('Failed to save shipping address');

      // Save billing address
      const billingRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customer/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'billing',
          ...billingData,
          isDefault: true,
        }),
      });

      if (!billingRes.ok) throw new Error('Failed to save billing address');

      toast.success('Addresses saved successfully');
      onSave?.(shippingData);
    } catch (error) {
      toast.error('Failed to save addresses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Shipping Address */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name *</Label>
            <Input {...shippingForm.register('firstName')} />
            {shippingForm.formState.errors.firstName && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label>Last Name *</Label>
            <Input {...shippingForm.register('lastName')} />
            {shippingForm.formState.errors.lastName && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.lastName.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label>Company</Label>
            <Input {...shippingForm.register('company')} />
          </div>
          <div className="col-span-2">
            <Label>Address Line 1 *</Label>
            <Input {...shippingForm.register('address1')} />
            {shippingForm.formState.errors.address1 && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.address1.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label>Address Line 2</Label>
            <Input {...shippingForm.register('address2')} />
          </div>
          <div>
            <Label>City *</Label>
            <Input {...shippingForm.register('city')} />
            {shippingForm.formState.errors.city && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.city.message}</p>
            )}
          </div>
          <div>
            <Label>State *</Label>
            <Input {...shippingForm.register('state')} />
            {shippingForm.formState.errors.state && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.state.message}</p>
            )}
          </div>
          <div>
            <Label>ZIP Code *</Label>
            <Input {...shippingForm.register('zipCode')} />
            {shippingForm.formState.errors.zipCode && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.zipCode.message}</p>
            )}
          </div>
          <div>
            <Label>Country *</Label>
            <Input {...shippingForm.register('country')} />
            {shippingForm.formState.errors.country && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.country.message}</p>
            )}
          </div>
          <div className="col-span-2">
            <Label>Phone *</Label>
            <Input {...shippingForm.register('phone')} />
            {shippingForm.formState.errors.phone && (
              <p className="text-sm text-destructive mt-1">{shippingForm.formState.errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Same as Shipping Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="sameAsShipping"
          checked={sameAsShipping}
          onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
        />
        <Label htmlFor="sameAsShipping" className="cursor-pointer">
          Billing address same as shipping
        </Label>
      </div>

      {/* Billing Address */}
      {!sameAsShipping && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Billing Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name *</Label>
              <Input {...billingForm.register('firstName')} />
              {billingForm.formState.errors.firstName && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label>Last Name *</Label>
              <Input {...billingForm.register('lastName')} />
              {billingForm.formState.errors.lastName && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.lastName.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Company</Label>
              <Input {...billingForm.register('company')} />
            </div>
            <div className="col-span-2">
              <Label>Address Line 1 *</Label>
              <Input {...billingForm.register('address1')} />
              {billingForm.formState.errors.address1 && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.address1.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Address Line 2</Label>
              <Input {...billingForm.register('address2')} />
            </div>
            <div>
              <Label>City *</Label>
              <Input {...billingForm.register('city')} />
              {billingForm.formState.errors.city && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.city.message}</p>
              )}
            </div>
            <div>
              <Label>State *</Label>
              <Input {...billingForm.register('state')} />
              {billingForm.formState.errors.state && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.state.message}</p>
              )}
            </div>
            <div>
              <Label>ZIP Code *</Label>
              <Input {...billingForm.register('zipCode')} />
              {billingForm.formState.errors.zipCode && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.zipCode.message}</p>
              )}
            </div>
            <div>
              <Label>Country *</Label>
              <Input {...billingForm.register('country')} />
              {billingForm.formState.errors.country && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.country.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label>Phone *</Label>
              <Input {...billingForm.register('phone')} />
              {billingForm.formState.errors.phone && (
                <p className="text-sm text-destructive mt-1">{billingForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Addresses'}
      </Button>
      {onCancel && (
        <Button onClick={onCancel} variant="outline" className="w-full mt-2">
          Cancel
        </Button>
      )}
    </div>
  );
}
