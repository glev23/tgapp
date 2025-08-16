import { CartItem, Cart, MenuItem } from '../types';

/**
 * Cart Service
 * Handles shopping cart operations with localStorage persistence
 * Implements Floating Cart + Slide-over Panel design from Creative Phase
 */

class CartService {
  private static readonly STORAGE_KEY = 'tgapp-cart';
  private cart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  private listeners: Array<(cart: Cart) => void> = [];

  constructor() {
    this.loadCartFromStorage();
    this.recalculateCart();
  }

  // Cart state management
  getCart(): Cart {
    return { ...this.cart };
  }

  getCartItems(): CartItem[] {
    return [...this.cart.items];
  }

  getCartItemCount(): number {
    return this.cart.totalItems;
  }

  getTotalPrice(): number {
    return this.cart.totalPrice;
  }

  isEmpty(): boolean {
    return this.cart.items.length === 0;
  }

  // Add item to cart
  addItem(menuItem: MenuItem, quantity: number = 1): CartItem {
    const existingItemIndex = this.cart.items.findIndex(
      item => item.menuItemId === menuItem.id
    );

    let cartItem: CartItem;

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cartItem = this.cart.items[existingItemIndex];
      cartItem.quantity += quantity;
    } else {
      // Add new item to cart
      cartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity,
        category: menuItem.category,
        imageUrl: menuItem.imageUrl
      };
      this.cart.items.push(cartItem);
    }

    this.recalculateCart();
    this.saveCartToStorage();
    this.notifyListeners();

    return cartItem;
  }

  // Remove item from cart
  removeItem(cartItemId: string): boolean {
    const initialLength = this.cart.items.length;
    this.cart.items = this.cart.items.filter(item => item.id !== cartItemId);
    
    if (this.cart.items.length !== initialLength) {
      this.recalculateCart();
      this.saveCartToStorage();
      this.notifyListeners();
      return true;
    }
    
    return false;
  }

  // Update item quantity
  updateItemQuantity(cartItemId: string, quantity: number): boolean {
    if (quantity <= 0) {
      return this.removeItem(cartItemId);
    }

    const item = this.cart.items.find(item => item.id === cartItemId);
    if (item) {
      item.quantity = quantity;
      this.recalculateCart();
      this.saveCartToStorage();
      this.notifyListeners();
      return true;
    }
    
    return false;
  }

  // Increment item quantity
  incrementItem(cartItemId: string): boolean {
    const item = this.cart.items.find(item => item.id === cartItemId);
    if (item) {
      return this.updateItemQuantity(cartItemId, item.quantity + 1);
    }
    return false;
  }

  // Decrement item quantity
  decrementItem(cartItemId: string): boolean {
    const item = this.cart.items.find(item => item.id === cartItemId);
    if (item) {
      return this.updateItemQuantity(cartItemId, item.quantity - 1);
    }
    return false;
  }

  // Clear entire cart
  clearCart(): void {
    this.cart = { items: [], totalItems: 0, totalPrice: 0 };
    this.saveCartToStorage();
    this.notifyListeners();
  }

  // Get item by ID
  getCartItemById(cartItemId: string): CartItem | undefined {
    return this.cart.items.find(item => item.id === cartItemId);
  }

  // Check if menu item is in cart
  isMenuItemInCart(menuItemId: string): boolean {
    return this.cart.items.some(item => item.menuItemId === menuItemId);
  }

  // Get quantity of menu item in cart
  getMenuItemQuantity(menuItemId: string): number {
    const item = this.cart.items.find(item => item.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  }

  // Get cart items by category
  getItemsByCategory(category: string): CartItem[] {
    return this.cart.items.filter(item => item.category === category);
  }

  // Get unique categories in cart
  getCartCategories(): string[] {
    const categories = new Set(this.cart.items.map(item => item.category));
    return Array.from(categories);
  }

  // Cart summary for checkout
  getCartSummary(): {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    categories: { [category: string]: { count: number; subtotal: number } };
  } {
    const categories: { [category: string]: { count: number; subtotal: number } } = {};

    this.cart.items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = { count: 0, subtotal: 0 };
      }
      categories[item.category].count += item.quantity;
      categories[item.category].subtotal += item.price * item.quantity;
    });

    return {
      items: this.getCartItems(),
      totalItems: this.cart.totalItems,
      totalPrice: this.cart.totalPrice,
      categories
    };
  }

  // Validation methods
  canAddItem(menuItem: MenuItem, quantity: number = 1): { canAdd: boolean; reason?: string } {
    // Check if quantity is valid
    if (quantity <= 0) {
      return { canAdd: false, reason: 'Количество должно быть больше нуля' };
    }

    // Check maximum quantity per item (example: max 10 of same item)
    const currentQuantity = this.getMenuItemQuantity(menuItem.id);
    if (currentQuantity + quantity > 10) {
      return { canAdd: false, reason: 'Максимальное количество одного блюда: 10' };
    }

    // Check maximum total items in cart (example: max 50 items)
    if (this.cart.totalItems + quantity > 50) {
      return { canAdd: false, reason: 'Максимальное количество блюд в заказе: 50' };
    }

    return { canAdd: true };
  }

  // Estimate delivery/preparation time
  getEstimatedTime(): { min: number; max: number } {
    if (this.isEmpty()) {
      return { min: 0, max: 0 };
    }

    // Base time calculation based on categories and items
    const hasHotDishes = this.cart.items.some(item => 
      item.category.includes('Горячие') || item.category.includes('Основные')
    );
    const hasColdDishes = this.cart.items.some(item => 
      item.category.includes('Холодные') || item.category.includes('закуски')
    );
    const hasDesserts = this.cart.items.some(item => 
      item.category.includes('Десерты')
    );

    let baseTime = 15; // Minimum preparation time
    
    if (hasHotDishes) baseTime += 20;
    if (hasColdDishes) baseTime += 10;
    if (hasDesserts) baseTime += 5;
    
    // Add time based on quantity
    const additionalTime = Math.min(this.cart.totalItems * 2, 30);
    
    const minTime = baseTime + Math.floor(additionalTime / 2);
    const maxTime = baseTime + additionalTime;

    return { min: minTime, max: maxTime };
  }

  // Event listener management
  subscribe(callback: (cart: Cart) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.getCart()));
  }

  // Persistence methods
  private saveCartToStorage(): void {
    try {
      localStorage.setItem(CartService.STORAGE_KEY, JSON.stringify(this.cart));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem(CartService.STORAGE_KEY);
      if (stored) {
        const parsedCart = JSON.parse(stored);
        if (this.isValidCart(parsedCart)) {
          this.cart = parsedCart;
        }
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
      this.cart = { items: [], totalItems: 0, totalPrice: 0 };
    }
  }

  private isValidCart(cart: any): cart is Cart {
    return (
      cart &&
      typeof cart === 'object' &&
      Array.isArray(cart.items) &&
      typeof cart.totalItems === 'number' &&
      typeof cart.totalPrice === 'number'
    );
  }

  private recalculateCart(): void {
    this.cart.totalItems = this.cart.items.reduce((total, item) => total + item.quantity, 0);
    this.cart.totalPrice = this.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Demo/Development helpers
  addSampleItems(): void {
    // Add sample items for testing cart functionality
    const sampleItems = [
      {
        id: 'sample-1',
        name: 'Омлет классический',
        price: 520,
        category: 'Завтрак а-ля карт'
      },
      {
        id: 'sample-2', 
        name: 'Сёмга слабосолёная',
        price: 1200,
        category: 'Холодные закуски'
      }
    ];

    sampleItems.forEach(item => {
      this.addItem(item as MenuItem, 1);
    });
  }

  // Analytics/Statistics
  getCartAnalytics(): {
    averageItemPrice: number;
    mostExpensiveItem: CartItem | null;
    cheapestItem: CartItem | null;
    categoryDistribution: { [category: string]: number };
  } {
    if (this.isEmpty()) {
      return {
        averageItemPrice: 0,
        mostExpensiveItem: null,
        cheapestItem: null,
        categoryDistribution: {}
      };
    }

    const prices = this.cart.items.map(item => item.price);
    const averageItemPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    const mostExpensive = this.cart.items.reduce((max, item) => 
      item.price > max.price ? item : max
    );
    
    const cheapest = this.cart.items.reduce((min, item) => 
      item.price < min.price ? item : min
    );

    const categoryDistribution: { [category: string]: number } = {};
    this.cart.items.forEach(item => {
      categoryDistribution[item.category] = (categoryDistribution[item.category] || 0) + item.quantity;
    });

    return {
      averageItemPrice: Math.round(averageItemPrice),
      mostExpensiveItem: mostExpensive,
      cheapestItem: cheapest,
      categoryDistribution
    };
  }
}

// Export singleton instance
export const cartService = new CartService();
export default cartService; 