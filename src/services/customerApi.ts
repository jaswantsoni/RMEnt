const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class CustomerApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Address Management
  async addAddress(address: any) {
    const response = await fetch(`${BACKEND_URL}/api/customer/addresses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(address)
    });
    return response.json();
  }

  async getAddresses() {
    const response = await fetch(`${BACKEND_URL}/api/customer/addresses`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updateAddress(addressId: string, address: any) {
    const response = await fetch(`${BACKEND_URL}/api/customer/addresses/${addressId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(address)
    });
    return response.json();
  }

  async deleteAddress(addressId: string) {
    const response = await fetch(`${BACKEND_URL}/api/customer/addresses/${addressId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Cart Management
  async addToCart(productId: string, quantity: number, variantId?: string) {
    const response = await fetch(`${BACKEND_URL}/api/customer/cart`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ productId, quantity, variantId })
    });
    return response.json();
  }

  async getCart() {
    const response = await fetch(`${BACKEND_URL}/api/customer/cart`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updateCartItem(cartItemId: string, quantity: number) {
    const response = await fetch(`${BACKEND_URL}/api/customer/cart/${cartItemId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    return response.json();
  }

  async removeFromCart(cartItemId: string) {
    const response = await fetch(`${BACKEND_URL}/api/customer/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  // Wishlist Management
  async addToWishlist(productId: string, variantId?: string) {
    const response = await fetch(`${BACKEND_URL}/api/customer/wishlist`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ productId, variantId })
    });
    return response.json();
  }

  async getWishlist() {
    const response = await fetch(`${BACKEND_URL}/api/customer/wishlist`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async removeFromWishlist(wishlistItemId: string) {
    const response = await fetch(`${BACKEND_URL}/api/customer/wishlist/${wishlistItemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }
}

export const customerApi = new CustomerApiService();