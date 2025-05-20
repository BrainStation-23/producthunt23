
import React from 'react';
import { ProductMaker } from '@/types/product';
import { Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CertificateMakersProps {
  makers: ProductMaker[];
  featured?: boolean;
}

const CertificateMakers = ({ makers, featured = false }: CertificateMakersProps) => {
  if (!makers || makers.length === 0) {
    return null;
  }

  if (featured) {
    // Featured mode for the first page (more prominent)
    return (
      <div className="flex flex-wrap justify-center gap-4 my-4">
        {makers.map((maker) => (
          <div key={maker.id} className="text-center">
            {maker.profile?.avatar_url && (
              <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-primary/20">
                <AvatarImage 
                  src={maker.profile.avatar_url} 
                  alt={maker.profile?.username || 'Maker'} 
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {(maker.profile?.username?.substring(0, 2) || '??').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-2xl font-bold text-primary block">
              {maker.profile?.linkedin ? (
                <a 
                  href={maker.profile.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center"
                >
                  {maker.profile?.username || 'Unknown Maker'}
                  <Linkedin className="ml-1 h-4 w-4" />
                </a>
              ) : (
                maker.profile?.username || 'Unknown Maker'
              )}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Standard mode for the second page (compact)
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
              <Linkedin className="ml-1 h-4 w-4" />
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
