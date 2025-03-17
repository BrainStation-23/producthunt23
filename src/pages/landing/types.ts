
import { Product } from '@/types/product';

// Type for featured category
export interface FeaturedCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  display_order: number;
}

// Type for featured products
export interface FeaturedProduct extends Omit<Product, 'technologies'> {
  display_order: number;
  profile_username?: string;
  profile_avatar_url?: string;
}
