
export interface Category {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
