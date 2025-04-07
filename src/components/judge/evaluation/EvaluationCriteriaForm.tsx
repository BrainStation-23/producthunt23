
import React, { useState, useEffect } from 'react';
import { JudgingCriteria, EvaluationSubmission } from '@/components/admin/settings/judging/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface EvaluationCriteriaFormProps {
  productId: string;
  criteria: JudgingCriteria[];
}

const EvaluationCriteriaForm: React.FC<EvaluationCriteriaFormProps> = ({
  productId,
  criteria
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const queryClient = useQueryClient();

  // Fetch existing submissions for this product
  const { data: existingSubmissions } = useQuery({
    queryKey: ['evaluationSubmissions', productId],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser();
      const judgeId = authData.user?.id;
      
      if (!judgeId) {
        throw new Error('No authenticated user found');
      }
      
      const { data, error } = await supabase
        .from('judging_submissions')
        .select('*')
        .eq('judge_id', judgeId)
        .eq('product_id', productId);
        
      if (error) throw error;
      return data || [];
    }
  });

  // Initialize form values from existing submissions
  useEffect(() => {
    if (existingSubmissions && existingSubmissions.length > 0) {
      const values = {};
      existingSubmissions.forEach((submission) => {
        values[submission.criteria_id] = {
          rating_value: submission.rating_value,
          boolean_value: submission.boolean_value,
          text_value: submission.text_value
        };
      });
      setFormValues(values);
    }
  }, [existingSubmissions]);

  const saveSubmission = useMutation({
    mutationFn: async (submission: {
      criteriaId: string;
      field: string;
      value: any;
    }) => {
      const { criteriaId, field, value } = submission;
      const { data: authData } = await supabase.auth.getUser();
      const judgeId = authData.user?.id;
      
      if (!judgeId) {
        throw new Error('No authenticated user found');
      }

      // Check if submission exists
      const { data: existing } = await supabase
        .from('judging_submissions')
        .select('*')
        .eq('judge_id', judgeId)
        .eq('product_id', productId)
        .eq('criteria_id', criteriaId)
        .maybeSingle();

      if (existing) {
        // Update existing submission
        const { error } = await supabase
          .from('judging_submissions')
          .update({
            [field]: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
          
        if (error) throw error;
      } else {
        // Create new submission
        const { error } = await supabase
          .from('judging_submissions')
          .insert({
            judge_id: judgeId,
            product_id: productId,
            criteria_id: criteriaId,
            [field]: value
          });
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluationSubmissions', productId] });
    },
    onError: (error) => {
      toast.error('Failed to save evaluation');
      console.error('Error saving evaluation:', error);
    }
  });

  const handleChange = (criteriaId: string, field: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [criteriaId]: {
        ...prev[criteriaId],
        [field]: value
      }
    }));

    // Save the change to the database
    saveSubmission.mutate({ criteriaId, field, value });
  };

  if (criteria.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No evaluation criteria found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {criteria.map((criterion) => (
        <Card key={criterion.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-base">{criterion.name}</CardTitle>
            {criterion.description && (
              <CardDescription>{criterion.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {criterion.type === 'rating' && (
              <RatingCriterion
                criterion={criterion}
                value={formValues[criterion.id]?.rating_value || 0}
                onChange={(value) => handleChange(criterion.id, 'rating_value', value)}
              />
            )}

            {criterion.type === 'boolean' && (
              <BooleanCriterion
                criterion={criterion}
                value={formValues[criterion.id]?.boolean_value || false}
                onChange={(value) => handleChange(criterion.id, 'boolean_value', value)}
              />
            )}

            {criterion.type === 'text' && (
              <TextCriterion
                criterion={criterion}
                value={formValues[criterion.id]?.text_value || ''}
                onChange={(value) => handleChange(criterion.id, 'text_value', value)}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface RatingCriterionProps {
  criterion: JudgingCriteria;
  value: number;
  onChange: (value: number) => void;
}

const RatingCriterion: React.FC<RatingCriterionProps> = ({
  criterion,
  value,
  onChange
}) => {
  const minValue = criterion.min_value || 0;
  const maxValue = criterion.max_value || 10;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Rating</Label>
          <span className="text-sm font-medium">{value} / {maxValue}</span>
        </div>
        <Slider
          value={[value]}
          min={minValue}
          max={maxValue}
          step={1}
          onValueChange={(values) => onChange(values[0])}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

interface BooleanCriterionProps {
  criterion: JudgingCriteria;
  value: boolean;
  onChange: (value: boolean) => void;
}

const BooleanCriterion: React.FC<BooleanCriterionProps> = ({
  criterion,
  value,
  onChange
}) => {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={`checkbox-${criterion.id}`}
        checked={value}
        onCheckedChange={onChange}
      />
      <div className="space-y-1 leading-none">
        <Label
          htmlFor={`checkbox-${criterion.id}`}
          className="cursor-pointer font-normal"
        >
          Yes, this product meets this criterion
        </Label>
      </div>
    </div>
  );
};

interface TextCriterionProps {
  criterion: JudgingCriteria;
  value: string;
  onChange: (value: string) => void;
}

const TextCriterion: React.FC<TextCriterionProps> = ({
  criterion,
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`text-${criterion.id}`}>Comments</Label>
      <Textarea
        id={`text-${criterion.id}`}
        placeholder="Enter your evaluation comments here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default EvaluationCriteriaForm;
