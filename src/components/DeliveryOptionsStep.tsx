import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MapPin, Truck, Store } from 'lucide-react';
import { Branch, DeliveryOption } from '@/models/Product';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryOptionsStepProps {
  onContinue: (deliveryOption: DeliveryOption) => void;
  onBack: () => void;
  cartTotal: number;
}

export const DeliveryOptionsStep: React.FC<DeliveryOptionsStepProps> = ({
  onContinue,
  onBack,
  cartTotal
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'pickup' | 'shipping'>('pickup');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(true);

  const SHIPPING_FEE = 30000; // 30,000 VND

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const { data: branchData, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading branches:', error);
        return;
      }

      setBranches(branchData || []);
      if (branchData && branchData.length > 0) {
        setSelectedBranch(branchData[0].id);
      }
    } catch (error) {
      console.error('Error loading branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleContinue = () => {
    const selectedBranchData = branches.find(b => b.id === selectedBranch);
    
    const deliveryOption: DeliveryOption = {
      method: selectedMethod,
      ...(selectedMethod === 'pickup' && {
        branchId: selectedBranch,
        branchName: selectedBranchData?.name_vi,
        branchAddress: selectedBranchData?.address_vi,
        shippingFee: 0
      }),
      ...(selectedMethod === 'shipping' && {
        shippingFee: SHIPPING_FEE,
        deliveryAddress: shippingAddress
      })
    };

    onContinue(deliveryOption);
  };

  const canContinue = () => {
    if (selectedMethod === 'pickup') {
      return selectedBranch !== '';
    }
    return shippingAddress.trim() !== '';
  };

  const getTotalWithShipping = () => {
    return selectedMethod === 'shipping' ? cartTotal + SHIPPING_FEE : cartTotal;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Chọn phương thức giao hàng</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Vui lòng chọn cách thức nhận hàng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phương thức giao hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedMethod}
            onValueChange={(value) => setSelectedMethod(value as 'pickup' | 'shipping')}
          >
            {/* Pickup Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Store className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Lấy tại nhà thuốc</div>
                      <div className="text-sm text-muted-foreground">
                        Miễn phí - Sẵn sàng trong 30 phút
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Miễn phí</Badge>
                </div>
              </Label>
            </div>

            {/* Shipping Option */}
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="shipping" id="shipping" />
              <Label htmlFor="shipping" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Giao hàng tận nơi</div>
                      <div className="text-sm text-muted-foreground">
                        Giao trong 2-4 giờ
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{formatPrice(SHIPPING_FEE)}</Badge>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Branch Selection */}
      {selectedMethod === 'pickup' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Chọn nhà thuốc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedBranch}
              onValueChange={setSelectedBranch}
            >
              {branches.map((branch) => (
                <div key={branch.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value={branch.id} id={branch.id} />
                  <Label htmlFor={branch.id} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{branch.name_vi}</div>
                      <div className="text-sm text-muted-foreground">
                        {branch.address_vi}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        SĐT: {branch.phone}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Shipping Address */}
      {selectedMethod === 'shipping' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa chỉ giao hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Nhập địa chỉ giao hàng chi tiết..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tóm tắt đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng:</span>
              <span>
                {selectedMethod === 'shipping' 
                  ? formatPrice(SHIPPING_FEE)
                  : <span className="text-green-600">Miễn phí</span>
                }
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-primary">{formatPrice(getTotalWithShipping())}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button 
          variant="gradient" 
          className="flex-1"
          onClick={handleContinue}
          disabled={!canContinue()}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
};