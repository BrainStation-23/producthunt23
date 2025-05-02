
import React, { useState, useEffect } from 'react';
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
      <div className="flex gap-2 pb-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelectItem(index)}
            className={cn(
              "relative flex-shrink-0 w-20 h-20 overflow-hidden rounded border-2 transition-all",
              currentIndex === index 
                ? "border-primary" 
                : "border-transparent hover:border-primary/50"
            )}
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
