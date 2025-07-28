import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileLayout } from "@/components/Layout/MobileLayout";
import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import NotFound from "./pages/NotFound";
import { notificationService } from "@/services/NotificationService";
import React from "react";

const queryClient = new QueryClient();

const App = () => {
  React.useEffect(() => {
    notificationService.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MobileLayout />}>
              <Route index element={<HomePage />} />
              <Route path="cart" element={<CartPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
