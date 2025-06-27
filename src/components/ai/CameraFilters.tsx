
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera, Download, Sparkles, Type } from 'lucide-react';

export function CameraFilters() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState('vintage');
  const [captionText, setCaptionText] = useState('');
  const [captionFont, setCaptionFont] = useState('handwriting');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filters = [
    { id: 'vintage', name: '📷 Vintage Sepia', css: 'sepia(100%) contrast(120%) brightness(90%)' },
    { id: 'retro', name: '🌈 Retro Film', css: 'saturate(150%) hue-rotate(10deg) contrast(110%)' },
    { id: 'blackwhite', name: '⚫ Black & White', css: 'grayscale(100%) contrast(120%)' },
    { id: 'warm', name: '🔥 Warm Tone', css: 'sepia(30%) saturate(130%) brightness(105%)' },
    { id: 'cool', name: '❄️ Cool Tone', css: 'hue-rotate(180deg) saturate(120%) brightness(95%)' },
    { id: 'faded', name: '🌫️ Faded Film', css: 'opacity(85%) saturate(80%) brightness(110%)' }
  ];

  const fonts = [
    { id: 'handwriting', name: '✍️ Handwriting', css: '"Kalam", cursive' },
    { id: 'typewriter', name: '⌨️ Typewriter', css: '"Courier New", monospace' },
    { id: 'elegant', name: '✨ Elegant Script', css: '"Dancing Script", cursive' },
    { id: 'modern', name: '🔤 Modern Sans', css: '"Inter", sans-serif' },
    { id: 'vintage', name: '📜 Vintage Serif', css: '"Playfair Display", serif' },
    { id: 'casual', name: '👍 Casual', css: '"Comic Sans MS", cursive' }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAICaption = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          prompt: 'Generate a short, memorable caption for a vintage polaroid photo. Make it nostalgic, warm, and perfect for preserving memories. Keep it under 20 words.', 
          action: 'compliment' 
        }
      });

      if (error) throw error;
      setCaptionText(data.result);
      toast.success('AI caption generated!');
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error('Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  const downloadPolaroid = useCallback(() => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Polaroid dimensions
      const polaroidWidth = 400;
      const polaroidHeight = 480;
      const photoWidth = 360;
      const photoHeight = 360;
      const photoX = 20;
      const photoY = 20;
      const captionY = 400;

      canvas.width = polaroidWidth;
      canvas.height = polaroidHeight;

      // Draw white polaroid background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, polaroidWidth, polaroidHeight);

      // Add subtle shadow/border effect
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, polaroidWidth, 10);
      ctx.fillRect(0, 0, 10, polaroidHeight);

      // Draw the filtered image
      ctx.save();
      
      // Apply filter effect by drawing the image
      ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);
      
      // Apply filter overlay
      const selectedFilter = filters.find(f => f.id === filter);
      if (selectedFilter) {
        // Basic filter simulation
        switch (filter) {
          case 'vintage':
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
            ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
            break;
          case 'blackwhite':
            ctx.globalCompositeOperation = 'saturation';
            ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
            ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
            break;
        }
      }
      
      ctx.restore();

      // Draw caption
      if (captionText.trim()) {
        const selectedFont = fonts.find(f => f.id === captionFont);
        const fontFamily = selectedFont ? selectedFont.css.replace(/"/g, '') : 'Arial';
        
        ctx.fillStyle = '#333333';
        ctx.font = `18px ${fontFamily}`;
        ctx.textAlign = 'center';
        
        // Word wrap for caption
        const words = captionText.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > photoWidth - 40 && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        
        // Draw each line
        lines.forEach((line, index) => {
          ctx.fillText(line, polaroidWidth / 2, captionY + (index * 24));
        });
      }

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `polaroid-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Polaroid downloaded!');
        }
      });
    };

    img.src = selectedImage;
  }, [selectedImage, filter, captionText, captionFont]);

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              Upload Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full text-xs sm:text-sm"
            >
              Choose Image
            </Button>
            
            {selectedImage && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Vintage Filter</label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Caption Font</label>
                  <Select value={captionFont} onValueChange={setCaptionFont}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font.id} value={font.id}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <label className="text-xs sm:text-sm font-medium">Polaroid Caption</label>
                    <Button
                      onClick={generateAICaption}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      {loading ? 'Generating...' : 'AI Caption'}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Write a memory caption for your polaroid..."
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    className="text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{captionText.length}/100 characters</p>
                </div>

                <Button
                  onClick={downloadPolaroid}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Download Polaroid
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Type className="w-4 h-4 sm:w-5 sm:h-5" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedImage ? (
              <div className="space-y-4">
                {/* Live Preview */}
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto" style={{ aspectRatio: '4/4.8' }}>
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-auto rounded border"
                      style={{
                        filter: filters.find(f => f.id === filter)?.css || 'none',
                        aspectRatio: '1/1',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  {captionText && (
                    <div 
                      className="mt-3 text-center text-gray-800 text-sm leading-relaxed"
                      style={{ 
                        fontFamily: fonts.find(f => f.id === captionFont)?.css.replace(/"/g, '') || 'Arial',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {captionText}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-gray-500">Upload an image to see the preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
