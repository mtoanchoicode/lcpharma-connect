import { Product, BranchAvailability } from '../models/Product';
import { SupabaseProductRepository } from '../repositories/SupabaseProductRepository';

export class ProductService {
  private productRepository: SupabaseProductRepository;

  constructor() {
    this.productRepository = new SupabaseProductRepository();
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await this.productRepository.searchProducts(query);
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

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.getAllProducts();
  }

  async checkAvailability(productId: string, branchId: string): Promise<number> {
    return await this.productRepository.checkAvailability(productId, branchId);
  }
}