export interface Product {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  price: number;
  image: string;
  category: string;
  categoryVi: string;
  inStock: boolean;
  branchAvailability: BranchAvailability[];
  requiresPrescription: boolean;
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  statusVi: string;
  createdAt: Date;
  customerInfo: CustomerInfo;
  prescriptionImages?: string[];
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface PrescriptionUpload {
  id: string;
  orderId: string;
  imageUrl: string;
  uploadedAt: Date;
}