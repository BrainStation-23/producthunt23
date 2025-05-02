
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Globe, Twitter, Linkedin, Github } from 'lucide-react';
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
    <Card className="shadow-md">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-base font-semibold">Project Team</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-3">
          {makers.map((maker) => (
            <HoverCard key={maker.id}>
              <HoverCardTrigger asChild>
                <div 
                  className="flex items-center gap-2 bg-secondary/30 hover:bg-secondary/50 transition-colors rounded-full py-1.5 pl-1 pr-3 cursor-pointer"
                >
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={maker.profile?.avatar_url || ''} alt={maker.profile?.username || 'Maker'} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{getInitials(maker.profile?.username)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{maker.profile?.username || 'Anonymous'}</span>
                  {maker.profile_id === creatorId && (
                    <Badge variant="default" className="h-5 text-xs px-1.5">Creator</Badge>
                  )}
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-0 shadow-lg">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 p-4 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={maker.profile?.avatar_url || ''} alt={maker.profile?.username || 'Maker'} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">{getInitials(maker.profile?.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{maker.profile?.username || 'Anonymous'}</h3>
                      {maker.profile_id === creatorId && (
                        <Badge variant="default" className="mt-1">Product Creator</Badge>
                      )}
                    </div>
                  </div>
                  
                  {maker.profile?.bio && (
                    <div className="p-4 border-b">
                      <p className="text-sm text-muted-foreground">{maker.profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {maker.profile?.website && (
                        <a 
                          href={maker.profile.website.startsWith('http') ? maker.profile.website : `https://${maker.profile.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <Globe className="h-3 w-3" />
                          Website
                        </a>
                      )}
                      
                      {maker.profile?.twitter && (
                        <a 
                          href={`https://twitter.com/${maker.profile.twitter.replace('@', '')}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
                        >
                          <Twitter className="h-3 w-3" />
                          Twitter
                        </a>
                      )}
                      
                      {maker.profile?.linkedin && (
                        <a 
                          href={maker.profile.linkedin.startsWith('http') ? maker.profile.linkedin : `https://linkedin.com/in/${maker.profile.linkedin}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                        >
                          <Linkedin className="h-3 w-3" />
                          LinkedIn
                        </a>
                      )}
                      
                      {maker.profile?.github && (
                        <a 
                          href={`https://github.com/${maker.profile.github}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <Github className="h-3 w-3" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductMakers;
