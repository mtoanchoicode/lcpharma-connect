import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cartService } from '@/services/CartService';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children?: React.ReactNode;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [cartItemCount, setCartItemCount] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTab = () => {
    if (location.pathname === '/cart') return 'cart';
    if (location.pathname === '/orders') return 'orders';
    return 'home';
  };

  React.useEffect(() => {
    const unsubscribe = cartService.subscribe((cart) => {
      setCartItemCount(cartService.getItemCount());
    });

    return unsubscribe;
  }, []);

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Trang chủ', labelEn: 'Home', path: '/' },
    { id: 'search', icon: Search, label: 'Tìm kiếm', labelEn: 'Search', path: '/' },
    { id: 'cart', icon: ShoppingCart, label: 'Giỏ hàng', labelEn: 'Cart', badge: cartItemCount, path: '/cart' },
    { id: 'orders', icon: Package, label: 'Đơn hàng', labelEn: 'Orders', path: '/orders' },
    { id: 'profile', icon: User, label: 'Tài khoản', labelEn: 'Profile', path: '/' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Long Châu</h1>
              <p className="text-xs text-primary-foreground/80">Pharmacy Management</p>
            </div>
          </div>
          <Button variant="floating" size="icon" className="bg-white/20 hover:bg-white/30">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {children || <Outlet />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 safe-area-pb z-50">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = getActiveTab() === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};