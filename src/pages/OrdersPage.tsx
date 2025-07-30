import React, { useState, useEffect } from 'react';
import { Search, Package, Phone, Calendar, MapPin, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/models/Product';
import { orderService } from '@/services/OrderService';
import { useToast } from '@/hooks/use-toast';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchOrders = async () => {
    if (!searchPhone.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập số điện thoại để tìm kiếm đơn hàng",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const userOrders = await orderService.getUserOrders(searchPhone);
      setOrders(userOrders);
      
      if (userOrders.length === 0) {
        toast({
          title: "Không tìm thấy đơn hàng",
          description: "Không có đơn hàng nào với số điện thoại này",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm đơn hàng. Vui lòng thử lại sau",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'preparing': 'bg-orange-100 text-orange-800 border-orange-200',
      'ready': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Package className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Tra cứu đơn hàng</h1>
          <p className="text-muted-foreground">Nhập số điện thoại để xem đơn hàng của bạn</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && searchOrders()}
                />
              </div>
            </div>
            <Button 
              onClick={searchOrders} 
              disabled={loading}
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm đơn hàng'}
            </Button>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">#{order.id}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status_vi}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{order.customer_name}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{order.customer_phone}</span>
                  </div>
                  
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{order.customer_address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {order.created_at ? formatDate(order.created_at) : 'N/A'}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sản phẩm đã đặt:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                        <div>
                          <span className="font-medium">{item.product_name_vi}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prescription Images */}
                {order.prescriptionImages && order.prescriptionImages.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Đơn thuốc đã tải lên:</h4>
                    <div className="flex space-x-2 overflow-x-auto">
                      {order.prescriptionImages.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Prescription ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border border-border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {searchPhone && orders.length === 0 && !loading && (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <Package className="h-16 w-16 text-muted-foreground/50 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Không tìm thấy đơn hàng</h3>
                <p className="text-muted-foreground">
                  Không có đơn hàng nào với số điện thoại <strong>{searchPhone}</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};