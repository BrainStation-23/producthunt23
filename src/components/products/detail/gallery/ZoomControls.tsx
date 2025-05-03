
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ scale, onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute top-4 left-4 flex gap-2 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        disabled={scale >= 3}
        className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        <ZoomIn className="h-5 w-5" />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        disabled={scale <= 1}
        className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
      >
        <ZoomOut className="h-5 w-5" />
        <span className="sr-only">Zoom out</span>
      </Button>
    </div>
  );
};

export default ZoomControls;
