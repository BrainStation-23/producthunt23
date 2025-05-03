
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
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        disabled={scale >= 3}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        disabled={scale <= 1}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ZoomControls;
