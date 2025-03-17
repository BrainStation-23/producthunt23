
export interface Comment {
  id: string;
  content: string;
  created_at: string | null;
  product_id: string;
  user_id: string;
  parent_id: string | null;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}
