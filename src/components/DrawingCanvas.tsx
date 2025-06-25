
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save, Pen, Eraser, Palette } from 'lucide-react';

interface DrawingCanvasProps {
  onSave: (imageData: string, title: string) => void;
  onClose: () => void;
}

export function DrawingCanvas({ onSave, onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [title, setTitle] = useState('My Drawing');

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brushSize;
      
      if (currentTool === 'pen') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
      } else {
        ctx.globalCompositeOperation = 'destination-out';
      }
      
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL();
    onSave(imageData, title);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-64"
            placeholder="Drawing title..."
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="bg-green-500 hover:bg-green-600">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Drawing Toolbar */}
        <div className="w-16 bg-gray-50 dark:bg-slate-700 border-r border-gray-200 dark:border-gray-600 p-2 flex flex-col gap-2">
          <Button
            variant={currentTool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('pen')}
            className="w-full"
          >
            <Pen className="w-4 h-4" />
          </Button>
          <Button
            variant={currentTool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('eraser')}
            className="w-full"
          >
            <Eraser className="w-4 h-4" />
          </Button>
          <div className="flex flex-col gap-1">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-8 h-8 rounded border-none cursor-pointer"
              title="Color"
            />
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full"
              title="Brush Size"
            />
          </div>
          <Button onClick={clearCanvas} variant="destructive" size="sm" className="w-full text-xs">
            Clear
          </Button>
        </div>
        
        <div className="flex-1 p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-300 dark:border-gray-600 bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}
