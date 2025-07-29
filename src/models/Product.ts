export interface Product {
  id: string;
  name: string;
  name_vi: string;
  description: string;
  description_vi: string;
  price: number;
  image: string;
  category: string;
  category_vi: string;
  in_stock: boolean;
  requires_prescription: boolean;
  branchAvailability?: BranchAvailability[];
  created_at?: string;
  updated_at?: string;
}

export interface Branch {
  id: string;
  name: string;
  name_vi: string;
  address: string;
  address_vi: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

export interface BranchAvailability {
  branchId: string;
  branchName: string;
  branchNameVi: string;
  address: string;
  addressVi: string;
  quantity: number;
  phone: string;
}

export interface ProductBranchAvailability {
  id: string;
  product_id: string;
  branch_id: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  status_vi: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
  prescriptionImages?: string[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_name_vi: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface PrescriptionUpload {
  id: string;
  order_id: string;
  image_url: string;
  uploaded_at?: string;
}