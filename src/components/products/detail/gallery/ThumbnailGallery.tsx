
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
      <div className="flex gap-3 pb-4 px-1">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(index)}
            className={cn(
              "relative flex-shrink-0 w-24 h-20 overflow-hidden rounded-md border-2 transition-all",
              currentIndex === index 
                ? "border-primary ring-2 ring-primary ring-opacity-50" 
                : "border-transparent hover:border-primary/70"
            )}
            aria-label={item.title || `View screenshot ${index + 1}`}
            aria-current={currentIndex === index ? "true" : "false"}
          >
            <img
              src={item.image_url}
              alt={item.title || `Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ThumbnailGallery;
