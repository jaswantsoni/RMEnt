import type {
  ApiResponse,
  PaginatedResponse,
  Product,
  Category,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  User,
  Order,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ProductFilters,
  WishlistItem,
  Review,
  CreateReviewRequest,
  Banner,
  ContactRequest,
} from '@/types/api';

const API_BASE_URL = 'https://backend.jaswantsoni.com/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' }).catch(() => {});
    this.setToken(null);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/me');
  }

  // Google OAuth - returns the URL to redirect to
  getGoogleAuthUrl(): string {
    return `${API_BASE_URL}/auth/google`;
  }

  // Handle Google OAuth callback
  async handleGoogleCallback(code: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<ApiResponse<AuthResponse>>(`/auth/google/callback?code=${code}`);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  // Product endpoints
  async getProducts(
    filters?: ProductFilters,
    page = 1,
    pageSize = 12
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    return this.request<ApiResponse<PaginatedResponse<Product>>>(`/products?${params}`);
  }

  async getProduct(idOrSlug: string): Promise<ApiResponse<Product>> {
    return this.request<ApiResponse<Product>>(`/products/${idOrSlug}`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<ApiResponse<Product[]>>('/products/featured');
  }

  async getRelatedProducts(productId: string): Promise<ApiResponse<Product[]>> {
    return this.request<ApiResponse<Product[]>>(`/products/${productId}/related`);
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.request<ApiResponse<Product[]>>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // Category endpoints
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<ApiResponse<Category[]>>('/categories');
  }

  async getCategory(idOrSlug: string): Promise<ApiResponse<Category>> {
    return this.request<ApiResponse<Category>>(`/categories/${idOrSlug}`);
  }

  // Cart endpoints
  async getCart(): Promise<ApiResponse<Cart>> {
    return this.request<ApiResponse<Cart>>('/cart');
  }

  async addToCart(data: AddToCartRequest): Promise<ApiResponse<Cart>> {
    return this.request<ApiResponse<Cart>>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<ApiResponse<Cart>> {
    return this.request<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeCartItem(itemId: string): Promise<ApiResponse<Cart>> {
    return this.request<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<Cart>> {
    return this.request<ApiResponse<Cart>>('/cart', {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<ApiResponse<Order[]>>('/orders');
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>(`/orders/${id}`);
  }

  async createOrder(data: {
    shippingAddressId: string;
    billingAddressId: string;
    paymentMethod: string;
    notes?: string;
  }): Promise<ApiResponse<Order>> {
    return this.request<ApiResponse<Order>>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Wishlist endpoints
  async getWishlist(): Promise<ApiResponse<WishlistItem[]>> {
    return this.request<ApiResponse<WishlistItem[]>>('/wishlist');
  }

  async addToWishlist(productId: string): Promise<ApiResponse<WishlistItem>> {
    return this.request<ApiResponse<WishlistItem>>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Review endpoints
  async getProductReviews(productId: string): Promise<ApiResponse<Review[]>> {
    return this.request<ApiResponse<Review[]>>(`/products/${productId}/reviews`);
  }

  async createReview(data: CreateReviewRequest): Promise<ApiResponse<Review>> {
    return this.request<ApiResponse<Review>>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Banner endpoints
  async getBanners(): Promise<ApiResponse<Banner[]>> {
    return this.request<ApiResponse<Banner[]>>('/banners');
  }

  // Contact endpoint
  async submitContact(data: ContactRequest): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User profile endpoints
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
export default api;
