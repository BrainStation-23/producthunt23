
import { Product, ProductMaker } from '@/types/product';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';

export type JudgingSummaryItem = {
  criteria_id: string;
  criteria_name: string;
  criteria_type: string;
  avg_rating: number | null;
  count_judges: number;
  count_true: number;
  count_false: number;
  weight: number;
};

export type Judge = {
  id: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
    linkedin?: string | null;
  };
};

export interface CertificateData {
  product: Product;
  makers: ProductMaker[];
  criteria: JudgingCriteria[];
  judgingSummary: JudgingSummaryItem[];
  judges: Judge[];
  overallScore: number | null;
  certificateUrl: string | null;
}
