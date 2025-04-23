import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '@/hooks/useProductDetail';
import { useJudgingCriteria } from '@/hooks/useJudgingCriteria';

import EvaluationHeader from '@/components/judge/evaluation/EvaluationHeader';
import ProductOverview from '@/components/judge/evaluation/ProductOverview';
import NotesSection from '@/components/judge/evaluation/NotesSection';
import CriteriaEvaluationCard from '@/components/judge/evaluation/CriteriaEvaluationCard';
import LoadingState from '@/components/judge/evaluation/LoadingState';
import ProductNotFound from '@/components/judge/evaluation/ProductNotFound';
import { useEvaluationState } from '@/components/judge/evaluation/hooks/useEvaluationState';

const ProductEvaluation: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, isLoading: isProductLoading, screenshots } = useProductDetail(productId);
  const { criteria, isLoading: isCriteriaLoading } = useJudgingCriteria();
  
  const {
    notes,
    setNotes,
    isSaving,
    status,
    priority,
    handleSaveNotes,
    handleCompleteEvaluation,
    currentProduct
  } = useEvaluationState(productId);

  if (isProductLoading || isCriteriaLoading) {
    return <LoadingState />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const assignedProduct = {
    ...product,
    assigned_at: currentProduct?.assigned_at || new Date().toISOString(),
    evaluation_status: status,
    priority: priority,
    deadline: new Date().toISOString(),
    notes: notes,
    categories: product.categories,
    technologies: product.technologies
  };

  return (
    <div className="space-y-6">
      <EvaluationHeader status={status} priority={priority} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <ProductOverview product={assignedProduct} screenshots={screenshots} />
          
          <NotesSection
            notes={notes}
            setNotes={setNotes}
            onSave={handleSaveNotes}
            isSaving={isSaving}
          />
        </div>
        
        <div className="md:col-span-2">
          <CriteriaEvaluationCard
            productId={productId!}
            criteria={criteria}
            onComplete={handleCompleteEvaluation}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductEvaluation;
