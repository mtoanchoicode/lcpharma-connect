import { Product } from '../models/Product';

export class ProductRepository {
  private products: Product[] = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      nameVi: 'Paracetamol 500mg',
      description: 'Pain reliever and fever reducer',
      descriptionVi: 'Thuốc giảm đau và hạ sốt',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      category: 'Pain Relief',
      categoryVi: 'Thuốc giảm đau',
      inStock: true,
      requiresPrescription: false,
      branchAvailability: [
        {
          branchId: 'branch1',
          branchName: 'Long Châu District 1',
          branchNameVi: 'Long Châu Quận 1',
          address: '123 Nguyen Hue St, District 1, Ho Chi Minh City',
          addressVi: '123 Nguyễn Huệ, Quận 1, TP.HCM',
          quantity: 50,
          phone: '028-3822-1234'
        },
        {
          branchId: 'branch2',
          branchName: 'Long Châu District 3',
          branchNameVi: 'Long Châu Quận 3',
          address: '456 Vo Van Tan St, District 3, Ho Chi Minh City',
          addressVi: '456 Võ Văn Tần, Quận 3, TP.HCM',
          quantity: 30,
          phone: '028-3930-5678'
        }
      ]
    },
    {
      id: '2',
      name: 'Vitamin C 1000mg',
      nameVi: 'Vitamin C 1000mg',
      description: 'Immune system support supplement',
      descriptionVi: 'Thực phẩm bổ sung tăng cường miễn dịch',
      price: 180000,
      image: 'https://images.unsplash.com/photo-1550572017-cb0be8b24d55?w=400',
      category: 'Vitamins',
      categoryVi: 'Vitamin',
      inStock: true,
      requiresPrescription: false,
      branchAvailability: [
        {
          branchId: 'branch1',
          branchName: 'Long Châu District 1',
          branchNameVi: 'Long Châu Quận 1',
          address: '123 Nguyen Hue St, District 1, Ho Chi Minh City',
          addressVi: '123 Nguyễn Huệ, Quận 1, TP.HCM',
          quantity: 25,
          phone: '028-3822-1234'
        }
      ]
    },
    {
      id: '3',
      name: 'Amoxicillin 250mg',
      nameVi: 'Amoxicillin 250mg',
      description: 'Antibiotic for bacterial infections',
      descriptionVi: 'Kháng sinh điều trị nhiễm khuẩn',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
      category: 'Antibiotics',
      categoryVi: 'Kháng sinh',
      inStock: true,
      requiresPrescription: true,
      branchAvailability: [
        {
          branchId: 'branch1',
          branchName: 'Long Châu District 1',
          branchNameVi: 'Long Châu Quận 1',
          address: '123 Nguyen Hue St, District 1, Ho Chi Minh City',
          addressVi: '123 Nguyễn Huệ, Quận 1, TP.HCM',
          quantity: 15,
          phone: '028-3822-1234'
        },
        {
          branchId: 'branch2',
          branchName: 'Long Châu District 3',
          branchNameVi: 'Long Châu Quận 3',
          address: '456 Vo Van Tan St, District 3, Ho Chi Minh City',
          addressVi: '456 Võ Văn Tần, Quận 3, TP.HCM',
          quantity: 20,
          phone: '028-3930-5678'
        }
      ]
    },
    {
      id: '4',
      name: 'Omega-3 Fish Oil',
      nameVi: 'Dầu cá Omega-3',
      description: 'Heart and brain health supplement',
      descriptionVi: 'Thực phẩm bổ sung tốt cho tim mạch và não bộ',
      price: 350000,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      category: 'Supplements',
      categoryVi: 'Thực phẩm bổ sung',
      inStock: true,
      requiresPrescription: false,
      branchAvailability: [
        {
          branchId: 'branch1',
          branchName: 'Long Châu District 1',
          branchNameVi: 'Long Châu Quận 1',
          address: '123 Nguyen Hue St, District 1, Ho Chi Minh City',
          addressVi: '123 Nguyễn Huệ, Quận 1, TP.HCM',
          quantity: 40,
          phone: '028-3822-1234'
        }
      ]
    }
  ];

  async getAllProducts(): Promise<Product[]> {
    return Promise.resolve([...this.products]);
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return Promise.resolve(product || null);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const filtered = this.products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase() ||
      p.categoryVi.toLowerCase() === category.toLowerCase()
    );
    return Promise.resolve(filtered);
  }
}