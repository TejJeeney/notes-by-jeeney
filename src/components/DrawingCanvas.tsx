import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Save } from 'lucide-react';
import { DrawingToolbar } from './drawing/DrawingToolbar';
import { CanvasArea } from './drawing/CanvasArea';
import { FileUploadHandler } from './drawing/FileUploadHandler';

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
  const [drawingObjects, setDrawingObjects] = useState<DrawingObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

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
    setDrawingObjects([]);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL();
    onSave(imageData, title);
  };

  const redrawCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    drawingObjects.forEach((obj) => {
      if (obj.type === 'image') {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
          ctx.rotate((obj.rotation * Math.PI) / 180);
          ctx.drawImage(img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
          ctx.restore();
        };
        img.src = obj.data as string;
      }
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [drawingObjects]);

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
        <DrawingToolbar
          currentTool={currentTool}
          onToolChange={setCurrentTool}
          currentColor={currentColor}
          onColorChange={setCurrentColor}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          onClear={clearCanvas}
        />
        
        <div className="flex-1 p-4">
          <CanvasArea
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            drawingObjects={drawingObjects}
            selectedObject={selectedObject}
            onObjectSelect={setSelectedObject}
          />
        </div>
      </div>

      <FileUploadHandler
        onObjectsUpdate={(newObjects) => {
          setDrawingObjects(prev => [...prev, ...newObjects]);
        }}
        onRedraw={redrawCanvas}
      />
    </div>
  );
}
