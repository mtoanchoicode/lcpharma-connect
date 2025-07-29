import { Product, Branch, BranchAvailability } from '../models/Product';
import { supabase } from '@/integrations/supabase/client';

export class SupabaseProductRepository {
  async getAllProducts(): Promise<Product[]> {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    // Transform products to include branch availability
    const transformedProducts = await Promise.all(
      products.map(async (product) => {
        const branchAvailability = await this.getBranchAvailabilityForProduct(product.id);
        return {
          ...product,
          branchAvailability
        };
      })
    );

    return transformedProducts;
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !product) {
      console.error('Error fetching product:', error);
      return null;
    }

    const branchAvailability = await this.getBranchAvailabilityForProduct(id);
    return {
      ...product,
      branchAvailability
    };
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or(`category.ilike.%${category}%,category_vi.ilike.%${category}%`);

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    // Transform products to include branch availability
    const transformedProducts = await Promise.all(
      products.map(async (product) => {
        const branchAvailability = await this.getBranchAvailabilityForProduct(product.id);
        return {
          ...product,
          branchAvailability
        };
      })
    );

    return transformedProducts;
  }

  private async getBranchAvailabilityForProduct(productId: string): Promise<BranchAvailability[]> {
    const { data: availability, error } = await supabase
      .from('product_branch_availability')
      .select(`
        quantity,
        branches:branch_id (
          id,
          name,
          name_vi,
          address,
          address_vi,
          phone
        )
      `)
      .eq('product_id', productId);

    if (error || !availability) {
      console.error('Error fetching branch availability:', error);
      return [];
    }

    return availability.map((item: any) => ({
      branchId: item.branches.id,
      branchName: item.branches.name,
      branchNameVi: item.branches.name_vi,
      address: item.branches.address,
      addressVi: item.branches.address_vi,
      quantity: item.quantity,
      phone: item.branches.phone
    }));
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) {
      return this.getAllProducts();
    }

    const searchTerm = `%${query.toLowerCase()}%`;
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.${searchTerm},name_vi.ilike.${searchTerm},category.ilike.${searchTerm},category_vi.ilike.${searchTerm},description.ilike.${searchTerm},description_vi.ilike.${searchTerm}`);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    // Transform products to include branch availability
    const transformedProducts = await Promise.all(
      products.map(async (product) => {
        const branchAvailability = await this.getBranchAvailabilityForProduct(product.id);
        return {
          ...product,
          branchAvailability
        };
      })
    );

    return transformedProducts;
  }

  async checkAvailability(productId: string, branchId: string): Promise<number> {
    const { data: availability, error } = await supabase
      .from('product_branch_availability')
      .select('quantity')
      .eq('product_id', productId)
      .eq('branch_id', branchId)
      .maybeSingle();

    if (error || !availability) {
      return 0;
    }

    return availability.quantity;
  }

  async getAllBranches(): Promise<Branch[]> {
    const { data: branches, error } = await supabase
      .from('branches')
      .select('*');

    if (error) {
      console.error('Error fetching branches:', error);
      return [];
    }

    return branches;
  }
}