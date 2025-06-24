import { useEffect, useState, useCallback, useRef } from 'react';
import { DrawingToolbar } from './drawing/DrawingToolbar';
import { CanvasArea, CanvasAreaRef } from './drawing/CanvasArea';
import { FileUploadHandler } from './drawing/FileUploadHandler';
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
  const canvasRef = useRef<CanvasAreaRef>(null);
  const fileHandlerRef = useRef<{ triggerUpload: () => void }>(null);
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
    const canvas = canvasRef.current?.getCanvas();
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
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = Math.min(1200, container.clientWidth - 32);
        canvas.height = Math.min(800, window.innerHeight - 200);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([imageData]);
    setHistoryIndex(0);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [theme]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current?.getCanvas();
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
    
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (tool === 'move' && isDragging && selectedObject) {
      setObjects(prev => prev.map(obj => 
        obj.id === selectedObject 
          ? { ...obj, x: pos.x - dragStart.x, y: pos.y - dragStart.y }
          : obj
      ));
      canvasRef.current?.redrawCanvas();
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current?.getCanvas();
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

  const fillArea = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'fill') return;

    const canvas = canvasRef.current?.getCanvas();
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
      const canvas = canvasRef.current?.getCanvas();
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
      const canvas = canvasRef.current?.getCanvas();
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = theme === 'dark' ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setObjects([]);
    saveState();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    canvasRef.current?.redrawCanvas();
    
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `drawing-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }, 100);
  };

  const saveAsNote = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas || !onSave) return;

    canvasRef.current?.redrawCanvas();
    
    setTimeout(() => {
      const imageData = canvas.toDataURL();
      const title = `Drawing ${new Date().toLocaleDateString()}`;
      onSave(imageData, title);
    }, 100);
  };

  const handleFileUpload = () => {
    fileHandlerRef.current?.triggerUpload();
  };

  const rotateSelectedObject = () => {
    if (!selectedObject) return;
    setObjects(prev => prev.map(obj => 
      obj.id === selectedObject 
        ? { ...obj, rotation: (obj.rotation + 90) % 360 }
        : obj
    ));
    canvasRef.current?.redrawCanvas();
  };

  const resizeSelectedObject = (scale: number) => {
    if (!selectedObject) return;
    setObjects(prev => prev.map(obj => 
      obj.id === selectedObject 
        ? { ...obj, width: obj.width * scale, height: obj.height * scale }
        : obj
    ));
    canvasRef.current?.redrawCanvas();
  };

  const handleObjectsUpdate = (newObjects: DrawingObject[]) => {
    setObjects(prev => [...prev, ...newObjects]);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 overflow-hidden">
      <DrawingToolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        selectedObject={selectedObject}
        historyIndex={historyIndex}
        historyLength={history.length}
        onUndo={undo}
        onRedo={redo}
        onClear={clearCanvas}
        onDownload={downloadImage}
        onSave={onSave ? saveAsNote : undefined}
        onClose={onClose}
        onFileUpload={handleFileUpload}
        onRotateSelected={rotateSelectedObject}
        onResizeSelected={resizeSelectedObject}
      />

      <CanvasArea
        ref={canvasRef}
        tool={tool}
        color={color}
        brushSize={brushSize}
        objects={objects}
        selectedObject={selectedObject}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onFillClick={fillArea}
      />

      <FileUploadHandler
        ref={fileHandlerRef}
        onObjectsUpdate={handleObjectsUpdate}
        onRedraw={() => canvasRef.current?.redrawCanvas()}
      />
    </div>
  );
}
