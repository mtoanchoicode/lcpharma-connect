import React from 'react';
import { Product } from '@/models/Product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Pill, Package, Plus, Minus } from 'lucide-react';
import { cartService } from '@/services/CartService';
import { useToast } from '@/hooks/use-toast';
import { PrescriptionUpload } from '@/components/PrescriptionUpload';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [prescriptionImages, setPrescriptionImages] = React.useState<string[]>([]);
  const { toast } = useToast();

  if (!product) return null;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product.requires_prescription && prescriptionImages.length === 0) {
      toast({
        title: "Cần đơn thuốc",
        description: "Vui lòng tải lên ảnh đơn thuốc trước khi thêm vào giỏ hàng",
        variant: "destructive"
      });
      return;
    }

    cartService.addToCart(product, quantity);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name_vi} (${quantity}) đã được thêm vào giỏ hàng`,
    });
    
    // Reset and close
    setQuantity(1);
    setPrescriptionImages([]);
    onClose();
  };

  const availableBranches = product.branchAvailability.filter(branch => branch.quantity > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.name_vi}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name_vi}
              className="w-full h-full object-cover"
            />
            {product.requires_prescription && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 left-2 flex items-center gap-1"
              >
                <Pill className="h-3 w-3" />
                Kê đơn
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{product.name_vi}</h3>
              <p className="text-muted-foreground">{product.category_vi}</p>
            </div>

            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Mô tả sản phẩm</h4>
              <p className="text-sm text-muted-foreground">
                {product.description_vi || "Thông tin chi tiết về sản phẩm sẽ được cập nhật sớm."}
              </p>
            </div>

            {/* Branch Availability */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">Tình trạng tại các chi nhánh</h4>
                </div>
                <div className="space-y-2">
                  {availableBranches.length > 0 ? (
                    availableBranches.map((branch) => (
                      <div key={branch.branchId} className="flex justify-between text-sm">
                        <span>{branch.branchName}</span>
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          <span className="text-success font-medium">
                            {branch.quantity} có sẵn
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Hiện tại không có sẵn tại chi nhánh nào
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prescription Upload for Required Medicines */}
            {product.requires_prescription && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="h-4 w-4 text-destructive" />
                    <h4 className="font-medium">Đơn thuốc bắt buộc</h4>
                    <Badge variant="destructive">Bắt buộc</Badge>
                  </div>
                  <PrescriptionUpload
                    prescriptionImages={prescriptionImages}
                    onImagesChange={setPrescriptionImages}
                  />
                </CardContent>
              </Card>
            )}

            {/* Quantity Selector */}
            {product.in_stock && (
              <div className="space-y-3">
                <h4 className="font-medium">Số lượng</h4>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-lg w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Total Price */}
            {product.in_stock && (
              <div className="flex justify-between items-center py-3 border-t">
                <span className="font-medium">Tổng cộng:</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Đóng
              </Button>
              {product.in_stock ? (
                <Button 
                  variant="gradient" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
              ) : (
                <Button variant="secondary" className="flex-1" disabled>
                  Hết hàng
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};