import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cartService } from '@/services/CartService';
import { orderService } from '@/services/OrderService';
import { CartItem, CustomerInfo, DeliveryOption } from '@/models/Product';
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle } from 'lucide-react';
import { PrescriptionUpload } from '@/components/PrescriptionUpload';
import { DeliveryOptionsStep } from '@/components/DeliveryOptionsStep';
import { useToast } from '@/hooks/use-toast';

export const CartPage: React.FC = () => {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = React.useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [deliveryOption, setDeliveryOption] = React.useState<DeliveryOption>({
    method: 'pickup',
    shippingFee: 0
  });
  const [prescriptionImages, setPrescriptionImages] = React.useState<string[]>([]);
  const [currentStep, setCurrentStep] = React.useState<'cart' | 'delivery' | 'checkout'>('cart');
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const unsubscribe = cartService.subscribe((updatedCart) => {
      setCart(updatedCart);
    });

    setCart(cartService.getCart());
    return unsubscribe;
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    cartService.updateQuantity(productId, newQuantity);
  };

  const removeItem = (productId: string) => {
    cartService.removeFromCart(productId);
    toast({
      title: "Đã xóa sản phẩm",
      description: "Sản phẩm đã được xóa khỏi giỏ hàng",
    });
  };

  const total = cartService.getTotal();
  const totalWithShipping = total + (deliveryOption.shippingFee || 0);
  const hasRequiresPrescription = cart.some(item => item.product.requires_prescription);

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng nhập đầy đủ thông tin khách hàng",
        variant: "destructive"
      });
      return;
    }

    if (hasRequiresPrescription && prescriptionImages.length === 0) {
      toast({
        title: "Thiếu đơn thuốc",
        description: "Vui lòng tải lên ảnh đơn thuốc cho các sản phẩm kê đơn",
        variant: "destructive"
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Simulate payment animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const order = await orderService.createOrder(
        customerInfo,
        deliveryOption,
        prescriptionImages.length > 0 ? prescriptionImages : undefined
      );

      setOrderSuccess(true);
      setPrescriptionImages([]);
      setCustomerInfo({
        name: '',
        phone: '',
        email: '',
        address: ''
      });

      toast({
        title: "Đặt hàng thành công!",
        description: `Đơn hàng ${order.id} đã được tạo thành công`,
      });

      setCurrentStep('cart');

    } catch (error) {
      toast({
        title: "Lỗi đặt hàng",
        description: "Không thể đặt hàng. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleDeliveryOptionSelected = (option: DeliveryOption) => {
    setDeliveryOption(option);
    setCurrentStep('checkout');
  };

  // Payment Animation Component
  if (isPlacingOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow animate-pulse flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Đang xử lý thanh toán</h3>
            <p className="text-muted-foreground">
              Vui lòng chờ trong giây lát...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Order Success
  if (currentStep === 'delivery') {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6">
          <h1 className="text-xl font-bold">Phương thức giao hàng</h1>
        </div>
        <div className="p-4">
          <DeliveryOptionsStep
            cartTotal={total}
            onContinue={handleDeliveryOptionSelected}
            onBack={() => setCurrentStep('cart')}
          />
        </div>
      </div>
    );
  }

  // Order success animation
  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-success to-success/80 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-success-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-success">Đặt hàng thành công!</h3>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </p>
          </div>
          <Button 
            variant="gradient" 
            onClick={() => {
              setOrderSuccess(false);
              setCurrentStep('cart');
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold">Giỏ hàng trống</h3>
          <p className="text-muted-foreground">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <Button variant="gradient">
            Bắt đầu mua sắm
          </Button>
        </div>
      </div>
    );
  }

  // Checkout Step
  if (currentStep === 'checkout') {
    return (
      <div className="pb-20">
        <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6">
          <h1 className="text-xl font-bold">Thông tin đặt hàng</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Họ và tên *"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              />
              <Input
                placeholder="Số điện thoại *"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              />
              <Input
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              />
              <Input
                placeholder="Địa chỉ"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              />
            </CardContent>
          </Card>

          {/* Prescription Upload */}
          {hasRequiresPrescription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  Đơn thuốc
                  <Badge variant="destructive">Bắt buộc</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PrescriptionUpload
                  prescriptionImages={prescriptionImages}
                  onImagesChange={setPrescriptionImages}
                />
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name_vi} x{item.quantity}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span>Phí giao hàng:</span>
                  <span>
                    {deliveryOption.shippingFee ? formatPrice(deliveryOption.shippingFee) : 'Miễn phí'}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">{formatPrice(totalWithShipping)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setCurrentStep('delivery')}
            >
              Quay lại
            </Button>
            <Button 
              variant="gradient" 
              className="flex-1"
              onClick={handlePlaceOrder}
            >
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6">
        <h1 className="text-xl font-bold">Giỏ hàng ({cart.length})</h1>
      </div>

      <div className="p-4">
        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name_vi}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-medium text-sm">{item.product.name_vi}</h3>
                      <p className="text-xs text-muted-foreground">{item.product.category_vi}</p>
                      {item.product.requires_prescription && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Cần đơn thuốc
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="text-success">Sẽ tính khi chọn địa chỉ</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Tạm tính:</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="gradient" 
          className="w-full mt-4 h-12"
          onClick={() => setCurrentStep('delivery')}
        >
          Chọn phương thức giao hàng
        </Button>
      </div>
    </div>
  );
};