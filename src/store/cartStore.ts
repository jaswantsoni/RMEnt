import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { customerApi } from '@/services/customerApi';
import { calculateCartTotals } from '@/lib/usUtils';
import type { Cart, CartItem, Product, ProductVariant } from '@/types/api';

interface PendingCartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

interface BackendCartItem {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  variant_id: string | null;
  created_at: string;
  updated_at: string;
  product: any;
  variant: any;
}

interface BackendCart {
  cartItems: BackendCartItem[];
  count: number;
}

interface CartStore {
  cart: Cart;
  isOpen: boolean;
  isLoading: boolean;
  pendingItem: PendingCartItem | null;
  
  setCart: (cart: Cart) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setPendingItem: (item: PendingCartItem | null) => void;
  processPendingItem: () => Promise<void>;
  
  // API cart operations
  fetchCart: () => Promise<void>;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

const createEmptyCart = (): Cart => ({
  id: 'local-cart',
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  currency: 'USD',
  itemCount: 0,
});

const transformBackendCart = (backendCart: BackendCart): Cart => {
  const items: CartItem[] = backendCart.cartItems.map(item => ({
    id: item.id,
    productId: item.product_id,
    product: {
      id: item.product.id,
      item_id: item.product.item_id || item.product.id,
      name: item.product.name,
      slug: item.product.item_id || item.product.id,
      description: item.product.description || '',
      shortDescription: item.product.description || '',
      price: item.product.rate,
      compareAtPrice: undefined,
      currency: 'USD',
      images: item.product.image_url ? [{ id: '1', url: item.product.image_url, alt: item.product.name, position: 0 }] : [],
      image_url: item.product.image_url,
      category: { id: '1', name: item.product.category || 'Uncategorized', slug: 'uncategorized', description: '', image: '', productCount: 0 },
      categoryId: '1',
      variants: [],
      tags: [],
      specifications: [],
      inStock: item.product.available_stock > 0,
      stockQuantity: item.product.available_stock || 0,
      rating: 5,
      reviewCount: 0,
      featured: false,
      createdAt: item.product.created_at || new Date().toISOString(),
      updatedAt: item.product.updated_at || new Date().toISOString(),
    } as Product,
    variantId: item.variant_id,
    variant: item.variant,
    quantity: item.quantity,
    price: item.product.rate,
    total: item.product.rate * item.quantity,
  }));
  
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const { tax, shipping, total } = calculateCartTotals(subtotal);
  
  return {
    id: 'backend-cart',
    items,
    subtotal,
    tax,
    shipping,
    total,
    currency: 'USD',
    itemCount: backendCart.count,
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: createEmptyCart(),
      isOpen: false,
      isLoading: false,
      pendingItem: null,

      setCart: (cart) => set({ cart: cart || createEmptyCart() }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setPendingItem: (item) => set({ pendingItem: item }),
      
      processPendingItem: async () => {
        const { pendingItem } = get();
        if (pendingItem) {
          await get().addItem(pendingItem.product, pendingItem.variant, pendingItem.quantity);
          set({ pendingItem: null });
        }
      },

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const response = await customerApi.getCart();
          console.log('Raw cart response:', response);
          if (response.success && response.data) {
            const transformedCart = transformBackendCart(response.data);
            console.log('Transformed cart:', transformedCart);
            set({ cart: transformedCart });
          } else {
            set({ cart: createEmptyCart() });
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          set({ cart: createEmptyCart() });
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product, variant, quantity = 1) => {
        // Check if user is authenticated
        const token = localStorage.getItem('auth_token');
        if (!token) {
          // Store pending item and trigger login
          set({ pendingItem: { product, variant, quantity } });
          const width = 500;
          const height = 600;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;
          window.open(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
            'Google Login',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          return;
        }
        
        // Optimistic update - update UI immediately
        const currentCart = get().cart;
        const existingItemIndex = currentCart.items.findIndex(
          item => item.productId === product.id && item.variantId === variant?.id
        );

        let updatedItems: CartItem[];
        if (existingItemIndex >= 0) {
          // Update existing item quantity
          updatedItems = [...currentCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            total: updatedItems[existingItemIndex].price * (updatedItems[existingItemIndex].quantity + quantity),
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `temp-${Date.now()}`,
            productId: product.id,
            product,
            variantId: variant?.id,
            variant,
            quantity,
            price: product.price,
            total: product.price * quantity,
          };
          updatedItems = [...currentCart.items, newItem];
        }

        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        const { tax, shipping, total } = calculateCartTotals(subtotal);

        set({
          cart: {
            ...currentCart,
            items: updatedItems,
            subtotal,
            tax,
            shipping,
            total,
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          },
          isOpen: true,
        });

        // Sync with backend in background
        try {
          await customerApi.addToCart(product.id, quantity, variant?.id);
          // Fetch fresh data from backend to ensure sync
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to sync cart with backend:', error);
          // Revert on error
          set({ cart: currentCart });
        }
      },

      updateItemQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(itemId);
          return;
        }

        // Optimistic update
        const currentCart = get().cart;
        const updatedItems = currentCart.items.map(item =>
          item.id === itemId
            ? { ...item, quantity, total: item.price * quantity }
            : item
        );

        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        const { tax, shipping, total } = calculateCartTotals(subtotal);

        set({
          cart: {
            ...currentCart,
            items: updatedItems,
            subtotal,
            tax,
            shipping,
            total,
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          },
        });

        // Sync with backend
        try {
          await customerApi.updateCartItem(itemId, quantity);
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to update cart:', error);
          set({ cart: currentCart });
        }
      },

      removeItem: async (itemId) => {
        // Optimistic update
        const currentCart = get().cart;
        const updatedItems = currentCart.items.filter(item => item.id !== itemId);

        const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
        const { tax, shipping, total } = calculateCartTotals(subtotal);

        set({
          cart: {
            ...currentCart,
            items: updatedItems,
            subtotal,
            tax,
            shipping,
            total,
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          },
        });

        // Sync with backend
        try {
          await customerApi.removeFromCart(itemId);
          await get().fetchCart();
        } catch (error) {
          console.error('Failed to remove from cart:', error);
          set({ cart: currentCart });
        }
      },

      clearCart: () => {
        set({ cart: createEmptyCart() });
      },
    }),
    {
      name: 'azzaro-cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
