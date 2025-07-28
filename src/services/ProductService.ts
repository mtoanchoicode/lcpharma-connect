import { Product, BranchAvailability } from '../models/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async searchProducts(query: string): Promise<Product[]> {
    const allProducts = await this.productRepository.getAllProducts();
    
    if (!query.trim()) {
      return allProducts;
    }

    const searchTerm = query.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.nameVi.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.categoryVi.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.descriptionVi.toLowerCase().includes(searchTerm)
    );
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.getProductById(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.getProductsByCategory(category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const allProducts = await this.productRepository.getAllProducts();
    return allProducts.slice(0, 6); // Return first 6 products as featured
  }

  async checkAvailability(productId: string, branchId: string): Promise<number> {
    const product = await this.productRepository.getProductById(productId);
    if (!product) return 0;

    const branch = product.branchAvailability.find(b => b.branchId === branchId);
    return branch ? branch.quantity : 0;
  }
}