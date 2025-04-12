
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface WebsiteButtonProps {
  url: string | null;
}

const WebsiteButton: React.FC<WebsiteButtonProps> = ({ url }) => {
  if (!url) return null;
  
  return (
    <Button 
      className="w-full" 
      onClick={() => window.open(url, '_blank')}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      Visit Website
    </Button>
  );
};

export default WebsiteButton;
