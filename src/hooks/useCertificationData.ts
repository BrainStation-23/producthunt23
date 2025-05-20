
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

export const useCertificationData = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [makers, setMakers] = useState<ProductMaker[]>([]);
  const [criteria, setCriteria] = useState<JudgingCriteria[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        
        // 4. Fetch grades (judging submissions)
        const { data: submissionsData, error: submissionsError } = await supabase
          .from('judging_submissions')
          .select(`
            id,
            criteria_id,
            rating_value,
            judging_criteria(name, max_value)
          `)
          .eq('product_id', productId);
          
        if (submissionsError) throw submissionsError;
        
        // Format grades data
        const formattedGrades = submissionsData
          .filter(sub => sub.rating_value !== null) // Only include submissions with ratings
          .map(sub => ({
            id: sub.id,
            criteria_id: sub.criteria_id,
            criteria_name: sub.judging_criteria?.name || 'Unknown Criteria',
            score: sub.rating_value || 0,
            max_score: sub.judging_criteria?.max_value || 10
          }));
        
        setGrades(formattedGrades);
        
        // 5. Fetch judges who evaluated this product - with a different approach
        // First, get the judge IDs from judge_assignments
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
    judges,
    isLoading,
    certificateUrl
  };
};
