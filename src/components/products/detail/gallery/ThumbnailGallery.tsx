
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4 px-1">
        {items.map((item, index) => (
          <button
            key={item.id}
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
  );
};

export default ThumbnailGallery;
