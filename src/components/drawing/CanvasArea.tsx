
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

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
  onFileUpload?: (file: File) => void;
}

export interface CanvasAreaRef {
  getCanvas: () => HTMLCanvasElement | null;
  redrawCanvas: () => void;
  saveDrawing: (format: 'png' | 'jpeg') => void;
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
  onFillClick,
  onFileUpload
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const saveDrawing = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('No canvas to save');
      return;
    }

    try {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpeg' ? 0.9 : undefined;
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `drawing-${Date.now()}.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success(`Drawing saved as ${format.toUpperCase()}!`);
        } else {
          toast.error('Failed to save drawing');
        }
      }, mimeType, quality);
    } catch (error) {
      console.error('Error saving drawing:', error);
      toast.error('Failed to save drawing');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      // Check if file is an allowed type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        onFileUpload(file);
        toast.success('File uploaded successfully!');
      } else {
        toast.error('Please upload PNG, JPEG, JPG, or PDF files only');
      }
    }
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    redrawCanvas,
    saveDrawing
  }));

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'fill' && onFillClick) {
      onFillClick(e);
    } else {
      onMouseDown(e);
    }
  };

  return (
    <div className="flex-1 p-2 sm:p-4 bg-slate-100 dark:bg-slate-900 flex flex-col">
      {/* Toolbar */}
      <div className="flex gap-2 mb-4 justify-center">
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileUpload}
          ref={fileInputRef}
          className="hidden"
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>

        <Button
          onClick={() => saveDrawing('png')}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Save PNG
        </Button>

        <Button
          onClick={() => saveDrawing('jpeg')}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Download className="w-4 h-4" />
          Save JPEG
        </Button>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center overflow-auto">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg cursor-crosshair max-w-full max-h-full"
          onMouseDown={handleClick}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
      </div>
    </div>
  );
});

CanvasArea.displayName = 'CanvasArea';
