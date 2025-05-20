
import { useState } from 'react';
import { Product, ProductMaker } from '@/types/product';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';
import { generateCertificatePdf } from '@/utils/certificatePdfGenerator';
import { toast } from 'sonner';

type JudgingSummaryItem = {
  criteria_id: string;
  criteria_name: string;
  criteria_type: string;
  avg_rating: number | null;
  count_judges: number;
  count_true: number;
  count_false: number;
  weight: number;
};

type Judge = {
  id: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
    linkedin?: string | null;
  };
};

interface CertificateData {
  product: Product;
  makers: ProductMaker[];
  criteria: JudgingCriteria[];
  judgingSummary: JudgingSummaryItem[];
  judges: Judge[];
  overallScore: number | null;
  certificateUrl: string | null;
}

export const useCertificatePdf = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async (certificateData: CertificateData) => {
    if (!certificateData.product || !certificateData.makers || certificateData.makers.length === 0) {
      toast.error("Cannot generate PDF: Missing product or maker data");
      return;
    }

    try {
      setIsGenerating(true);
      toast.info("Generating PDF certificate...");
      
      await generateCertificatePdf(certificateData);
      
      toast.success("PDF Certificate generated successfully!");
    } catch (error) {
      console.error('Error generating PDF certificate:', error);
      toast.error("Failed to generate PDF certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePdf,
    isGenerating
  };
};
