
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; 
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useJudgingCriteria } from '@/hooks/useJudgingCriteria';

export const ScoringFilters: React.FC = () => {
  const { toast } = useToast();
  const { criteria, isLoading } = useJudgingCriteria();
  
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 10]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('status', 'active');
          
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error("Error fetching categories:", err);
        toast({
          title: "Error loading categories",
          description: "Failed to load category filters",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(current => 
      current.includes(categoryId)
        ? current.filter(id => id !== categoryId)
        : [...current, categoryId]
    );
  };

  const handleCriteriaChange = (criteriaId: string) => {
    setSelectedCriteria(current => 
      current.includes(criteriaId)
        ? current.filter(id => id !== criteriaId)
        : [...current, criteriaId]
    );
  };
  
  const handleScoreRangeChange = (values: number[]) => {
    setScoreRange([values[0], values[1]]);
  };
  
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedCriteria([]);
    setScoreRange([0, 10]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Categories Filter */}
        <div>
          <Label className="mb-2 block font-medium">Categories</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories?.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Criteria Filter */}
        <div>
          <Label className="mb-2 block font-medium">Judging Criteria</Label>
          <div className="grid grid-cols-1 gap-2 max-h-24 overflow-y-auto">
            {criteria?.map(criterion => (
              <div key={criterion.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`criteria-${criterion.id}`}
                  checked={selectedCriteria.includes(criterion.id)}
                  onCheckedChange={() => handleCriteriaChange(criterion.id)}
                />
                <label
                  htmlFor={`criteria-${criterion.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                >
                  {criterion.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Score Range Filter */}
        <div>
          <Label className="mb-2 block font-medium">
            Score Range: {scoreRange[0].toFixed(1)} - {scoreRange[1].toFixed(1)}
          </Label>
          <div className="px-2 py-6">
            <Slider
              defaultValue={[0, 10]}
              max={10}
              step={0.1}
              value={[scoreRange[0], scoreRange[1]]}
              onValueChange={handleScoreRangeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset} className="mr-2">
          Reset Filters
        </Button>
        <Button>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
