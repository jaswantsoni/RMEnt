# Frontend Customer Management Flow

## 🔄 Complete User Journey

### 1. **Authentication Flow**
```
Guest User → Login/Register → OAuth/Email → Account Created → Dashboard
```

### 2. **Shopping Flow**
```
Browse Products → Add to Cart → View Cart → Checkout → Address Selection → Payment → Order Confirmation
```

### 3. **Wishlist Flow**
```
Browse Products → Add to Wishlist → View Wishlist → Move to Cart → Checkout
```

### 4. **Account Management Flow**
```
Login → Account Dashboard → Manage Addresses → View Orders → Update Profile
```

## 📱 Component Integration

### **Product Pages**
- `ProductCard` → Add to Cart/Wishlist buttons
- `ProductDetail` → Quantity selector, variant picker, add to cart
- `Collections` → Filter, sort, pagination

### **Cart Management**
- `CartDrawer` → View items, update quantities, remove items
- `CartIcon` → Shows item count, opens drawer
- `Checkout` → Address selection, payment processing

### **User Account**
- `Account` → Profile management, address book
- `Header` → Login status, profile image, cart count
- `ProtectedRoute` → Wraps authenticated pages

## 🔧 State Management Flow

### **Cart Store**
```typescript
// Add to cart from product page
const { addItem } = useCartStore();
await addItem(product, variant, quantity);

// Update cart in drawer
const { updateItemQuantity } = useCartStore();
await updateItemQuantity(itemId, newQuantity);
```

### **Wishlist Store**
```typescript
// Toggle wishlist from product card
const { toggleItem } = useWishlistStore();
await toggleItem(product);

// Check if in wishlist
const { isInWishlist } = useWishlistStore();
const inWishlist = isInWishlist(product.id);
```

### **Address Store**
```typescript
// Manage addresses in account
const { addAddress, fetchAddresses } = useAddressStore();
await addAddress(addressData);
```

## 🎯 Key Integration Points

### **Product Card Component**
- Add to Cart button → `cartStore.addItem()`
- Wishlist heart → `wishlistStore.toggleItem()`
- Quick view → Opens product modal

### **Header Component**
- Cart icon → Shows `cart.itemCount`
- User icon → Shows profile image/initials
- Search → Opens search modal

### **Checkout Flow**
1. Cart Review → `cartStore.items`
2. Address Selection → `addressStore.addresses`
3. Payment Processing → External payment gateway
4. Order Confirmation → Clear cart, redirect

## 📋 Required Pages/Components

### **Existing & Updated**
- ✅ `ProductCard` - Add cart/wishlist integration
- ✅ `ProductDetail` - Add cart functionality  
- ✅ `CartDrawer` - Update with backend integration
- ✅ `Account` - Profile and address management
- ✅ `Header` - Cart count and user status

### **Need to Create**
- 🔧 `AddressForm` - Add/edit addresses
- 🔧 `OrderHistory` - View past orders
- 🔧 `CheckoutForm` - Complete checkout process

## 🚀 Implementation Priority

1. **High Priority**
   - Update ProductCard with cart/wishlist buttons
   - Integrate CartDrawer with backend
   - Create AddressForm component

2. **Medium Priority**
   - Add checkout flow
   - Create order history page
   - Add search functionality

3. **Low Priority**
   - Advanced filtering
   - Product recommendations
   - Social sharing