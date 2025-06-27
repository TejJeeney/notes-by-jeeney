
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from '@/hooks/useTheme';

type Tool = 'pen' | 'pencil' | 'highlighter' | 'eraser' | 'fill' | 'move';

interface DrawingObject {
  id: string;
  type: 'image' | 'drawing';
  data: string | ImageData;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface CanvasAreaProps {
  tool: Tool;
  color: string;
  brushSize: number;
  objects: DrawingObject[];
  selectedObject: string | null;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onFillClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export interface CanvasAreaRef {
  getCanvas: () => HTMLCanvasElement | null;
  redrawCanvas: () => void;
  exportAsImage: (format: 'png' | 'jpeg', quality?: number) => string;
}

export const CanvasArea = forwardRef<CanvasAreaRef, CanvasAreaProps>(({
  tool,
  color,
  brushSize,
  objects,
  selectedObject,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onFillClick
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set background
    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all objects
    objects.forEach(obj => {
      if (obj.type === 'image') {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.translate(obj.x + obj.width/2, obj.y + obj.height/2);
          ctx.rotate(obj.rotation * Math.PI / 180);
          ctx.drawImage(img, -obj.width/2, -obj.height/2, obj.width, obj.height);
          ctx.restore();

          // Draw selection border if selected
          if (obj.id === selectedObject) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
            ctx.setLineDash([]);
          }
        };
        img.src = obj.data as string;
      }
    });
  };

  const exportAsImage = (format: 'png' | 'jpeg', quality: number = 0.9): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    if (format === 'jpeg') {
      return canvas.toDataURL('image/jpeg', quality);
    } else {
      return canvas.toDataURL('image/png');
    }
  };

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    redrawCanvas,
    exportAsImage
  }));

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'fill' && onFillClick) {
      onFillClick(e);
    } else {
      onMouseDown(e);
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-auto">
      <canvas
        ref={canvasRef}
        className="border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg cursor-crosshair max-w-full max-h-full"
        onMouseDown={handleClick}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      />
    </div>
  );
});

CanvasArea.displayName = 'CanvasArea';
