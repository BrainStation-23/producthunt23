
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductMaker } from '@/types/product';
import { JudgingCriteria } from '@/components/admin/settings/judging/types';

type Judge = {
  id: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
};

type Grade = {
  id: string;
  criteria_name: string;
  criteria_id: string;
  score: number;
  max_score: number;
};

type JudgingSummary = {
  criteria_id: string;
  criteria_name: string;
  criteria_type: string;
  avg_rating: number | null;
  count_judges: number;
  count_true: number;
  count_false: number;
  weight: number;
};

export const useCertificationData = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [makers, setMakers] = useState<ProductMaker[]>([]);
  const [criteria, setCriteria] = useState<JudgingCriteria[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [judgingSummary, setJudgingSummary] = useState<JudgingSummary[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  
  // Generate the certificate URL for QR code
  const certificateUrl = productId 
    ? `${window.location.origin}/products/${productId}/certificate` 
    : null;

  useEffect(() => {
    const fetchCertificationData = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        // 1. Fetch product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (productError) throw productError;
        setProduct(productData as Product);
        
        // 2. Fetch makers
        const { data: makersData, error: makersError } = await supabase
          .from('product_makers')
          .select(`
            id,
            product_id,
            profile_id,
            created_at,
            profile:profiles (
              username,
              avatar_url
            )
          `)
          .eq('product_id', productId);
          
        if (makersError) throw makersError;
        setMakers(makersData as ProductMaker[]);
        
        // 3. Fetch judging criteria
        const { data: criteriaData, error: criteriaError } = await supabase
          .from('judging_criteria')
          .select('*')
          .order('weight', { ascending: false });
          
        if (criteriaError) throw criteriaError;
        setCriteria(criteriaData as JudgingCriteria[]);
        
        // 4. Fetch product judging summary using RPC function
        const { data: summaryData, error: summaryError } = await supabase
          .rpc('get_product_judging_summary', { product_uuid: productId });
          
        if (summaryError) throw summaryError;
        
        setJudgingSummary(summaryData);
        
        // Calculate overall score only from rating criteria
        const ratingEntries = summaryData.filter(item => 
          item.criteria_type === 'rating' && item.avg_rating !== null
        );
        
        if (ratingEntries.length > 0) {
          const totalWeight = ratingEntries.reduce((sum, item) => sum + item.weight, 0);
          const weightedSum = ratingEntries.reduce((sum, item) => 
            sum + ((item.avg_rating || 0) * item.weight), 0
          );
          
          setOverallScore(totalWeight > 0 ? weightedSum / totalWeight : null);
          
          // Format grades for backward compatibility
          const formattedGrades = ratingEntries.map(item => ({
            id: item.criteria_id,
            criteria_id: item.criteria_id,
            criteria_name: item.criteria_name,
            score: item.avg_rating || 0,
            max_score: 10 // Assuming max score is 10, adjust if needed
          }));
          
          setGrades(formattedGrades);
        }
        
        // 5. Fetch judges who evaluated this product
        const { data: judgeAssignments, error: judgeAssignmentError } = await supabase
          .from('judge_assignments')
          .select('id, judge_id')
          .eq('product_id', productId);
          
        if (judgeAssignmentError) throw judgeAssignmentError;
        
        // Now fetch judge profiles separately
        const judgeDatas: Judge[] = [];
        
        // Only proceed if we have judge assignments
        if (judgeAssignments && judgeAssignments.length > 0) {
          // Get all judge IDs
          const judgeIds = judgeAssignments.map(assignment => assignment.judge_id);
          
          // Fetch profiles for these judges
          const { data: judgeProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', judgeIds);
          
          if (profilesError) throw profilesError;
          
          // Map the judge profiles to the assignments
          for (const assignment of judgeAssignments) {
            const profile = judgeProfiles?.find(p => p.id === assignment.judge_id);
            if (profile) {
              judgeDatas.push({
                id: assignment.id,
                profile: {
                  username: profile.username,
                  avatar_url: profile.avatar_url
                }
              });
            }
          }
        }
        
        setJudges(judgeDatas);
        
      } catch (error) {
        console.error('Error fetching certification data:', error);
        toast.error('Failed to load certificate data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificationData();
  }, [productId]);

  return {
    product,
    makers,
    criteria,
    grades,
    judgingSummary,
    judges,
    isLoading,
    certificateUrl,
    overallScore
  };
};
