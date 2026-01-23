import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  type: z.enum(['shipping', 'billing']),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface SingleAddressFormProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export function SingleAddressForm({ onSave, onCancel }: SingleAddressFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'shipping',
      country: 'US',
    },
  });

  const onSubmit = async (data: AddressFormData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customer/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          isDefault: false,
        }),
      });

      if (!response.ok) throw new Error('Failed to save address');

      toast.success('Address added successfully');
      onSave?.();
    } catch (error) {
      toast.error('Failed to save address');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Address Type *</Label>
        <Select onValueChange={(value) => setValue('type', value as 'shipping' | 'billing')} defaultValue="shipping">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shipping">Shipping</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name *</Label>
          <Input {...register('firstName')} />
          {errors.firstName && <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <Label>Last Name *</Label>
          <Input {...register('lastName')} />
          {errors.lastName && <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <Label>Company</Label>
        <Input {...register('company')} />
      </div>

      <div>
        <Label>Address Line 1 *</Label>
        <Input {...register('address1')} />
        {errors.address1 && <p className="text-sm text-destructive mt-1">{errors.address1.message}</p>}
      </div>

      <div>
        <Label>Address Line 2</Label>
        <Input {...register('address2')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>City *</Label>
          <Input {...register('city')} />
          {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <Label>State *</Label>
          <Input {...register('state')} />
          {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>ZIP Code *</Label>
          <Input {...register('zipCode')} />
          {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>}
        </div>
        <div>
          <Label>Country *</Label>
          <Input {...register('country')} />
          {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
        </div>
      </div>

      <div>
        <Label>Phone *</Label>
        <Input {...register('phone')} />
        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
