import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Download, Save, Trash2, Undo, Redo, Upload, Move, RotateCw } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface DrawingCanvasProps {
  onSave?: (imageData: string, title: string) => void;
  onClose?: () => void;
}

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

export function DrawingCanvas({ onSave, onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [objects, setObjects] = useState<DrawingObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas bigger and responsive
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(1200, container.clientWidth - 32);
        canvas.height = Math.min(800, window.innerHeight - 200);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Set background color based on theme
    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [theme]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    
    if (tool === 'move') {
      // Check if clicking on an object
      const clickedObject = objects.find(obj => 
        pos.x >= obj.x && pos.x <= obj.x + obj.width &&
        pos.y >= obj.y && pos.y <= obj.y + obj.height
      );
      
      if (clickedObject) {
        setSelectedObject(clickedObject.id);
        setIsDragging(true);
        setDragStart({ x: pos.x - clickedObject.x, y: pos.y - clickedObject.y });
      }
      return;
    }

    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (tool === 'move' && isDragging && selectedObject) {
      // Move selected object
      setObjects(prev => prev.map(obj => 
        obj.id === selectedObject 
          ? { ...obj, x: pos.x - dragStart.x, y: pos.y - dragStart.y }
          : obj
      ));
      redrawCanvas();
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set tool properties
    switch (tool) {
      case 'pen':
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'pencil':
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize * 0.7;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'highlighter':
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = color + '40';
        ctx.lineWidth = brushSize * 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
    if (isDragging) {
      setIsDragging(false);
    }
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const newObject: DrawingObject = {
          id: Date.now().toString(),
          type: 'image',
          data: event.target?.result as string,
          x: 50,
          y: 50,
          width: Math.min(img.width, 300),
          height: Math.min(img.height, 300),
          rotation: 0
        };
        setObjects(prev => [...prev, newObject]);
        redrawCanvas();
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const rotateSelectedObject = () => {
    if (!selectedObject) return;
    setObjects(prev => prev.map(obj => 
      obj.id === selectedObject 
        ? { ...obj, rotation: (obj.rotation + 90) % 360 }
        : obj
    ));
    redrawCanvas();
  };

  const resizeSelectedObject = (scale: number) => {
    if (!selectedObject) return;
    setObjects(prev => prev.map(obj => 
      obj.id === selectedObject 
        ? { ...obj, width: obj.width * scale, height: obj.height * scale }
        : obj
    ));
    redrawCanvas();
  };

  const fillArea = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'fill') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getMousePos(e);
    floodFill(ctx, Math.floor(pos.x), Math.floor(pos.y), color);
    saveState();
  };

  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const startIdx = (startY * width + startX) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];
    const startA = data[startIdx + 3];

    const fillRGB = hexToRgb(fillColor);
    if (!fillRGB) return;

    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const idx = (y * width + x) * 4;
      if (
        data[idx] === startR &&
        data[idx + 1] === startG &&
        data[idx + 2] === startB &&
        data[idx + 3] === startA
      ) {
        data[idx] = fillRGB.r;
        data[idx + 1] = fillRGB.g;
        data[idx + 2] = fillRGB.b;
        data[idx + 3] = 255;

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex - 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setObjects([]);
    saveState();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // First redraw everything including objects
    redrawCanvas();
    
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `drawing-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }, 100);
  };

  const saveAsNote = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSave) return;

    // Redraw everything including objects
    redrawCanvas();
    
    setTimeout(() => {
      const imageData = canvas.toDataURL();
      const title = `Drawing ${new Date().toLocaleDateString()}`;
      onSave(imageData, title);
    }, 100);
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 overflow-hidden">
      {/* Responsive Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 sm:p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-x-auto">
        {/* Tools */}
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            🖊️ Pen
          </Button>
          <Button
            variant={tool === 'pencil' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pencil')}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            ✏️ Pencil
          </Button>
          <Button
            variant={tool === 'highlighter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('highlighter')}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            🖍️ Highlighter
          </Button>
          <Button
            variant={tool === 'fill' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('fill')}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            🪣 Fill
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            🧹 Eraser
          </Button>
          <Button
            variant={tool === 'move' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('move')}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Move className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Move
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8 hidden sm:block" />

        {/* Colors - scrollable on mobile */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 transition-all hover:scale-110 flex-shrink-0 ${
                color === c ? 'border-slate-600 dark:border-slate-300' : 'border-slate-300 dark:border-slate-600'
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded border-2 border-slate-300 dark:border-slate-600 cursor-pointer hover:scale-110 transition-all flex-shrink-0"
          />
        </div>

        <Separator orientation="vertical" className="h-8 hidden sm:block" />

        {/* Brush Size */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">Size:</span>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-16 sm:w-20"
          />
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300 w-4 sm:w-6">{brushSize}</span>
        </div>

        <Separator orientation="vertical" className="h-8 hidden sm:block" />

        {/* File Upload */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs sm:text-sm transition-all hover:scale-105"
        >
          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Upload
        </Button>

        {/* Object Controls */}
        {selectedObject && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={rotateSelectedObject}
              className="text-xs sm:text-sm transition-all hover:scale-105"
            >
              <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resizeSelectedObject(1.2)}
              className="text-xs sm:text-sm transition-all hover:scale-105"
            >
              +
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resizeSelectedObject(0.8)}
              className="text-xs sm:text-sm transition-all hover:scale-105"
            >
              -
            </Button>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Undo className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Redo className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Save/Export */}
        <div className="flex gap-1 sm:gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadImage}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Export
          </Button>
          {onSave && (
            <Button
              size="sm"
              onClick={saveAsNote}
              className="text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-105"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Save
            </Button>
          )}
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs sm:text-sm transition-all hover:scale-105"
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 p-2 sm:p-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-auto">
        <canvas
          ref={canvasRef}
          className="border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg cursor-crosshair max-w-full max-h-full"
          onMouseDown={tool === 'fill' ? fillArea : startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
