
import React from 'react';
import { ProductMaker } from '@/types/product';
import { Linkedin } from 'lucide-react';

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
          {maker.profile?.linkedin ? (
            <a 
              href={maker.profile.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center"
            >
              {maker.profile?.username || 'Unknown Maker'}
            </a>
          ) : (
            maker.profile?.username || 'Unknown Maker'
          )}
          {index < makers.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
};

export default CertificateMakers;
