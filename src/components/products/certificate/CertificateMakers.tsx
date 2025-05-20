
import React from 'react';
import { ProductMaker } from '@/types/product';

interface CertificateMakersProps {
  makers: ProductMaker[];
}

const CertificateMakers = ({ makers }: CertificateMakersProps) => {
  if (!makers || makers.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      {makers.map((maker, index) => (
        <span key={maker.id} className="text-xl md:text-2xl font-bold text-primary">
          {maker.profile?.username || 'Unknown Maker'}
          {index < makers.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
};

export default CertificateMakers;
