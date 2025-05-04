
import React, { useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ThumbnailGalleryProps {
  items: Array<{
    id: string;
    image_url: string;
    title?: string | null;
  }>;
  currentIndex: number;
  onSelectItem: (index: number) => void;
}

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({ 
  items, 
  currentIndex, 
  onSelectItem 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      {items.length > 4 && (
        <button
          onClick={scrollLeft}
          type="button" /* Added explicit button type */
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 border hover:bg-accent"
          aria-label="Scroll thumbnails left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      
      <ScrollArea className="w-full px-7">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 pb-4 px-1 overflow-x-auto scrollbar-hide"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button" /* Added explicit button type */
              onClick={() => onSelectItem(index)}
              className={cn(
                "relative flex-shrink-0 w-28 h-20 overflow-hidden rounded-md border-2 transition-all",
                currentIndex === index 
                  ? "border-primary ring-2 ring-primary ring-opacity-50 scale-105 shadow-md" 
                  : "border-transparent hover:border-primary/70 hover:scale-105 hover:shadow-sm"
              )}
              aria-label={item.title || `View screenshot ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
            >
              <img
                src={item.image_url}
                alt={item.title || `Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {currentIndex === index && (
                <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
      
      {items.length > 4 && (
        <button
          onClick={scrollRight}
          type="button" /* Added explicit button type */
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 border hover:bg-accent"
          aria-label="Scroll thumbnails right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ThumbnailGallery;
