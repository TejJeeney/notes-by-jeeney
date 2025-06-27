
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
  const [filter, setFilter] = useState('polaroid-dream');
  const [captionText, setCaptionText] = useState('');
  const [captionFont, setCaptionFont] = useState('handwriting');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filters = [
    { id: 'polaroid-dream', name: '📷 Polaroid Dream', css: 'sepia(30%) contrast(110%) brightness(105%) saturate(120%) blur(0.5px)' },
    { id: 'sepia-glow', name: '🌅 Sepia Glow', css: 'sepia(80%) contrast(120%) brightness(110%) saturate(130%)' },
    { id: 'film-grain', name: '🎞️ Film Grain', css: 'contrast(130%) brightness(90%) saturate(80%) grayscale(20%)' },
    { id: 'retro-chrome', name: '✨ Retro Chrome', css: 'saturate(70%) contrast(105%) brightness(105%) hue-rotate(5deg)' },
    { id: 'vintage-noir', name: '⚫ Vintage Noir', css: 'grayscale(100%) contrast(150%) brightness(90%)' },
    { id: 'faded-retro', name: '🌫️ Faded Retro', css: 'opacity(85%) saturate(60%) brightness(115%) contrast(90%)' },
    { id: 'cinematic-classic', name: '🎬 Cinematic Classic', css: 'contrast(115%) saturate(90%) brightness(95%) sepia(10%)' },
    { id: 'kodachrome-dreams', name: '🌈 Kodachrome Dreams', css: 'saturate(140%) contrast(115%) brightness(105%) hue-rotate(-5deg)' },
    { id: 'retro-sunset', name: '🌅 Retro Sunset', css: 'sepia(40%) saturate(150%) hue-rotate(10deg) brightness(110%)' },
    { id: 'bokeh-blast', name: '✨ Bokeh Blast', css: 'blur(0.3px) saturate(130%) brightness(110%) contrast(105%)' },
    { id: 'sunfaded-memories', name: '☀️ Sunfaded Memories', css: 'opacity(80%) saturate(60%) brightness(125%) contrast(85%)' },
    { id: 'grunge-aesthetic', name: '🖤 Grunge Aesthetic', css: 'contrast(140%) saturate(70%) brightness(85%) grayscale(30%)' }
  ];

  const fonts = [
    { id: 'handwriting', name: '✍️ Handwriting', css: '"Kalam", cursive' },
    { id: 'typewriter', name: '⌨️ Typewriter', css: '"Courier New", monospace' },
    { id: 'elegant', name: '✨ Elegant Script', css: '"Dancing Script", cursive' },
    { id: 'modern', name: '🔤 Modern Sans', css: '"Inter", sans-serif' },
    { id: 'vintage', name: '📜 Vintage Serif', css: '"Playfair Display", serif' },
    { id: 'casual', name: '👍 Casual', css: '"Comic Sans MS", cursive' },
    { id: 'inter', name: '✨ Inter', css: '"Inter", sans-serif' },
    { id: 'poppins', name: '✨ Poppins', css: '"Poppins", sans-serif' },
    { id: 'roboto', name: '✨ Roboto', css: '"Roboto", sans-serif' },
    { id: 'lato', name: '✨ Lato', css: '"Lato", sans-serif' },
    { id: 'montserrat', name: '✨ Montserrat', css: '"Montserrat", sans-serif' },
    { id: 'open-sans', name: '✨ Open Sans', css: '"Open Sans", sans-serif' },
    { id: 'nunito', name: '✨ Nunito', css: '"Nunito", sans-serif' },
    { id: 'work-sans', name: '✨ Work Sans', css: '"Work Sans", sans-serif' },
    { id: 'dm-sans', name: '✨ DM Sans', css: '"DM Sans", sans-serif' },
    { id: 'raleway', name: '🎨 Raleway', css: '"Raleway", sans-serif' },
    { id: 'quicksand', name: '🎨 Quicksand', css: '"Quicksand", sans-serif' },
    { id: 'space-grotesk', name: '🎨 Space Grotesk', css: '"Space Grotesk", sans-serif' },
    { id: 'sora', name: '🎨 Sora', css: '"Sora", sans-serif' },
    { id: 'cabin', name: '🎨 Cabin', css: '"Cabin", sans-serif' },
    { id: 'josefin-sans', name: '🎨 Josefin Sans', css: '"Josefin Sans", sans-serif' },
    { id: 'orbitron', name: '🧠 Orbitron', css: '"Orbitron", sans-serif' },
    { id: 'exo-2', name: '🧠 Exo 2', css: '"Exo 2", sans-serif' },
    { id: 'share-tech', name: '🧠 Share Tech Mono', css: '"Share Tech Mono", monospace' },
    { id: 'titillium', name: '🧠 Titillium Web', css: '"Titillium Web", sans-serif' },
    { id: 'jetbrains', name: '🧠 JetBrains Mono', css: '"JetBrains Mono", monospace' },
    { id: 'comic-neue', name: '🎭 Comic Neue', css: '"Comic Neue", cursive' },
    { id: 'baloo', name: '🎭 Baloo 2', css: '"Baloo 2", cursive' },
    { id: 'luckiest', name: '🎭 Luckiest Guy', css: '"Luckiest Guy", cursive' },
    { id: 'fredoka', name: '🎭 Fredoka', css: '"Fredoka", sans-serif' },
    { id: 'gloria', name: '🎭 Gloria Hallelujah', css: '"Gloria Hallelujah", cursive' },
    { id: 'bangers', name: '🎭 Bangers', css: '"Bangers", cursive' },
    { id: 'cinzel', name: '📜 Cinzel', css: '"Cinzel", serif' },
    { id: 'playfair', name: '📜 Playfair Display', css: '"Playfair Display", serif' },
    { id: 'cormorant', name: '📜 Cormorant Garamond', css: '"Cormorant Garamond", serif' },
    { id: 'great-vibes', name: '📜 Great Vibes', css: '"Great Vibes", cursive' }
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
          case 'polaroid-dream':
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(139, 69, 19, 0.2)';
            ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
            break;
          case 'sepia-glow':
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(139, 69, 19, 0.4)';
            ctx.fillRect(photoX, photoY, photoWidth, photoHeight);
            break;
          case 'vintage-noir':
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
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Description Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-center text-gray-700 dark:text-gray-300 leading-relaxed">
            📸 <strong>Capture memories in style!</strong> Use the device's camera to snap a picture or upload an existing image, 
            and apply a selection of nostalgic filters that give your photos that timeless retro touch. Whether you want your shot 
            to have that classic film look, soft vintage hues, or a touch of grunge, we've got you covered. Choose your favorite 
            filter below and let's bring your photos back to the golden age of photography! ✨
          </p>
        </CardContent>
      </Card>

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
                    <SelectContent className="max-h-60">
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
