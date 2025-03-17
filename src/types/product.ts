
export interface Product {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image_url: string | null;
  website_url: string | null;
  tags: string[] | null;
  upvotes: number;
  created_at: string;
  created_by: string;
  profile_id: string;
  profile_username: string | null;
  profile_avatar_url: string | null;
}

export interface ProductsResponse {
  data: Product[];
  totalCount: number;
}
