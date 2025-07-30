import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { SearchBar } from '@/components/SearchBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/models/Product';
import { ArrowRight, Thermometer, Heart, Pill, Tablets } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = React.useState(false);

  const productService = new ProductService();

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    searchProducts();
  }, [searchQuery]);

  const loadData = async () => {
    try {
      const featured = await productService.getFeaturedProducts();
      setFeaturedProducts(featured);
      if (!searchQuery && !selectedCategory && !showAllProducts) {
        setProducts(featured);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      if (selectedCategory) {
        handleCategoryClick(selectedCategory);
      } else if (showAllProducts) {
        handleViewAll();
      } else {
        setProducts(featuredProducts);
      }
      return;
    }

    try {
      const results = await productService.searchProducts(searchQuery);
      setProducts(results);
      setSelectedCategory(null);
      setShowAllProducts(false);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const categories = [
    { 
      id: 'pain-relief', 
      name: 'Thuốc giảm đau', 
      nameEn: 'Pain Relief', 
      icon: Thermometer,
      color: 'bg-red-500',
      count: 12
    },
    { 
      id: 'vitamins', 
      name: 'Vitamin', 
      nameEn: 'Vitamins', 
      icon: Tablets,
      color: 'bg-orange-500',
      count: 8
    },
    { 
      id: 'cardiovascular', 
      name: 'Tim mạch', 
      nameEn: 'Cardiovascular', 
      icon: Heart,
      color: 'bg-pink-500',
      count: 15
    },
    { 
      id: 'antibiotics', 
      name: 'Kháng sinh', 
      nameEn: 'Antibiotics', 
      icon: Pill,
      color: 'bg-blue-500',
      count: 6
    },
  ];

  const handleCategoryClick = async (categoryName: string) => {
    try {
      setLoading(true);
      const results = await productService.getProductsByCategory(categoryName);
      setProducts(results);
      setSearchQuery('');
      setSelectedCategory(categoryName);
      setShowAllProducts(false);
    } catch (error) {
      console.error('Error loading category products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = async () => {
    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
      setSearchQuery('');
      setSelectedCategory(null);
      setShowAllProducts(true);
    } catch (error) {
      console.error('Error loading all products:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetToFeatured = () => {
    setProducts(featuredProducts);
    setSearchQuery('');
    setSelectedCategory(null);
    setShowAllProducts(false);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-glow text-primary-foreground p-6 m-4 rounded-2xl shadow-lg">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Chào mừng đến Long Châu</h2>
          <p className="text-primary-foreground/90 text-sm">
            Tìm kiếm và đặt mua thuốc, thực phẩm chức năng một cách dễ dàng
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm kiếm thuốc, vitamin, thực phẩm chức năng..."
        />
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh mục sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="h-auto p-4 flex-col space-y-2"
                    onClick={() => handleCategoryClick(category.nameEn)}
                  >
                    <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-xs">{category.name}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {category.count}
                      </Badge>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Products */}
      {!searchQuery && !selectedCategory && !showAllProducts && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Sản phẩm nổi bật</h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={handleViewAll}>
              Xem tất cả
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Products */}
      {selectedCategory && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {categories.find(cat => cat.nameEn === selectedCategory)?.name} ({products.length})
            </h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={resetToFeatured}>
              Trở về trang chủ
            </Button>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Không có sản phẩm nào trong danh mục này
              </p>
            </div>
          )}
        </div>
      )}

      {/* All Products */}
      {showAllProducts && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Tất cả sản phẩm ({products.length})
            </h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={resetToFeatured}>
              Trở về trang chủ
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Kết quả tìm kiếm ({products.length})
            </h3>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Không tìm thấy sản phẩm nào phù hợp
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dịch vụ nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <span>Tải đơn thuốc</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Tìm nhà thuốc gần nhất</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span>Lịch sử đơn hàng</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};