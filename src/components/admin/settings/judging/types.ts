
export interface Judge {
  id: string;
  username: string | null;
  email: string;
  avatar_url: string | null;
  assigned_product_count: number;
}

export interface AssignedProduct {
  id: string;
  name: string;
  tagline: string;
  image_url: string | null;
  status: string;
  assigned_at: string;
  evaluation_status?: 'pending' | 'in_progress' | 'completed';
  deadline?: string | null;
  priority?: 'low' | 'medium' | 'high';
}

export interface JudgingCriteria {
  id: string;
  name: string;
  description?: string;
  type: 'rating' | 'boolean' | 'text';
  min_value?: number;
  max_value?: number;
}

export interface EvaluationSubmission {
  product_id: string;
  criteria_id: string;
  rating_value?: number;
  boolean_value?: boolean;
  text_value?: string;
}
