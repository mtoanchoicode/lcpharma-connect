import { Order, OrderItem, CustomerInfo, CartItem, PrescriptionUpload } from '../models/Product';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseOrderRepository {
  async createOrder(customerInfo: CustomerInfo, cartItems: CartItem[], total: number, prescriptionImages?: string[]): Promise<Order> {
    // Generate order ID
    const orderIdResult = await this.generateOrderId();
    const orderId = orderIdResult;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        customer_address: customerInfo.address,
        total: total,
        status: 'pending',
        status_vi: 'Đang xử lý'
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    // Create order items
    const orderItemsData = cartItems.map((item, index) => ({
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      product_name_vi: item.product.name_vi,
      product_price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Create prescriptions if provided
    if (prescriptionImages && prescriptionImages.length > 0) {
      const prescriptionData = prescriptionImages.map(imageUrl => ({
        order_id: orderId,
        image_url: imageUrl
      }));

      const { error: prescriptionError } = await supabase
        .from('prescriptions')
        .insert(prescriptionData);

      if (prescriptionError) {
        console.error('Failed to create prescriptions:', prescriptionError.message);
      }
    }

    // Return the created order with items
    return {
      ...order,
      status: order.status as Order['status'],
      items: orderItemsData.map((item, index) => ({
        id: `temp-${index}`, // Temporary ID since we don't get it back from insert
        ...item
      })),
      prescriptionImages
    };
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        prescriptions (*)
      `)
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      console.error('Error fetching order:', error);
      return null;
    }

    // Transform prescriptions to legacy format
    const prescriptionImages = order.prescriptions?.map((p: any) => p.image_url) || [];

    return {
      ...order,
      status: order.status as Order['status'],
      prescriptionImages
    };
  }

  async getUserOrders(customerPhone: string): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        prescriptions (*)
      `)
      .eq('customer_phone', customerPhone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }

    return orders.map(order => ({
      ...order,
      status: order.status as Order['status'],
      prescriptionImages: order.prescriptions?.map((p: any) => p.image_url) || []
    }));
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const statusMap = {
      'pending': 'Đang xử lý',
      'confirmed': 'Đã xác nhận',
      'preparing': 'Đang chuẩn bị',
      'ready': 'Sẵn sàng lấy',
      'completed': 'Đã hoàn thành'
    };

    const { error } = await supabase
      .from('orders')
      .update({
        status,
        status_vi: statusMap[status]
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  private async generateOrderId(): Promise<string> {
    // Get the latest order to determine the next ID
    const { data: latestOrder } = await supabase
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let nextNumber = 1;
    if (latestOrder?.id) {
      const currentNumber = parseInt(latestOrder.id.replace('ORD', ''));
      nextNumber = currentNumber + 1;
    }

    return `ORD${nextNumber.toString().padStart(6, '0')}`;
  }
}