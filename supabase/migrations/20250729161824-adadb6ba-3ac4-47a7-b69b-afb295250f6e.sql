-- Create branches table
CREATE TABLE public.branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  address TEXT NOT NULL,
  address_vi TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  description TEXT NOT NULL,
  description_vi TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  category_vi TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  requires_prescription BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product_branch_availability table (many-to-many)
CREATE TABLE public.product_branch_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  branch_id TEXT REFERENCES public.branches(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, branch_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  status_vi TEXT NOT NULL DEFAULT 'Đang xử lý',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_name_vi TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_branch_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a pharmacy app)
CREATE POLICY "Anyone can view branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view product availability" ON public.product_branch_availability FOR SELECT USING (true);

-- Orders should be viewable by customer phone (simple auth for now)
CREATE POLICY "Customers can view their orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view prescriptions" ON public.prescriptions FOR SELECT USING (true);
CREATE POLICY "Anyone can create prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_branch_availability_updated_at BEFORE UPDATE ON public.product_branch_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample branches
INSERT INTO public.branches (id, name, name_vi, address, address_vi, phone) VALUES
('branch1', 'Long Châu District 1', 'Long Châu Quận 1', '123 Nguyen Hue St, District 1, Ho Chi Minh City', '123 Nguyễn Huệ, Quận 1, TP.HCM', '028-3822-1234'),
('branch2', 'Long Châu District 3', 'Long Châu Quận 3', '456 Vo Van Tan St, District 3, Ho Chi Minh City', '456 Võ Văn Tần, Quận 3, TP.HCM', '028-3930-5678');

-- Insert sample products
INSERT INTO public.products (id, name, name_vi, description, description_vi, price, image, category, category_vi, in_stock, requires_prescription) VALUES
('1', 'Paracetamol 500mg', 'Paracetamol 500mg', 'Pain reliever and fever reducer', 'Thuốc giảm đau và hạ sốt', 25000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 'Pain Relief', 'Thuốc giảm đau', true, false),
('2', 'Vitamin C 1000mg', 'Vitamin C 1000mg', 'Immune system support supplement', 'Thực phẩm bổ sung tăng cường miễn dịch', 180000, 'https://images.unsplash.com/photo-1550572017-cb0be8b24d55?w=400', 'Vitamins', 'Vitamin', true, false),
('3', 'Amoxicillin 250mg', 'Amoxicillin 250mg', 'Antibiotic for bacterial infections', 'Kháng sinh điều trị nhiễm khuẩn', 120000, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', 'Antibiotics', 'Kháng sinh', true, true),
('4', 'Omega-3 Fish Oil', 'Dầu cá Omega-3', 'Heart and brain health supplement', 'Thực phẩm bổ sung tốt cho tim mạch và não bộ', 350000, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'Supplements', 'Thực phẩm bổ sung', true, false);

-- Insert product availability
INSERT INTO public.product_branch_availability (product_id, branch_id, quantity) VALUES
('1', 'branch1', 50),
('1', 'branch2', 30),
('2', 'branch1', 25),
('3', 'branch1', 15),
('3', 'branch2', 20),
('4', 'branch1', 40);