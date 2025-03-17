
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserDashboardData {
  products: {
    count: number;
    items: any[];
  };
  savedProducts: {
    count: number;
    items: any[];
  };
  activity: {
    count: number;
    items: any[];
  };
  messages: {
    count: number;
    items: any[];
  };
}

export const useUserDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserDashboardData>({
    products: { count: 0, items: [] },
    savedProducts: { count: 0, items: [] },
    activity: { count: 0, items: [] },
    messages: { count: 0, items: [] },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch user's products
        const { data: userProducts, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (productsError) throw productsError;
        
        // Fetch user's saved products (from upvotes as a simple way to track "saved" items)
        const { data: savedProducts, error: savedError } = await supabase
          .from('upvotes')
          .select('*, products(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (savedError) throw savedError;
        
        // Count comments as "activity"
        const { data: userComments, error: commentsError } = await supabase
          .from('comments')
          .select('count', { count: 'exact' })
          .eq('user_id', user.id);
          
        if (commentsError) throw commentsError;
        
        // For this example, we don't have a messages table, so we'll just use 0
        // In a real app, you would fetch from your messages table
        
        setData({
          products: { 
            count: userProducts.length,
            items: userProducts 
          },
          savedProducts: { 
            count: savedProducts.length,
            items: savedProducts.map(upvote => upvote.products) 
          },
          activity: { 
            count: userComments[0]?.count || 0,
            items: [] // We're just getting the count for now
          },
          messages: { 
            count: 0, // Placeholder
            items: [] 
          }
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return {
    isLoading,
    data
  };
};
