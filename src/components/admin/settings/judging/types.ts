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
  status?: string;
  assigned_at: string;
  evaluation_status: 'pending' | 'in_progress' | 'completed';
  deadline?: string | null;
  priority: 'low' | 'medium' | 'high';
  notes?: string | null;
  description?: string;
  website_url?: string | null;
  categories?: string[] | null;
  categoryNames?: string[] | null;
  technologies?: string[] | null;
}

export interface JudgingCriteria {
  id: string;
  name: string;
  description?: string;
  type: 'rating' | 'boolean' | 'text';
  min_value?: number;
  max_value?: number;
  weight: number;
}

export interface EvaluationSubmission {
  product_id: string;
  criteria_id: string;
  rating_value?: number;
  boolean_value?: boolean;
  text_value?: string;
}

export interface JudgingEvaluation {
  id: string;
  judge_id: string;
  product_id: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string | null;
  deadline?: string | null;
  created_at: string;
  updated_at: string;
}
