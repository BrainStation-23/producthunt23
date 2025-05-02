
import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThumbnailItem {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
}

interface ThumbnailStripProps {
  items: ThumbnailItem[];
  selectedItemIndex: number | null;
  onSelectItem: (index: number) => void;
}

const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({
  items,
  selectedItemIndex,
  onSelectItem
}) => {
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if scrolling is possible
  const checkScrollability = () => {
    if (!thumbnailScrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = thumbnailScrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  // Effect to check scrollability on mount and when items change
  useEffect(() => {
    checkScrollability();
    // Add resize observer to check scrollability when window resizes
    const resizeObserver = new ResizeObserver(checkScrollability);
    if (thumbnailScrollRef.current) {
      resizeObserver.observe(thumbnailScrollRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [items]);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!thumbnailScrollRef.current) return;
    
    const scrollAmount = 250; // Increased scroll amount for better navigation
    const currentScroll = thumbnailScrollRef.current.scrollLeft;
    
    thumbnailScrollRef.current.scrollTo({
      left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
    
    // Update scroll buttons state after scrolling
    setTimeout(checkScrollability, 300);
  };

  return (
    <div className="relative mt-4">
      <Button
        variant="outline"
        size="icon"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-opacity ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        onClick={() => scrollThumbnails('left')}
        disabled={!canScrollLeft}
        type="button"
        aria-label="Scroll thumbnails left"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Scroll left</span>
      </Button>

      <div className="relative px-10">
        <div 
          ref={thumbnailScrollRef}
          className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={checkScrollability}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`relative flex-shrink-0 w-32 cursor-pointer overflow-hidden transition-all rounded-md border-2
                ${selectedItemIndex === index ? "border-primary" : "border-transparent hover:border-primary/50"}`}
              onClick={() => onSelectItem(index)}
            >
              <div className="aspect-video">
                <img
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground capitalize">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm transition-opacity ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
        onClick={() => scrollThumbnails('right')}
        disabled={!canScrollRight}
        type="button"
        aria-label="Scroll thumbnails right"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Scroll right</span>
      </Button>
    </div>
  );
};

export default ThumbnailStrip;
