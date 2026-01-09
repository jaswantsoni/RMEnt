import { create } from 'zustand';
import { customerApi } from '@/services/customerApi';

interface Address {
  id: string;
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

interface AddressState {
  addresses: Address[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  loading: false,

  fetchAddresses: async () => {
    set({ loading: true });
    try {
      const response = await customerApi.getAddresses();
      console.log('Fetch addresses response:', response);
      if (response.success && Array.isArray(response.data)) {
        set({ addresses: response.data });
      } else {
        set({ addresses: [] });
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      set({ addresses: [] });
    } finally {
      set({ loading: false });
    }
  },

  addAddress: async (address) => {
    try {
      console.log('Adding address:', address);
      const response = await customerApi.addAddress(address);
      console.log('Add address response:', response);
      if (response.success) {
        const currentAddresses = Array.isArray(get().addresses) ? get().addresses : [];
        set({ addresses: [...currentAddresses, response.data] });
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      throw error;
    }
  },

  updateAddress: async (id, address) => {
    try {
      const response = await customerApi.updateAddress(id, address);
      if (response.success) {
        set({
          addresses: get().addresses.map(addr => 
            addr.id === id ? { ...addr, ...response.data } : addr
          )
        });
      }
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  },

  deleteAddress: async (id) => {
    try {
      const response = await customerApi.deleteAddress(id);
      if (response.success) {
        set({
          addresses: get().addresses.filter(addr => addr.id !== id)
        });
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  },
}));