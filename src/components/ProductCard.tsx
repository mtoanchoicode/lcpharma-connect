import React from 'react';
import { Product } from '@/models/Product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Pill } from 'lucide-react';
import { cartService } from '@/services/CartService';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick 
}) => {
  const { toast } = useToast();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartService.addToCart(product, 1);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.nameVi} đã được thêm vào giỏ hàng`,
    });
  };

  const availableBranches = product.branchAvailability.filter(branch => branch.quantity > 0);

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onProductClick?.(product)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.nameVi}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.requiresPrescription && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2 flex items-center gap-1"
          >
            <Pill className="h-3 w-3" />
            Kê đơn
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary">Hết hàng</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-sm line-clamp-2 mb-1">
              {product.nameVi}
            </h3>
            <p className="text-xs text-muted-foreground">
              {product.categoryVi}
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{availableBranches.length} chi nhánh có sẵn</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            
            {product.inStock && (
              <Button
                size="sm"
                variant="gradient"
                className="h-8 w-8 p-0"
                onClick={handleAddToCart}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};