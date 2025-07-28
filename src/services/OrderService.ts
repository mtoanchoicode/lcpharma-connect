import { Order, CartItem, CustomerInfo } from '../models/Product';
import { cartService } from './CartService';

export class OrderService {
  private orders: Order[] = [];
  private orderIdCounter = 1;

  async createOrder(customerInfo: CustomerInfo, prescriptionImages?: string[]): Promise<Order> {
    const cartItems = cartService.getCart();
    const total = cartService.getTotal();

    const order: Order = {
      id: `ORD${this.orderIdCounter.toString().padStart(6, '0')}`,
      items: [...cartItems],
      total,
      status: 'pending',
      statusVi: 'Đang xử lý',
      createdAt: new Date(),
      customerInfo: { ...customerInfo },
      prescriptionImages: prescriptionImages ? [...prescriptionImages] : undefined
    };

    this.orders.push(order);
    this.orderIdCounter++;

    // Clear cart after order creation
    cartService.clearCart();

    // Simulate order processing
    setTimeout(() => {
      this.updateOrderStatus(order.id, 'confirmed');
    }, 2000);

    return order;
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const order = this.orders.find(o => o.id === orderId);
    return Promise.resolve(order || null);
  }

  async getUserOrders(customerPhone: string): Promise<Order[]> {
    const userOrders = this.orders.filter(o => o.customerInfo.phone === customerPhone);
    return Promise.resolve(userOrders);
  }

  private updateOrderStatus(orderId: string, status: Order['status']): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.statusVi = this.getVietnameseStatus(status);
    }
  }

  private getVietnameseStatus(status: Order['status']): string {
    const statusMap = {
      'pending': 'Đang xử lý',
      'confirmed': 'Đã xác nhận',
      'preparing': 'Đang chuẩn bị',
      'ready': 'Sẵn sàng lấy',
      'completed': 'Đã hoàn thành'
    };
    return statusMap[status];
  }
}

export const orderService = new OrderService();