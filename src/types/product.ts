
export interface Product {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image_url: string | null;
  website_url: string | null;
  categories: string[] | null;
  categoryNames?: string[] | null;
  technologies: string[] | null;
  upvotes: number;
  created_at: string;
  created_by: string;
  profile_id?: string;
  profile_username?: string | null;
  profile_avatar_url?: string | null;
  status?: string;
  rejection_feedback?: string | null;
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
  profile?: {
    username: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

export interface Category {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

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
  id: string | null;
  isCreator: boolean;
  username: string | null;
  avatar_url?: string | null;
}

export interface ProductFormValues {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  image_url: string;
  technologies: string[];
  categories: string[];
  screenshots: Screenshot[];
  videos: Video[];
  makers: Maker[];
  agreed_to_policies: boolean;
}
