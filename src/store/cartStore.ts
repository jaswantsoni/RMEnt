import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem, Product, ProductVariant } from '@/types/api';

interface CartStore {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  
  setCart: (cart: Cart | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Local cart operations (for when API is unavailable)
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const createEmptyCart = (): Cart => ({
  id: 'local-cart',
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  currency: 'INR',
  itemCount: 0,
});

const recalculateCart = (items: CartItem[]): Partial<Cart> => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 5000 ? 0 : 499;
  const total = subtotal + tax + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { subtotal, tax, shipping, total, itemCount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,

      setCart: (cart) => set({ cart }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, variant, quantity = 1) => {
        const { cart } = get();
        const currentCart = cart || createEmptyCart();
        
        const existingItemIndex = currentCart.items.findIndex(
          (item) => 
            item.productId === product.id && 
            item.variantId === (variant?.id || undefined)
        );

        let newItems: CartItem[];
        
        if (existingItemIndex > -1) {
          newItems = currentCart.items.map((item, index) => {
            if (index === existingItemIndex) {
              const newQuantity = item.quantity + quantity;
              return {
                ...item,
                quantity: newQuantity,
                total: (variant?.price || product.price) * newQuantity,
              };
            }
            return item;
          });
        } else {
          const price = variant?.price || product.price;
          const newItem: CartItem = {
            id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
            productId: product.id,
            product,
            variantId: variant?.id,
            variant,
            quantity,
            price,
            total: price * quantity,
          };
          newItems = [...currentCart.items, newItem];
        }

        const calculated = recalculateCart(newItems);
        set({
          cart: { ...currentCart, items: newItems, ...calculated },
          isOpen: true,
        });
      },

      updateItemQuantity: (itemId, quantity) => {
        const { cart } = get();
        if (!cart) return;

        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const newItems = cart.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity,
              total: item.price * quantity,
            };
          }
          return item;
        });

        const calculated = recalculateCart(newItems);
        set({ cart: { ...cart, items: newItems, ...calculated } });
      },

      removeItem: (itemId) => {
        const { cart } = get();
        if (!cart) return;

        const newItems = cart.items.filter((item) => item.id !== itemId);
        const calculated = recalculateCart(newItems);
        set({ cart: { ...cart, items: newItems, ...calculated } });
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
