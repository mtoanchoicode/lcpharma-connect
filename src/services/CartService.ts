import { CartItem, Product } from '../models/Product';

export class CartService {
  private cart: CartItem[] = [];
  private listeners: Array<(cart: CartItem[]) => void> = [];

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({ product, quantity });
    }
    
    this.notifyListeners();
  }

  removeFromCart(productId: string): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.notifyListeners();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.notifyListeners();
      }
    }
  }

  getCart(): CartItem[] {
    return [...this.cart];
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart(): void {
    this.cart = [];
    this.notifyListeners();
  }

  subscribe(listener: (cart: CartItem[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.cart]));
  }
}

export const cartService = new CartService();