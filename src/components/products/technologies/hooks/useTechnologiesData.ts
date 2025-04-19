import { useDeviconData, techCategories, categorizeTechnology } from '@/services/deviconService';

export const useTechnologiesData = () => {
  const { data: deviconData, isLoading } = useDeviconData();

  // You can add any additional logic here to process or filter the data

  return {
    deviconData,
    isLoading,
    techCategories,
    categorizeTechnology,
  };
};
