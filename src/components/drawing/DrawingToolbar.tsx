
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Download, Save, Trash2, Undo, Redo, Upload, Move, RotateCw } from 'lucide-react';

type Tool = 'pen' | 'pencil' | 'highlighter' | 'eraser' | 'fill' | 'move';

interface DrawingToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  selectedObject: string | null;
  historyIndex: number;
  historyLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
  onSave?: () => void;
  onClose?: () => void;
  onFileUpload: () => void;
  onRotateSelected: () => void;
  onResizeSelected: (scale: number) => void;
}

export function DrawingToolbar({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  selectedObject,
  historyIndex,
  historyLength,
  onUndo,
  onRedo,
  onClear,
  onDownload,
  onSave,
  onClose,
  onFileUpload,
  onRotateSelected,
  onResizeSelected
}: DrawingToolbarProps) {
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'
  ];

  return (
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

      {/* Colors */}
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
        onClick={onFileUpload}
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
            onClick={onRotateSelected}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResizeSelected(1.2)}
            className="text-xs sm:text-sm transition-all hover:scale-105"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResizeSelected(0.8)}
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
          onClick={onUndo}
          disabled={historyIndex <= 0}
          className="text-xs sm:text-sm transition-all hover:scale-105"
        >
          <Undo className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={historyIndex >= historyLength - 1}
          className="text-xs sm:text-sm transition-all hover:scale-105"
        >
          <Redo className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
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
          onClick={onDownload}
          className="text-xs sm:text-sm transition-all hover:scale-105"
        >
          <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Export
        </Button>
        {onSave && (
          <Button
            size="sm"
            onClick={onSave}
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
  );
}
