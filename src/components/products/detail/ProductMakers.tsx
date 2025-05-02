
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductMaker } from '@/types/product';

interface ProductMakersProps {
  makers: ProductMaker[];
  creatorId?: string;
}

const ProductMakers: React.FC<ProductMakersProps> = ({ makers, creatorId }) => {
  if (!makers || makers.length === 0) {
    return null;
  }

  const getInitials = (username?: string | null) => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Makers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {makers.map((maker) => (
            <div 
              key={maker.id} 
              className="flex items-center gap-2 bg-secondary/50 rounded-full py-1 pl-1 pr-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={maker.profile?.avatar_url || ''} alt={maker.profile?.username || 'Maker'} />
                <AvatarFallback>{getInitials(maker.profile?.username)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{maker.profile?.username || 'Anonymous'}</span>
              {maker.profile_id === creatorId && (
                <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">Creator</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductMakers;
