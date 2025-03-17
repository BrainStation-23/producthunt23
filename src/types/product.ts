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
  profile_id?: string;
  profile_username?: string | null;
  profile_avatar_url?: string | null;
  status?: string;
}

export interface ProductsResponse {
  data: Product[];
  totalCount: number;
}

export interface ProductScreenshot {
  id: string;
  product_id: string;
  title: string | null;
  image_url: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface ProductVideo {
  id: string;
  product_id: string;
  title: string | null;
  video_url: string;
  display_order: number;
  created_at: string;
}

export interface ProductTechnology {
  id: string;
  product_id: string;
  technology_name: string;
  display_order: number;
  created_at: string;
}

export interface ProductMaker {
  id: string;
  product_id: string;
  profile_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Form-specific interfaces
export interface Screenshot {
  title?: string;
  image_url: string;
  description?: string;
}

export interface Video {
  title?: string;
  video_url: string;
}

export interface Maker {
  email: string;
  id: string | null;
  isCreator: boolean;
}

// Form values interface
export interface ProductFormValues {
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  image_url: string;
  technologies: string[];
  tags: string[];
  screenshots: Screenshot[];
  videos: Video[];
  makers: Maker[];
  agreed_to_policies: boolean;
}
