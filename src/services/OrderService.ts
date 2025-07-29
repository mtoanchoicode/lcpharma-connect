import { Order, CartItem, CustomerInfo } from '../models/Product';
import { cartService } from './CartService';
import { SupabaseOrderRepository } from '../repositories/SupabaseOrderRepository';

export class OrderService {
  private orderRepository: SupabaseOrderRepository;

  constructor() {
    this.orderRepository = new SupabaseOrderRepository();
  }

  async createOrder(customerInfo: CustomerInfo, prescriptionImages?: string[]): Promise<Order> {
    const cartItems = cartService.getCart();
    const total = cartService.getTotal();

    const order = await this.orderRepository.createOrder(
      customerInfo,
      cartItems,
      total,
      prescriptionImages
    );

    // Clear cart after order creation
    cartService.clearCart();

    // Simulate order processing
    setTimeout(() => {
      this.updateOrderStatus(order.id, 'confirmed');
    }, 2000);

    return order;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return await this.orderRepository.getOrderById(orderId);
  }

  async getUserOrders(customerPhone: string): Promise<Order[]> {
    return await this.orderRepository.getUserOrders(customerPhone);
  }

  private async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      await this.orderRepository.updateOrderStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }
}

export const orderService = new OrderService();