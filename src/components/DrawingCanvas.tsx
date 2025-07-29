import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X, Save, Pen, Eraser, Palette, Circle, Square, Type, Undo, Redo, ZoomIn, ZoomOut, RotateCcw, Download, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface DrawingCanvasProps {
  onSave: (imageData: string, title: string) => void;
  onClose: () => void;
}

interface DrawingAction {
  type: string;
  data: ImageData;
}

export function DrawingCanvas({ onSave, onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'brush' | 'eraser' | 'fill' | 'circle' | 'square' | 'text'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [title, setTitle] = useState('My Drawing');
  const [zoom, setZoom] = useState(100);
  const [undoStack, setUndoStack] = useState<DrawingAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingAction[]>([]);
  const [brushType, setBrushType] = useState('round');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const saveState = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, { type: 'state', data: imageData }]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, { type: 'state', data: currentState }]);

    const previousState = undoStack[undoStack.length - 1];
    ctx.putImageData(previousState.data, 0, 0);
    setUndoStack(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, { type: 'state', data: currentState }]);

    const nextState = redoStack[redoStack.length - 1];
    ctx.putImageData(nextState.data, 0, 0);
    setRedoStack(prev => prev.slice(0, -1));
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    saveState();
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    if (currentTool === 'text') {
      setTextPosition({ x, y });
      setShowTextInput(true);
      return;
    }

    if (currentTool === 'fill') {
      floodFill(x, y);
      return;
    }
    
    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = brushType === 'round' ? 'round' : 'square';
      ctx.lineJoin = 'round';
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = brushOpacity / 100;
      
      if (currentTool === 'pen' || currentTool === 'brush') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
      } else if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      }
      
      if (currentTool === 'circle' || currentTool === 'square') {
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
      } else {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (currentTool === 'circle' || currentTool === 'square') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (currentTool === 'circle') {
          const radius = Math.sqrt(Math.pow(x - textPosition.x, 2) + Math.pow(y - textPosition.y, 2));
          ctx.beginPath();
          ctx.arc(textPosition.x, textPosition.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (currentTool === 'square') {
          ctx.strokeRect(textPosition.x, textPosition.y, x - textPosition.x, y - textPosition.y);
        }
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const floodFill = (startX: number, startY: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const targetColor = getPixelColor(data, Math.floor(startX), Math.floor(startY), canvas.width);
    const fillColor = hexToRgb(currentColor);
    
    if (!fillColor || colorsEqual(targetColor, fillColor)) return;
    
    const pixelsToCheck = [Math.floor(startX), Math.floor(startY)];
    
    while (pixelsToCheck.length > 0) {
      const y = pixelsToCheck.pop()!;
      const x = pixelsToCheck.pop()!;
      
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const currentColor = getPixelColor(data, x, y, canvas.width);
      if (!colorsEqual(currentColor, targetColor)) continue;
      
      setPixelColor(data, x, y, canvas.width, fillColor);
      
      pixelsToCheck.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2],
      a: data[index + 3]
    };
  };

  const setPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number, color: {r: number, g: number, b: number}) => {
    const index = (y * width + x) * 4;
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
    data[index + 3] = 255;
  };

  const colorsEqual = (c1: any, c2: any) => {
    return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const addText = () => {
    if (!textInput.trim() || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = `${brushSize * 2}px Arial`;
    ctx.fillStyle = currentColor;
    ctx.fillText(textInput, textPosition.x, textPosition.y);
    
    setTextInput('');
    setShowTextInput(false);
    toast.success('Text added to canvas!');
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    saveState();
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const downloadCanvas = (format: 'png' | 'jpeg' | 'svg') => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.${format}`;
    
    if (format === 'svg') {
      toast.error('SVG export not implemented yet');
      return;
    }
    
    link.href = canvasRef.current.toDataURL(`image/${format}`, 1.0);
    link.click();
    toast.success(`Drawing downloaded as ${format.toUpperCase()}!`);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    // Convert canvas to blob and create a PNG file
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        // Create a download link for PNG file
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('Drawing saved as PNG file!');
      }
    }, 'image/png', 1.0);
    
    // Still call the onSave callback for any other functionality
    const imageData = canvasRef.current.toDataURL('image/png', 1.0);
    onSave(imageData, title);
  };

  const zoomCanvas = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoom < 300) {
      setZoom(prev => Math.min(prev + 25, 300));
    } else if (direction === 'out' && zoom > 50) {
      setZoom(prev => Math.max(prev - 25, 50));
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800">
      {/* Mobile-responsive header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm"
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:scale-110 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-sm sm:text-base"
            placeholder="Drawing title..."
          />
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{zoom}%</span>
        </div>
        
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
          <Button onClick={handleSave} size="sm" className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none text-xs sm:text-sm">
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Save
          </Button>
          <Select onValueChange={(value: 'png' | 'jpeg') => downloadCanvas(value)}>
            <SelectTrigger className="w-20 sm:w-32 text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Export
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile-responsive sidebar */}
        <div className="w-full sm:w-64 md:w-80 bg-gray-50 dark:bg-slate-700 border-r border-gray-200 dark:border-gray-600 p-2 sm:p-4 overflow-y-auto">
          <div className="space-y-3 sm:space-y-6">
            {/* Drawing Tools */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm">Drawing Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="grid grid-cols-4 gap-1 sm:gap-2">
                  <Button
                    variant={currentTool === 'pen' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('pen')}
                    className="h-8 sm:h-10"
                  >
                    <Pen className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'brush' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('brush')}
                    className="h-8 sm:h-10"
                  >
                    <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'eraser' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('eraser')}
                    className="h-8 sm:h-10"
                  >
                    <Eraser className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'fill' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('fill')}
                    className="h-8 sm:h-10 text-xs"
                  >
                    🪣
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  <Button
                    variant={currentTool === 'circle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('circle')}
                    className="h-8 sm:h-10"
                  >
                    <Circle className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'square' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('square')}
                    className="h-8 sm:h-10"
                  >
                    <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant={currentTool === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentTool('text')}
                    className="h-8 sm:h-10"
                  >
                    <Type className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Brush Settings */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm">Brush Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Color</label>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-full h-8 sm:h-10 rounded border cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Size: {brushSize}px</label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={([value]) => setBrushSize(value)}
                    min={1}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Opacity: {brushOpacity}%</label>
                  <Slider
                    value={[brushOpacity]}
                    onValueChange={([value]) => setBrushOpacity(value)}
                    min={10}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Brush Type</label>
                  <Select value={brushType} onValueChange={setBrushType}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <Button onClick={undo} variant="outline" size="sm" disabled={undoStack.length === 0} className="text-xs">
                    <Undo className="w-3 h-3 mr-1" />
                    Undo
                  </Button>
                  <Button onClick={redo} variant="outline" size="sm" disabled={redoStack.length === 0} className="text-xs">
                    <Redo className="w-3 h-3 mr-1" />
                    Redo
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                  <Button onClick={() => zoomCanvas('in')} variant="outline" size="sm" className="text-xs">
                    <ZoomIn className="w-3 h-3" />
                  </Button>
                  <Button onClick={() => zoomCanvas('out')} variant="outline" size="sm" className="text-xs">
                    <ZoomOut className="w-3 h-3" />
                  </Button>
                </div>
                
                <Button onClick={clearCanvas} variant="destructive" size="sm" className="w-full text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Clear Canvas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="flex-1 p-2 sm:p-4 overflow-auto">
          <div 
            className="mx-auto border border-gray-300 dark:border-gray-600 bg-white shadow-lg"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="cursor-crosshair max-w-full h-auto"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>
      </div>

      {/* Text Input Modal */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-96">
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Add Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                autoFocus
                className="text-sm sm:text-base"
              />
              <div className="flex gap-2">
                <Button onClick={addText} className="flex-1 text-xs sm:text-sm">Add Text</Button>
                <Button onClick={() => setShowTextInput(false)} variant="outline" className="text-xs sm:text-sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
