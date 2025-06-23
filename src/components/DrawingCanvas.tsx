
import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Download, Save, Trash2, Undo, Redo } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface DrawingCanvasProps {
  onSave?: (imageData: string, title: string) => void;
  onClose?: () => void;
}

type Tool = 'pen' | 'pencil' | 'highlighter' | 'eraser' | 'fill';

export function DrawingCanvas({ onSave, onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
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

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Set background color based on theme
    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);
  }, [theme]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
        ctx.strokeStyle = color + '40'; // Add transparency
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

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const fillArea = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'fill') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    floodFill(ctx, x, y, color);
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

    // Convert fill color to RGB
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
    saveState();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveAsNote = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSave) return;

    const imageData = canvas.toDataURL();
    const title = `Drawing ${new Date().toLocaleDateString()}`;
    onSave(imageData, title);
  };

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        {/* Tools */}
        <div className="flex gap-2">
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            className="transition-all hover:scale-105"
          >
            🖊️ Pen
          </Button>
          <Button
            variant={tool === 'pencil' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pencil')}
            className="transition-all hover:scale-105"
          >
            ✏️ Pencil
          </Button>
          <Button
            variant={tool === 'highlighter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('highlighter')}
            className="transition-all hover:scale-105"
          >
            🖍️ Highlighter
          </Button>
          <Button
            variant={tool === 'fill' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('fill')}
            className="transition-all hover:scale-105"
          >
            🪣 Fill
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="transition-all hover:scale-105"
          >
            🧹 Eraser
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Colors */}
        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
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
            className="w-6 h-6 rounded border-2 border-slate-300 dark:border-slate-600 cursor-pointer hover:scale-110 transition-all"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-300">Size:</span>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-20"
          />
          <span className="text-sm font-mono text-slate-600 dark:text-slate-300 w-6">{brushSize}</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="transition-all hover:scale-105"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="transition-all hover:scale-105"
          >
            <Redo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="transition-all hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Save/Export */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadImage}
            className="transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          {onSave && (
            <Button
              size="sm"
              onClick={saveAsNote}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4 mr-1" />
              Save as Note
            </Button>
          )}
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="transition-all hover:scale-105"
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg cursor-crosshair"
          onMouseDown={tool === 'fill' ? fillArea : startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}
